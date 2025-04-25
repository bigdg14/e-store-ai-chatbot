import { queryDatabase } from "@/lib/server/db"; // ✅ Import server-side module

// Fetch all categories
export async function getCategories() {
  try {
    console.log("Fetching categories...");
    const categories = await queryDatabase("SELECT * FROM categories");
    return { data: categories, errorMessage: null };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [], errorMessage: "Failed to load categories" };
  }
}

// Fetch a single category by ID
export async function getCategoryById(categoryId: number) {
  try {
    console.log("Fetching category details for:", categoryId);
    const category = await queryDatabase(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );
    return category.length > 0
      ? { data: category[0], errorMessage: null }
      : { data: null, errorMessage: "Category not found" };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { data: null, errorMessage: "Failed to fetch category" };
  }
}

// Fetch all products (optionally filter by category ID)
export async function getProducts(categoryId?: number) {
  try {
    console.log("🛒 Fetching products for category:", categoryId);
    const query = categoryId
      ? "SELECT * FROM products WHERE catId = $1"
      : "SELECT * FROM products";
    const params = categoryId ? [categoryId] : [];
    const products = await queryDatabase(query, params);
    return { data: products, errorMessage: null };
  } catch (error) {
    console.error(" Error fetching products:", error);
    return { data: [], errorMessage: "Failed to load products" };
  }
}

// Fetch a single product by ID
export async function getProductById(id: number) {
  try {
    console.log("🌍 API Call → Fetching product by ID:", id);
    const product = await queryDatabase(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    return product.length > 0
      ? { data: product[0], errorMessage: null }
      : { data: null, errorMessage: "Product not found" };
  } catch (error) {
    console.error(" Error fetching product by ID:", error);
    return { data: null, errorMessage: "Failed to fetch product" };
  }
}

// Search products by query (matches title or description)
export async function getProductsByQuery(query: string) {
  try {
    console.log("Searching products for query:", query);
    const searchQuery = `
      SELECT * FROM products 
      WHERE LOWER(title) LIKE LOWER($1) 
      OR LOWER(description) LIKE LOWER($1)
    `;
    const products = await queryDatabase(searchQuery, [`%${query}%`]);
    return products;
  } catch (error) {
    console.error("Error fetching products by query:", error);
    return [];
  }
}
