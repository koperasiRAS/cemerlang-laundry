-- ============================================================
-- SCRIPT FIX PRICELIST V3 — 10 Juli 2026
-- Berdasarkan feedback kasir + buku pricelist
-- ============================================================

-- ============================================================
-- BAGIAN A: HAPUS/NONAKTIFKAN "Setrika Saja" (TIDAK ADA DI BUKU)
-- Di buku cuma ada "Setrika Komplit", bukan "Setrika Saja"
-- ============================================================

-- Nonaktifkan SEMUA entry "Setrika Saja" (supaya tidak muncul di dropdown kasir)
UPDATE public.service_types 
SET is_active = false 
WHERE name ILIKE '%Setrika Saja%';

-- ============================================================
-- BAGIAN B: FIX HARGA SETRIKA KOMPLIT (sesuai buku & feedback kasir)
-- Kasir bilang: "strika 3hari 5000" dan "Strika 1 hari 8000"
-- ============================================================
UPDATE public.service_types SET base_price = 5000,  flow_type = 'setrika_saja' WHERE name ILIKE 'Setrika Komplit%' AND name ILIKE '%3 Hari%';
UPDATE public.service_types SET base_price = 6500,  flow_type = 'setrika_saja' WHERE name ILIKE 'Setrika Komplit%' AND name ILIKE '%2 Hari%';
UPDATE public.service_types SET base_price = 8000,  flow_type = 'setrika_saja' WHERE name ILIKE 'Setrika Komplit%' AND name ILIKE '%1 Hari%';

-- ============================================================
-- BAGIAN C: FIX HARGA CUCI KOMPLIT (sesuai buku)
-- ============================================================
UPDATE public.service_types SET base_price = 7000,  flow_type = 'cuci_komplit' WHERE name ILIKE 'Cuci Komplit%' AND name ILIKE '%3 Hari%';
UPDATE public.service_types SET base_price = 9000,  flow_type = 'cuci_komplit' WHERE name ILIKE 'Cuci Komplit%' AND name ILIKE '%2 Hari%';
UPDATE public.service_types SET base_price = 10000, flow_type = 'cuci_komplit' WHERE name ILIKE 'Cuci Komplit%' AND name ILIKE '%1 Hari%' AND name NOT ILIKE '%12 Jam%';
UPDATE public.service_types SET base_price = 15000, flow_type = 'cuci_komplit' WHERE name ILIKE 'Cuci Komplit%' AND name ILIKE '%12 Jam%';

-- ============================================================
-- BAGIAN D: CUCI KERING LIPAT (sesuai buku Rp 5.000)
-- ============================================================
UPDATE public.service_types SET base_price = 5000, flow_type = 'cuci_kering_lipat' WHERE name ILIKE '%Cuci Kering Lipat%';

-- ============================================================
-- BAGIAN E: NONAKTIFKAN LAYANAN YANG TIDAK ADA DI BUKU
-- ============================================================
UPDATE public.service_types SET is_active = false WHERE name ILIKE '%Cuci Kiloan Reguler%';

-- ============================================================
-- BAGIAN F: FIX HARGA SATUAN — Pakaian (Halaman 1 Buku)
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
-- BAGIAN G: FIX HARGA SATUAN — Formal/Pesta (Halaman 2 Buku)
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
-- BAGIAN H: FIX HARGA SATUAN — Rumah Tangga (Halaman 3 Buku)
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
UPDATE public.service_types SET base_price = 7000  WHERE name ILIKE 'Gordyn Tipis%' AND unit = 'item';
UPDATE public.service_types SET base_price = 25000 WHERE name ILIKE 'Tas Ransel%' AND unit = 'item';
UPDATE public.service_types SET base_price = 60000 WHERE name ILIKE 'Koper Besar%' AND unit = 'item';
UPDATE public.service_types SET base_price = 45000 WHERE name ILIKE 'Koper Kecil%' AND unit = 'item';
UPDATE public.service_types SET base_price = 10000 WHERE name ILIKE 'Handuk Besar%' AND unit = 'item';

-- ============================================================
-- BAGIAN I: SEPATU
-- ============================================================
UPDATE public.service_types SET base_price = 35000 WHERE name ILIKE '%Cuci Sepatu%' AND unit = 'item';

-- ============================================================
-- VERIFIKASI: Tampilkan SEMUA layanan AKTIF setelah update
-- ============================================================
SELECT name, base_price, unit, flow_type, is_active
FROM public.service_types 
ORDER BY is_active DESC, unit, name;
