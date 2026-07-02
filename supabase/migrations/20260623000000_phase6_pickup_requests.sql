-- Create pickup_requests table
CREATE TABLE IF NOT EXISTS public.pickup_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reference_number text UNIQUE NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    customer_address text NOT NULL,
    maps_link text,
    service_type_estimate text,
    preferred_date date NOT NULL,
    preferred_time_slot text NOT NULL,
    special_notes text,
    status text DEFAULT 'Baru' CHECK (status IN ('Baru', 'Dikonfirmasi', 'Sudah Dijemput', 'Dibatalkan')),
    order_id uuid REFERENCES public.orders(id),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Sequence for reference number
CREATE SEQUENCE IF NOT EXISTS pickup_request_seq;

-- Function to generate reference number on insert
CREATE OR REPLACE FUNCTION public.fn_set_pickup_reference()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.reference_number IS NULL THEN
        NEW.reference_number := 'REQ-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('pickup_request_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$;

-- Trigger to set reference number
CREATE TRIGGER set_pickup_reference_trigger
    BEFORE INSERT ON public.pickup_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_set_pickup_reference();

-- RLS Policies for pickup_requests
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anon or authenticated without roles checking, simpler is anon)
CREATE POLICY "Allow public insert to pickup_requests" 
    ON public.pickup_requests 
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated (staff/admin) to select and update
CREATE POLICY "Allow authenticated access to pickup_requests" 
    ON public.pickup_requests 
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow authenticated update to pickup_requests" 
    ON public.pickup_requests 
    FOR UPDATE 
    TO authenticated 
    USING (true);
