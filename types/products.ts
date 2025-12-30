// types/products.ts

export interface ProductSpecs {
  dimensions: string;
  capacity?: string;
}

export interface Product {
  id: number;
  catId?: number;
  title: string;
  productCode?: string;
  image: string;
  price: number;
  sku?: string;
  description?: string;
  specs: { dimensions: string; capacity?: string };
  features: string[];
  stock: number;
}

export interface Category {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: number;
  isActive?: boolean;
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
}

export interface CategoryWithProducts extends Category {
  products?: Product[];
}
