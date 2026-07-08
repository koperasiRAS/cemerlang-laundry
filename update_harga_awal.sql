-- ============================================================
-- SCRIPT FIX NAMA & HARGA LAYANAN KILOAN
-- Sesuai Daftar Harga di Buku Pricelist Cemerlang Laundry
-- ============================================================

-- ============================================================
-- BAGIAN A: FIX NAMA LAYANAN (Rename ke nama yang benar)
-- ============================================================

-- Fix nama: Pastikan semua "Cuci Lipat" atau variasi lain → "Cuci Komplit"
UPDATE public.service_types 
SET name = REPLACE(name, 'Cuci Lipat', 'Cuci Komplit') 
WHERE name ILIKE '%Cuci Lipat%' AND name NOT ILIKE '%Cuci Kering Lipat%';

-- Fix nama: Pastikan "Setrika Lipat" → "Setrika Komplit"
UPDATE public.service_types 
SET name = REPLACE(name, 'Setrika Lipat', 'Setrika Komplit') 
WHERE name ILIKE '%Setrika Lipat%';

-- ============================================================
-- BAGIAN B: FIX HARGA SESUAI BUKU PRICELIST
-- ============================================================

-- 1. CUCI KOMPLIT (cuci + kering + setrika + lipat)
UPDATE public.service_types SET base_price = 7000  WHERE name ILIKE '%Cuci Komplit%' AND name ILIKE '%3 Hari%';
UPDATE public.service_types SET base_price = 9000  WHERE name ILIKE '%Cuci Komplit%' AND name ILIKE '%2 Hari%';
UPDATE public.service_types SET base_price = 10000 WHERE name ILIKE '%Cuci Komplit%' AND name ILIKE '%1 Hari%' AND name NOT ILIKE '%12 Jam%';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE '%Cuci Komplit%' AND (name ILIKE '%12 Jam%' OR name ILIKE '%Express%');

-- 2. CUCI KERING LIPAT (cuci + kering + lipat, TANPA setrika)
UPDATE public.service_types SET base_price = 5000  WHERE name ILIKE '%Cuci Kering Lipat%';

-- 3. SETRIKA KOMPLIT (setrika + lipat, TANPA cuci)
UPDATE public.service_types SET base_price = 5000  WHERE name ILIKE '%Setrika Komplit%' AND name ILIKE '%3 Hari%';
UPDATE public.service_types SET base_price = 6500  WHERE name ILIKE '%Setrika Komplit%' AND name ILIKE '%2 Hari%';
UPDATE public.service_types SET base_price = 8000  WHERE name ILIKE '%Setrika Komplit%' AND name ILIKE '%1 Hari%';

-- ============================================================
-- BAGIAN C: FIX FLOW TYPE (untuk alur status order yang benar)
-- ============================================================

-- Cuci Komplit: diterima → proses_cuci → proses_kering → setrika_lipat → siap_diambil/diantar → selesai
UPDATE public.service_types SET flow_type = 'cuci_komplit' WHERE name ILIKE '%Cuci Komplit%';

-- Cuci Kering Lipat: diterima → proses_cuci → proses_kering → siap_diambil/diantar → selesai (TANPA setrika)
UPDATE public.service_types SET flow_type = 'cuci_kering_lipat' WHERE name ILIKE '%Cuci Kering Lipat%';

-- Setrika Komplit: diterima → setrika_lipat → siap_diambil/diantar → selesai (TANPA cuci/kering)
UPDATE public.service_types SET flow_type = 'setrika_saja' WHERE name ILIKE '%Setrika Komplit%';

-- ============================================================
-- VERIFIKASI: Cek hasil update
-- ============================================================
SELECT name, base_price, unit, flow_type, estimated_duration_hours, is_active 
FROM public.service_types 
WHERE unit = 'kg'
ORDER BY name;
