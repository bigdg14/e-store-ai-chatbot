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
}
