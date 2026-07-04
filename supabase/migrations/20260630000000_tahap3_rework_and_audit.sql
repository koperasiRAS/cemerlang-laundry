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

-- 2. Add the updated check constraint for 'status' including 'rework'
ALTER TABLE public.orders 
  ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('diterima', 'proses_cuci', 'proses_kering', 'setrika_lipat', 'qc', 'rework', 'siap_diambil', 'diantar', 'selesai', 'dibatalkan'));

-- 3. Update price for Cuci Lipat Express to Rp11.000 (Setelah Masa Promo)
UPDATE public.service_types 
SET base_price = 11000 
WHERE name = 'Cuci Lipat Express (3 Jam)';

-- 4. Create audit_logs table for fraud prevention
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to view audit logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');
