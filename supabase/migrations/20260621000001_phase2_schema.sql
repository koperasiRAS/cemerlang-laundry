-- 1. Add is_active to service_types
ALTER TABLE public.service_types ADD COLUMN is_active BOOLEAN DEFAULT TRUE NOT NULL;

-- 2. Create Sequence for tracking number
CREATE SEQUENCE IF NOT EXISTS order_tracking_seq;

-- 3. Create RPC for atomic order creation
CREATE OR REPLACE FUNCTION public.fn_create_order(
  p_customer_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_staff_id uuid,
  p_service_type_id uuid,
  p_weight numeric,
  p_estimated_price integer,
  p_estimated_completion_date timestamptz,
  p_special_notes text,
  p_items jsonb -- Expected array of objects: [{"item_name": "x", "initial_condition_description": "y", "initial_condition_image_url": "z", "price": 100}]
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id uuid;
  v_order_id uuid;
  v_tracking_number text;
  v_item record;
BEGIN
  -- Handle Customer
  IF p_customer_id IS NULL THEN
    -- Check if phone number already exists
    SELECT id INTO v_customer_id FROM public.customers WHERE phone_number = p_customer_phone;
    IF v_customer_id IS NULL THEN
      INSERT INTO public.customers (name, phone_number, address)
      VALUES (p_customer_name, p_customer_phone, p_customer_address)
      RETURNING id INTO v_customer_id;
    END IF;
  ELSE
    v_customer_id := p_customer_id;
  END IF;

  -- Generate Tracking Number: LDY-YYYYMMDD-XXXX
  v_tracking_number := 'LDY-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('order_tracking_seq')::text, 4, '0');

  -- Insert Order
  INSERT INTO public.orders (
    tracking_number,
    customer_id,
    staff_id,
    service_type_id,
    weight,
    estimated_price,
    estimated_completion_date,
    special_notes,
    status,
    payment_status
  ) VALUES (
    v_tracking_number,
    v_customer_id,
    p_staff_id,
    p_service_type_id,
    p_weight,
    p_estimated_price,
    p_estimated_completion_date,
    p_special_notes,
    'diterima',
    'unpaid'
  ) RETURNING id INTO v_order_id;

  -- Insert Order Items
  IF p_items IS NOT NULL AND jsonb_array_length(p_items) > 0 THEN
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(item_name text, initial_condition_description text, initial_condition_image_url text, price integer)
    LOOP
      INSERT INTO public.order_items (
        order_id,
        item_name,
        initial_condition_description,
        initial_condition_image_url,
        price
      ) VALUES (
        v_order_id,
        v_item.item_name,
        v_item.initial_condition_description,
        v_item.initial_condition_image_url,
        v_item.price
      );
    END LOOP;
  END IF;

  -- Insert Status History
  INSERT INTO public.order_status_history (
    order_id,
    status,
    changed_by
  ) VALUES (
    v_order_id,
    'diterima',
    p_staff_id
  );

  RETURN v_tracking_number;
END;
$$;

-- 4. Setup Storage Bucket for order_item_images
-- (Requires supabase storage extension or running as superuser, typically done via supabase dashboard or seed, but we can try to insert into storage.buckets)
INSERT INTO storage.buckets (id, name, public) VALUES ('order_item_images', 'order_item_images', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'order_item_images');
CREATE POLICY "Allow authenticated updates" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'order_item_images');
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'order_item_images');
-- Allow public access since bucket is public
CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (bucket_id = 'order_item_images');
