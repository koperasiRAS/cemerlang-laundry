-- SCRIPT UNTUK MERESET DATA DUMMY SEBELUM PRODUKSI (LIVE)
-- Script ini HANYA akan menghapus data transaksi.
-- Data Akun (Role Admin/Owner) dan Data Layanan (Kiloan/Satuan) TIDAK AKAN TERHAPUS.

-- 1. Hapus semua data transaksi (berurutan agar tidak kena error relasi/Foreign Key)
TRUNCATE TABLE public.pickup_requests CASCADE;
TRUNCATE TABLE public.order_status_history CASCADE;
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;

-- (Opsional) Hapus pelanggan dummy. 
-- Kalau pelanggan mau dipertahankan, kasih tanda -- (comment) di baris bawah ini:
TRUNCATE TABLE public.customers CASCADE;

-- 2. Reset nomor urut antrian/Resi (LDY-YYYYMMDD-0001) kembali ke angka 1
ALTER SEQUENCE public.order_tracking_seq RESTART WITH 1;

-- SELESAI. Database sudah fresh 100% dan siap digunakan untuk Grand Opening!
