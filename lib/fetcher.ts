const BASE_URL = "/api";

export const fetcher = async (url: string) => {
  try {
    const response = await fetch(BASE_URL + url);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      // Type guard
      return { errorMessage: err.message, data: [] };
    } else {
      return { errorMessage: "An unknown error occurred", data: [] };
    }
  }
};

export async function getCategories() {
  try {
    const response = await fetch("/api/categories"); // Ensure this endpoint exists
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    console.log("Fetched categories:", data); // Debug log

    return { data, errorMessage: null };
  } catch (error) {
    console.error("Error fetching categories:", error);

    return {
      data: [],
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getCategoryById(categoryId: number) {
  try {
    console.log("Fetching category details for:", categoryId);
    const response = await fetch(`/api/categories/${categoryId}`);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched category data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}


export async function getProducts(categoryId?: number) {
  try {
    console.log("🛒 Fetching products for category:", categoryId);
    const url = categoryId
      ? `/api/products?catId=${categoryId}`
      : "/api/products";

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

    const { data, errorMessage } = await response.json(); // ✅ Extract properly

    if (errorMessage) {
      console.error("❌ API Error:", errorMessage);
      return { data: [], errorMessage };
    }

    console.log("✅ Products fetched:", data);
    return { data, errorMessage: null };
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return { data: [], errorMessage: "Failed to load products" };
  }
}


export async function getProductById(id: number) {
  try {
    console.log("🌍 API Call → Fetching product by ID:", id);
    const response = await fetch(`/api/products/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📡 API Response:", data);

    return data || { data: null }; // ✅ Ensure response is valid
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    return { data: null, error: "Failed to fetch product" };
  }
}



export async function getProductsByQuery(query: string) {
  try {
    console.log("🌍 API Call → Fetching from: /api/products?q=", query);
    const response = await fetch(`/api/products?q=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const { data } = await response.json(); // Extract only `data`
    console.log("📡 API Response Data:", data);
    return data; // Return only the array of products
  } catch (error) {
    console.error("❌ Error fetching products by query:", error);
    return [];
  }
}




