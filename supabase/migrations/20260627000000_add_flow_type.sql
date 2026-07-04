-- 1. Menambahkan kolom flow_type ke service_types
ALTER TABLE public.service_types
ADD COLUMN IF NOT EXISTS flow_type VARCHAR(50) DEFAULT 'cuci_komplit';

-- Mengupdate flow_type berdasarkan nama layanan saat ini
UPDATE public.service_types
SET flow_type = 'setrika_saja'
WHERE name ILIKE '%setrika%';

UPDATE public.service_types
SET flow_type = 'cuci_kering_lipat'
WHERE name ILIKE '%cuci kering%' OR name ILIKE '%cuci%kering%lipat%';

-- 2. Menambahkan kolom return_method ke pickup_requests
ALTER TABLE public.pickup_requests
ADD COLUMN IF NOT EXISTS return_method VARCHAR(50) DEFAULT 'ambil_sendiri';
