import { queryDatabase } from "@/lib/server/db"; // ✅ Uses server-only database module
import { enhanceCategory } from "@/lib/categoryMetadata";
import { Category } from "@/types/products";
import db from "@/db/db.json";

// Check if DATABASE_URL is configured
const isDatabaseConfigured = !!process.env.DATABASE_URL;

export async function getCategories() {
  try {
    let categories: Category[];
    let categoriesWithCounts: Category[];

    if (isDatabaseConfigured) {
      // Use PostgreSQL database
      categories = await queryDatabase("SELECT * FROM categories");

      // Get product counts for each category
      categoriesWithCounts = await Promise.all(
        categories.map(async (category: Category) => {
          const countResult = await queryDatabase(
            "SELECT COUNT(*) as count FROM products WHERE catId = $1",
            [category.id]
          );
          const productCount = parseInt(countResult[0]?.count || "0");
          return enhanceCategory(category, productCount);
        })
      );
    } else {
      // Fall back to db.json
      categories = db.categories;
      const products = db.products;

      categoriesWithCounts = categories.map((category: Category) => {
        const productCount = products.filter(p => p.catId === category.id).length;
        return enhanceCategory(category, productCount);
      });
    }

    return { data: categoriesWithCounts, errorMessage: null };
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return { data: [], errorMessage: "Failed to load categories" };
  }
}

export async function getCategoryById(categoryId: number) {
  try {
    if (isDatabaseConfigured) {
      // Use PostgreSQL database
      const category = await queryDatabase(
        "SELECT * FROM categories WHERE id = $1",
        [categoryId]
      );

      if (category.length === 0) {
        return { data: null, errorMessage: "Category not found" };
      }

      // Get product count
      const countResult = await queryDatabase(
        "SELECT COUNT(*) as count FROM products WHERE catId = $1",
        [categoryId]
      );
      const productCount = parseInt(countResult[0]?.count || "0");

      return {
        data: enhanceCategory(category[0], productCount),
        errorMessage: null,
      };
    } else {
      // Fall back to db.json
      const category = db.categories.find(c => c.id === categoryId);

      if (!category) {
        return { data: null, errorMessage: "Category not found" };
      }

      const productCount = db.products.filter(p => p.catId === categoryId).length;

      return {
        data: enhanceCategory(category, productCount),
        errorMessage: null,
      };
    }
  } catch (error) {
    console.error("❌ Error fetching category:", error);
    return { data: null, errorMessage: "Failed to fetch category" };
  }
}

export async function getProducts(categoryId?: number) {
  try {
    if (isDatabaseConfigured) {
      // Use PostgreSQL database
      const query = categoryId
        ? "SELECT * FROM products WHERE catId = $1"
        : "SELECT * FROM products";
      const params = categoryId ? [categoryId] : [];
      const products = await queryDatabase(query, params);
      return { data: products, errorMessage: null };
    } else {
      // Fall back to db.json
      const products = categoryId
        ? db.products.filter(p => p.catId === categoryId)
        : db.products;
      return { data: products, errorMessage: null };
    }
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return { data: [], errorMessage: "Failed to load products" };
  }
}

export async function getProductById(id: number) {
  try {
    if (isDatabaseConfigured) {
      // Use PostgreSQL database
      const product = await queryDatabase(
        "SELECT * FROM products WHERE id = $1",
        [id]
      );
      return product.length > 0
        ? { data: product[0], errorMessage: null }
        : { data: null, errorMessage: "Product not found" };
    } else {
      // Fall back to db.json
      const product = db.products.find(p => p.id === id);
      return product
        ? { data: product, errorMessage: null }
        : { data: null, errorMessage: "Product not found" };
    }
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    return { data: null, errorMessage: "Failed to fetch product" };
  }
}

export async function getProductsByQuery(query: string) {
  try {
    if (isDatabaseConfigured) {
      // Use PostgreSQL database
      const searchQuery = `
        SELECT * FROM products
        WHERE LOWER(title) LIKE LOWER($1)
        OR LOWER(description) LIKE LOWER($1)
      `;
      const products = await queryDatabase(searchQuery, [`%${query}%`]);
      return products;
    } else {
      // Fall back to db.json
      const lowerQuery = query.toLowerCase();
      const products = db.products.filter(p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
      return products;
    }
  } catch (error) {
    console.error("❌ Error fetching products by query:", error);
    return [];
  }
}
