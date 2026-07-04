-- 1. Menonaktifkan (Soft Delete) Layanan Kiloan Lama
UPDATE public.service_types
SET is_active = false
WHERE name IN (
    'Cuci Komplit (3 Hari Selesai)',
    'Cuci Komplit (2 Hari Selesai)',
    'Cuci Komplit (1 Hari Selesai)',
    'Cuci Komplit (12 Jam Selesai)',
    'Cuci Kering Lipat (3 Jam)',
    'Setrika Komplit (3 Hari Selesai)',
    'Setrika Komplit (2 Hari Selesai)',
    'Setrika Komplit (1 Hari Selesai)'
);

-- 2. Memasukkan Layanan Kiloan Baru dengan Harga, Nama, dan Flow Type yang Benar
INSERT INTO public.service_types (name, unit, base_price, estimated_duration_hours, is_active, flow_type)
VALUES
-- Kategori 1: Cuci Setrika (Cuci, Kering, Setrika, Lipat) -> flow_type: cuci_komplit
('Cuci Setrika (3 Hari Selesai)', 'kg', 8000, 72, true, 'cuci_komplit'),
('Cuci Setrika (2 Hari Selesai)', 'kg', 10000, 48, true, 'cuci_komplit'),
('Cuci Setrika (1 Hari Selesai)', 'kg', 12000, 24, true, 'cuci_komplit'),
('Cuci Setrika (12 Jam Selesai)', 'kg', 15000, 12, true, 'cuci_komplit'),

-- Kategori 2: Cuci Lipat Saja (Cuci, Kering, Lipat TANPA Setrika) -> flow_type: cuci_kering_lipat
('Cuci Lipat (3 Hari Selesai)', 'kg', 5500, 72, true, 'cuci_kering_lipat'),
('Cuci Lipat (2 Hari Selesai)', 'kg', 7000, 48, true, 'cuci_kering_lipat'),
('Cuci Lipat (1 Hari Selesai)', 'kg', 8500, 24, true, 'cuci_kering_lipat'),
('Cuci Lipat Express (3 Jam)', 'kg', 9000, 3, true, 'cuci_kering_lipat'),

-- Kategori 3: Setrika Saja (Setrika, Lipat TANPA Cuci) -> flow_type: setrika_saja
('Setrika Saja (3 Hari Selesai)', 'kg', 5500, 72, true, 'setrika_saja'),
('Setrika Saja (2 Hari Selesai)', 'kg', 7000, 48, true, 'setrika_saja'),
('Setrika Saja (1 Hari Selesai)', 'kg', 9000, 24, true, 'setrika_saja');
