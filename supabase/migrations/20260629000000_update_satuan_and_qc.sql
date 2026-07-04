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

-- 2. Add the updated check constraint for 'status' including 'qc'
ALTER TABLE public.orders 
  ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('diterima', 'proses_cuci', 'proses_kering', 'setrika_lipat', 'qc', 'siap_diambil', 'diantar', 'selesai', 'dibatalkan'));

-- 3. Update Satuan prices and names
UPDATE public.service_types SET name = 'Pakaian Pengantin (Mulai dari)', base_price = 150000 WHERE name = 'Pakaian Pengantin';
UPDATE public.service_types SET name = 'Baju Pesta (Mulai dari)' WHERE name = 'Baju Pesta';
UPDATE public.service_types SET name = 'Jas Setelan (Mulai dari)', base_price = 50000 WHERE name = 'Jas Setelan';
UPDATE public.service_types SET name = 'Jas (Mulai dari)', base_price = 35000 WHERE name = 'Jas';
UPDATE public.service_types SET name = 'Kebaya Panjang (Mulai dari)', base_price = 45000 WHERE name = 'Kebaya Panjang';
UPDATE public.service_types SET name = 'Kebaya Pendek (Mulai dari)', base_price = 30000 WHERE name = 'Kebaya Pendek';
UPDATE public.service_types SET name = 'Jacket Kulit (Mulai dari)', base_price = 60000 WHERE name = 'Jacket Kulit';
UPDATE public.service_types SET name = 'Sprei 1 Set (Mulai dari)', base_price = 25000 WHERE name = 'Sprei 1 Set (Max Bantal 6)';
