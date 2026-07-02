-- Seed file for Service Types based on Cemerlang Laundry Official Catalog

-- Create a temporary table to hold our new services
CREATE TEMP TABLE temp_services (
    name text,
    unit text,
    base_price integer,
    estimated_duration_hours integer
);

INSERT INTO temp_services (name, unit, base_price, estimated_duration_hours) VALUES
-- Kiloan (Cuci Komplit)
('Cuci Komplit (3 Hari Selesai)', 'kg', 7000, 72),
('Cuci Komplit (2 Hari Selesai)', 'kg', 9000, 48),
('Cuci Komplit (1 Hari Selesai)', 'kg', 10000, 24),
('Cuci Komplit (12 Jam Selesai)', 'kg', 15000, 12),
('Cuci Kering Lipat (3 Jam)', 'kg', 5000, 3),

-- Kiloan (Setrika Komplit)
('Setrika Komplit (3 Hari Selesai)', 'kg', 5000, 72),
('Setrika Komplit (2 Hari Selesai)', 'kg', 6500, 48),
('Setrika Komplit (1 Hari Selesai)', 'kg', 8000, 24),

-- Satuan (Rumah Tangga)
('Bed Cover Besar', 'item', 35000, 72),
('Bed Cover Kecil', 'item', 25000, 72),
('Selimut', 'item', 15000, 72),
('Sprei Biasa', 'item', 10000, 72),
('Sprei Rumbai', 'item', 15000, 72),
('Sprei 1 Set (Max Bantal 6)', 'item', 20000, 72),
('Boneka Besar', 'item', 50000, 72),
('Boneka Sedang', 'item', 30000, 72),
('Boneka Kecil', 'item', 15000, 72),
('Gordyn Tebal / Meter', 'item', 7000, 72),
('Gordyn Tipis (Vitrase) / Meter', 'item', 5000, 72),
('Tas Ransel', 'item', 25000, 72),
('Koper Besar', 'item', 60000, 72),
('Koper Kecil', 'item', 45000, 72),
('Handuk Besar', 'item', 10000, 72),

-- Satuan (Pakaian Wanita/Khusus)
('Long Dress', 'item', 25000, 72),
('Blouse', 'item', 15000, 72),
('Rok & Blouse', 'item', 35000, 72),
('Kebaya Panjang', 'item', 30000, 72),
('Kebaya Pendek', 'item', 20000, 72),
('Pakaian Pengantin', 'item', 125000, 120),
('Baju Pesta', 'item', 75000, 120),
('Jas', 'item', 25000, 72),
('Jas Setelan', 'item', 40000, 72),
('Safari', 'item', 20000, 72),
('Safari Setelan', 'item', 35000, 72),
('Kerudung', 'item', 8000, 72),

-- Satuan (Pakaian Umum)
('Jacket', 'item', 15000, 72),
('Jacket Kulit', 'item', 45000, 120),
('Kemeja', 'item', 15000, 72),
('Sweater', 'item', 15000, 72),
('Sarung', 'item', 10000, 72),
('Rompi', 'item', 10000, 72),
('T-Shirt', 'item', 12000, 72),
('Celana Panjang', 'item', 15000, 72),
('Celana Jeans', 'item', 17000, 72),
('Celana Pendek', 'item', 10000, 72),
('Rok', 'item', 15000, 72),
('Topi', 'item', 10000, 72),
('Dasi', 'item', 8000, 72);

-- Insert into real table, avoiding exact duplicates by name
INSERT INTO public.service_types (name, unit, base_price, estimated_duration_hours, is_active)
SELECT t.name, t.unit, t.base_price, t.estimated_duration_hours, true
FROM temp_services t
WHERE NOT EXISTS (
    SELECT 1 FROM public.service_types s WHERE s.name = t.name
);

DROP TABLE temp_services;
