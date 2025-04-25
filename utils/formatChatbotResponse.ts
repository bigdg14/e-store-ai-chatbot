export function formatChatbotResponse(
  results: any[],
  userQuery?: string
): string {
  // Handle empty results
  if (!results || results.length === 0) {
    return "I couldn't find any matching products or information based on your question.";
  }

  // Single count result
  if (results.length === 1 && results[0].count !== undefined) {
    const count = results[0].count;
    return `There ${count === 1 ? "is" : "are"} ${count} ${
      count === 1 ? "product" : "products"
    } available.`;
  }

  // Price related queries
  if (
    results.length === 1 &&
    results[0].min_price !== undefined &&
    results[0].max_price !== undefined
  ) {
    return `Products range in price from $${results[0].min_price} to $${results[0].max_price}.`;
  }

  // Most expensive product
  if (results.length === 1 && results[0].title && results[0].max_price) {
    return `The most expensive product is the ${results[0].title} at $${results[0].max_price}.`;
  }

  // Cheapest product
  if (results.length === 1 && results[0].title && results[0].min_price) {
    return `The most affordable product is the ${results[0].title} at $${results[0].min_price}.`;
  }

  // For product lists (multiple results with titles)
  if (results.length > 0 && results[0].title) {
    if (results.length === 1) {
      // Single product details
      const product = results[0];
      let response = `I found the ${product.title}`;

      if (product.price) {
        response += ` priced at $${product.price}`;
      }

      if (product.description) {
        const shortDesc = product.description.split(".")[0]; // Just the first sentence
        response += `. ${shortDesc}.`;
      } else {
        response += ".";
      }

      return response;
    } else {
      // Multiple products
      const productCount = results.length;
      let response = `I found ${productCount} products that match your search:\n\n`;

      const productList = results
        .slice(0, 5)
        .map((product) => {
          let item = `• ${product.title}`;
          if (product.price) {
            item += ` - $${product.price}`;
          }
          return item;
        })
        .join("\n");

      response += productList;

      if (productCount > 5) {
        response += `\n\nAnd ${productCount - 5} more products...`;
      }

      return response;
    }
  }

  // Category information
  if (results.length > 0 && results[0].category_name) {
    const categories = results.map((cat) => cat.category_name);
    return `We have the following product categories: ${categories.join(
      ", "
    )}.`;
  }

  // Stock information
  if (results.length > 0 && results[0].stock !== undefined) {
    if (results.length === 1) {
      const product = results[0];
      return `The ${product.title} currently has ${product.stock} units in stock.`;
    } else {
      let response = "Here's the current stock information:\n\n";
      response += results
        .map((item) => `• ${item.title}: ${item.stock} in stock`)
        .join("\n");
      return response;
    }
  }

  // Fallback for other types of results
  try {
    // Try to create a meaningful response based on result structure
    const firstRow = results[0];
    const keys = Object.keys(firstRow);

    if (keys.length === 1) {
      // Simple single value response
      const key = keys[0];
      return `The ${key.replace(/_/g, " ")} is ${firstRow[key]}.`;
    } else {
      // More complex response
      let response = "Here's what I found:\n\n";

      if (results.length === 1) {
        // Single result with multiple fields
        response += Object.entries(firstRow)
          .map(([key, value]) => `• ${key.replace(/_/g, " ")}: ${value}`)
          .join("\n");
      } else {
        // Multiple results - show shortened version
        response += `I found ${
          results.length
        } results. Here are the first ${Math.min(3, results.length)}:\n\n`;

        response += results
          .slice(0, 3)
          .map((row, index) => {
            const mainValue = row[keys[0]] || row[keys[1]]; // Try to get a main identifier value
            return `${index + 1}. ${mainValue}`;
          })
          .join("\n");

        if (results.length > 3) {
          response += `\n\nAnd ${results.length - 3} more...`;
        }
      }

      return response;
    }
  } catch (error) {
    // If anything fails in our formatting attempts, fall back to simple formatting
    return `I found ${results.length} results based on your question.`;
  }
}
