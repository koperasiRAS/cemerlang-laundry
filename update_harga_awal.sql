-- ============================================================
-- SCRIPT FIX LENGKAP: NAMA, HARGA, & FLOW TYPE
-- Sesuai SEMUA Halaman Buku Pricelist Cemerlang Laundry
-- ============================================================

-- ============================================================
-- BAGIAN A: FIX LAYANAN KILOAN
-- ============================================================

-- A1. Rename "Cuci Setrika (12 Jam Selesai)" → "Cuci Komplit (12 Jam Selesai)"
--     Karena di buku, 12 Jam itu masuk Cuci Komplit
UPDATE public.service_types 
SET name = 'Cuci Komplit (12 Jam Selesai)', base_price = 15000, flow_type = 'cuci_komplit'
WHERE name ILIKE '%Cuci Setrika%' AND name ILIKE '%12 Jam%';

-- A2. Rename "Cuci Setrika (3 Hari)" → "Setrika Komplit (3 Hari Selesai)"
UPDATE public.service_types 
SET name = 'Setrika Komplit (3 Hari Selesai)', base_price = 5000, flow_type = 'setrika_saja'
WHERE name ILIKE '%Cuci Setrika%' AND name ILIKE '%3 Hari%';

-- A3. Rename "Cuci Setrika (2 Hari)" → "Setrika Komplit (2 Hari Selesai)"
UPDATE public.service_types 
SET name = 'Setrika Komplit (2 Hari Selesai)', base_price = 6500, flow_type = 'setrika_saja'
WHERE name ILIKE '%Cuci Setrika%' AND name ILIKE '%2 Hari%';

-- A4. Rename "Cuci Setrika (1 Hari)" → "Setrika Komplit (1 Hari Selesai)"
UPDATE public.service_types 
SET name = 'Setrika Komplit (1 Hari Selesai)', base_price = 8000, flow_type = 'setrika_saja'
WHERE name ILIKE '%Cuci Setrika%' AND name ILIKE '%1 Hari%';

-- A5. Rename "Cuci Komplit Express (3 Jam)" → "Cuci Kering Lipat (3 Jam)"
--     Di buku ini Rp 5.000, BUKAN 15rb
UPDATE public.service_types 
SET name = 'Cuci Kering Lipat (3 Jam)', base_price = 5000, flow_type = 'cuci_kering_lipat'
WHERE name ILIKE '%Cuci Komplit Express%' OR (name ILIKE '%Cuci Komplit%' AND name ILIKE '%3 Jam%');

-- A6. Fix harga Cuci Komplit (yang sudah benar namanya)
UPDATE public.service_types SET base_price = 7000,  flow_type = 'cuci_komplit' WHERE name ILIKE 'Cuci Komplit%3 Hari%';
UPDATE public.service_types SET base_price = 9000,  flow_type = 'cuci_komplit' WHERE name ILIKE 'Cuci Komplit%2 Hari%';
UPDATE public.service_types SET base_price = 10000, flow_type = 'cuci_komplit' WHERE name ILIKE 'Cuci Komplit%1 Hari%' AND name NOT ILIKE '%12 Jam%';
UPDATE public.service_types SET base_price = 15000, flow_type = 'cuci_komplit' WHERE name ILIKE 'Cuci Komplit%12 Jam%';

-- A7. Cuci Kiloan Reguler (tidak ada di buku pricelist, nonaktifkan)
-- Kalau mau tetap aktif, beri tanda -- di baris bawah:
UPDATE public.service_types SET is_active = false WHERE name ILIKE '%Cuci Kiloan Reguler%';

-- ============================================================
-- BAGIAN B: FIX LAYANAN SATUAN — Halaman Pakaian
-- ============================================================
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Jacket' AND unit = 'item';
UPDATE public.service_types SET base_price = 45000 WHERE name ILIKE 'Jacket Kulit%' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Kemeja' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Sweater' AND unit = 'item';
UPDATE public.service_types SET base_price = 10000 WHERE name ILIKE 'Sarung' AND unit = 'item';
UPDATE public.service_types SET base_price = 10000 WHERE name ILIKE 'Rompi' AND unit = 'item';
UPDATE public.service_types SET base_price = 12000 WHERE name ILIKE 'T-Shirt' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Celana Panjang' AND unit = 'item';
UPDATE public.service_types SET base_price = 17000 WHERE name ILIKE 'Celana Jeans' AND unit = 'item';
UPDATE public.service_types SET base_price = 10000 WHERE name ILIKE 'Celana Pendek' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Rok' AND unit = 'item' AND name NOT ILIKE '%Blouse%';
UPDATE public.service_types SET base_price = 10000 WHERE name ILIKE 'Topi' AND unit = 'item';
UPDATE public.service_types SET base_price = 8000  WHERE name ILIKE 'Dasi' AND unit = 'item';

