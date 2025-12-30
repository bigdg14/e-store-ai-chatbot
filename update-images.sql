-- Update image extensions from .jfif to .jpg in the products table
-- Run this in your Neon SQL Editor

UPDATE products
SET image = REPLACE(image, '.jfif', '.jpg')
WHERE image LIKE '%.jfif';

-- Verify the changes
SELECT id, title, image FROM products ORDER BY id;
