-- Create storage buckets for products and order items
insert into storage.buckets (id, name, public)
values 
  ('product_images', 'product_images', true),
  ('order_item_images', 'order_item_images', true);

-- Policies for product_images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'product_images' );

create policy "Auth Insert"
  on storage.objects for insert
  with check ( bucket_id = 'product_images' AND auth.role() = 'authenticated' );

create policy "Auth Update"
  on storage.objects for update
  using ( bucket_id = 'product_images' AND auth.role() = 'authenticated' );

create policy "Auth Delete"
  on storage.objects for delete
  using ( bucket_id = 'product_images' AND auth.role() = 'authenticated' );

-- Policies for order_item_images
create policy "Public Access Order Images"
  on storage.objects for select
  using ( bucket_id = 'order_item_images' );

create policy "Auth Insert Order Images"
  on storage.objects for insert
  with check ( bucket_id = 'order_item_images' AND auth.role() = 'authenticated' );

create policy "Auth Update Order Images"
  on storage.objects for update
  using ( bucket_id = 'order_item_images' AND auth.role() = 'authenticated' );

create policy "Auth Delete Order Images"
  on storage.objects for delete
  using ( bucket_id = 'order_item_images' AND auth.role() = 'authenticated' );
