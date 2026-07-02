-- 1. Drop the existing check constraint on 'status' column
DO $$ 
DECLARE
  v_constraint_name text;
BEGIN
  SELECT conname INTO v_constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.orders'::regclass 
    AND contype = 'c' 
    AND conname LIKE '%status%'
    AND conname NOT LIKE '%payment%';

  IF v_constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT ' || v_constraint_name;
  END IF;
END $$;

-- 2. Add the updated check constraint for 'status' including 'diantar'
ALTER TABLE public.orders 
  ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('diterima', 'proses_cuci', 'proses_kering', 'setrika_lipat', 'siap_diambil', 'diantar', 'selesai', 'dibatalkan'));

-- 3. Add delivery columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_type text DEFAULT 'pickup' CHECK (delivery_type IN ('pickup', 'delivery'));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_fee integer DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address text;

-- 4. Update fn_create_order RPC to include delivery columns if needed
-- Wait, the delivery is added at the END, so create_order RPC doesn't necessarily need to handle it.
-- But we can add them to be safe if they ever want to support delivery up front.
-- For now, we only need to update the final_price logic if delivery_fee is added.
-- Let's create an RPC to update order status and delivery info safely.

CREATE OR REPLACE FUNCTION public.fn_update_order_delivery(
  p_order_id uuid,
  p_staff_id uuid,
  p_status text,
  p_delivery_type text,
  p_delivery_fee integer,
  p_delivery_address text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update order
  UPDATE public.orders
  SET 
    status = p_status,
    delivery_type = COALESCE(p_delivery_type, delivery_type),
    delivery_fee = COALESCE(p_delivery_fee, delivery_fee),
    delivery_address = COALESCE(p_delivery_address, delivery_address)
  WHERE id = p_order_id;

  -- Insert history
  INSERT INTO public.order_status_history (order_id, status, changed_by)
  VALUES (p_order_id, p_status, p_staff_id);
END;
$$;
