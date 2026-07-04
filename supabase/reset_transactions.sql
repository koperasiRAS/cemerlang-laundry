-- SCRIPT RESET DATA TRANSAKSI UNTUK PRODUKSI --
-- Script ini akan menghapus semua data dummy transaksi (order, payment, pickup, dll)
-- tapi TETAP MEMPERTAHANKAN data master seperti Layanan (service_types) dan User/Staff.

-- 1. Hapus semua request penjemputan online (Tabel baru)
TRUNCATE TABLE public.pickup_requests RESTART IDENTITY CASCADE;

-- 2. Hapus history status dan item dari order
TRUNCATE TABLE public.order_status_history RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.order_items RESTART IDENTITY CASCADE;

-- 3. Hapus pengeluaran (expenses)
TRUNCATE TABLE public.expenses RESTART IDENTITY CASCADE;

-- 4. Hapus data order utama dan log auditnya
TRUNCATE TABLE public.audit_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.orders RESTART IDENTITY CASCADE;

-- 5. Hapus data pelanggan (Opsional: Kalau mau pelanggannya tetap ada, comment baris di bawah ini)
TRUNCATE TABLE public.customers RESTART IDENTITY CASCADE;

-- Note: CASCADE digunakan agar relasi antar tabel (foreign key) ikut terhapus dengan aman.
