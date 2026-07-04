-- 1. Re-map orders that might be using duplicate service IDs to the first created ID
UPDATE public.orders o
SET service_type_id = dupes.keep_id
FROM (
  SELECT 
    id AS duplicate_id,
    FIRST_VALUE(id) OVER (PARTITION BY name ORDER BY created_at ASC, id ASC) AS keep_id
  FROM public.service_types
  WHERE is_active = true
) dupes
WHERE o.service_type_id = dupes.duplicate_id 
  AND dupes.duplicate_id != dupes.keep_id;

-- 2. Delete the duplicate service types
DELETE FROM public.service_types
WHERE id IN (
  SELECT id
  FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC, id ASC) as rn
    FROM public.service_types
    WHERE is_active = true
  ) t
  WHERE t.rn > 1
);