-- ============================================================
-- BAGIAN C: FIX LAYANAN SATUAN — Halaman Formal/Pesta
-- ============================================================
UPDATE public.service_types SET base_price = 25000  WHERE name ILIKE 'Long Dress%' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000  WHERE name ILIKE 'Blouse' AND unit = 'item';
UPDATE public.service_types SET base_price = 35000  WHERE name ILIKE 'Rok%Blouse%' AND unit = 'item';
UPDATE public.service_types SET base_price = 30000  WHERE name ILIKE 'Kebaya Panjang%' AND unit = 'item';
UPDATE public.service_types SET base_price = 20000  WHERE name ILIKE 'Kebaya Pendek%' AND unit = 'item';
UPDATE public.service_types SET base_price = 125000 WHERE name ILIKE '%Pakaian Pengantin%' AND unit = 'item';
UPDATE public.service_types SET base_price = 75000  WHERE name ILIKE '%Baju Pesta%' AND unit = 'item';
UPDATE public.service_types SET base_price = 25000  WHERE name ILIKE 'Jas' AND unit = 'item' AND name NOT ILIKE '%Setelan%';
UPDATE public.service_types SET base_price = 40000  WHERE name ILIKE 'Jas Setelan%' AND unit = 'item';
UPDATE public.service_types SET base_price = 20000  WHERE name ILIKE 'Safari' AND unit = 'item' AND name NOT ILIKE '%Setelan%';
UPDATE public.service_types SET base_price = 35000  WHERE name ILIKE 'Safari Setelan%' AND unit = 'item';
UPDATE public.service_types SET base_price = 8000   WHERE name ILIKE 'Kerudung%' AND unit = 'item';

-- ============================================================
-- BAGIAN D: FIX LAYANAN SATUAN — Halaman Rumah Tangga
-- ============================================================
UPDATE public.service_types SET base_price = 35000 WHERE name ILIKE 'Bed Cover Besar%' AND unit = 'item';
UPDATE public.service_types SET base_price = 25000 WHERE name ILIKE 'Bed Cover Kecil%' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Selimut%' AND unit = 'item';
UPDATE public.service_types SET base_price = 10000 WHERE name ILIKE 'Sprei Biasa%' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Sprei Rumbai%' AND unit = 'item';
UPDATE public.service_types SET base_price = 20000 WHERE name ILIKE 'Sprei 1 Set%' AND unit = 'item';
UPDATE public.service_types SET base_price = 50000 WHERE name ILIKE 'Boneka Besar%' AND unit = 'item';
UPDATE public.service_types SET base_price = 30000 WHERE name ILIKE 'Boneka Sedang%' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Boneka Kecil%' AND unit = 'item';
UPDATE public.service_types SET base_price = 15000 WHERE name ILIKE 'Gordyn Tebal%' AND unit = 'item';
UPDATE public.service_types SET base_price = 5000  WHERE name ILIKE 'Gordyn Tipis%' AND unit = 'item';
UPDATE public.service_types SET base_price = 25000 WHERE name ILIKE 'Tas Ransel%' AND unit = 'item';
UPDATE public.service_types SET base_price = 60000 WHERE name ILIKE 'Koper Besar%' AND unit = 'item';
UPDATE public.service_types SET base_price = 45000 WHERE name ILIKE 'Koper Kecil%' AND unit = 'item';
UPDATE public.service_types SET base_price = 10000 WHERE name ILIKE 'Handuk Besar%' AND unit = 'item';

-- ============================================================
-- BAGIAN E: FIX LAYANAN SATUAN — Sepatu
-- ============================================================
UPDATE public.service_types SET base_price = 35000 WHERE name ILIKE '%Cuci Sepatu%' AND unit = 'item';

-- ============================================================
-- VERIFIKASI: Cek SEMUA layanan aktif setelah update
-- ============================================================
SELECT name, base_price, unit, flow_type, is_active
FROM public.service_types 
WHERE is_active = true
ORDER BY unit, name;
