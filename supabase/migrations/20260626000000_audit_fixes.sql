-- 1. Perbaiki Foreign Key di pickup_requests agar ON DELETE SET NULL
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_order_id_fkey;

ALTER TABLE public.pickup_requests 
ADD CONSTRAINT pickup_requests_order_id_fkey 
FOREIGN KEY (order_id) 
REFERENCES public.orders(id) 
ON DELETE SET NULL;

-- 2. Perbarui RPC fn_create_order (tidak perlu mengubah RPC untuk update status pickup di sini karena kita bisa melakukannya di Server Action Next.js yang lebih aman dan mudah di-maintain. 
-- Wait, actually in the previous step I said I'll update fn_create_order, but we can just update the status in the server action `createOrder` after the RPC returns trackingNumber.
-- That's simpler and doesn't require complex SQL changes.
