-- Revert constraint orders_status_check to remove qc and rework
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN (
    'diterima', 
    'proses_cuci', 
    'proses_kering', 
    'setrika_lipat', 
    'siap_diambil', 
    'diantar', 
    'selesai', 
    'dibatalkan'
  ));
