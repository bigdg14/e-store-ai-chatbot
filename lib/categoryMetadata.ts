import { Category } from "@/types/products";

/**
 * Category metadata mapping
 * This adds enhanced fields to basic database categories
 * In production, these would be database columns
 */

export const CATEGORY_METADATA: Record<number, Partial<Category>> = {
  1: {
    slug: "fridges",
    description: "Browse our wide selection of refrigerators and freezers. From compact under-counter models to spacious American-style fridges, find the perfect cooling solution for your kitchen.",
    icon: "❄️",
    image: "category-fridges.jpg",
    displayOrder: 1,
    isActive: true,
    seoTitle: "Fridges & Freezers | SmartCart",
    seoDescription: "Shop premium fridges and freezers at great prices. Free delivery on all refrigeration appliances. Energy-efficient models from top brands.",
  },
  2: {
    slug: "mobile-phones",
    description: "Discover the latest smartphones from Apple, Samsung, Google, and more. Get the best deals on flagship phones with cutting-edge technology and stunning displays.",
    icon: "📱",
    image: "category-mobile.jpg",
    displayOrder: 2,
    isActive: true,
    seoTitle: "Mobile Phones & Smartphones | SmartCart",
    seoDescription: "Buy the latest smartphones at unbeatable prices. iPhone, Samsung Galaxy, Google Pixel and more. Free delivery and secure checkout.",
  },
  3: {
    slug: "televisions",
    description: "Experience entertainment like never before with our range of Smart TVs, 4K Ultra HD, and OLED televisions. From compact screens to cinematic displays, we have it all.",
    icon: "📺",
    image: "category-tv.jpg",
    displayOrder: 3,
    isActive: true,
    seoTitle: "Smart TVs & Televisions | SmartCart",
    seoDescription: "Shop Smart TVs, 4K Ultra HD, and OLED televisions from Samsung, LG, Panasonic and more. Free delivery on all TVs.",
  },
};

/**
 * Enhances a basic category object with metadata
 */
export function enhanceCategory(
  category: Category,
  productCount?: number
): Category {
  const metadata = CATEGORY_METADATA[category.id] || {};
  return {
    ...category,
    ...metadata,
    productCount,
  };
}

/**
 * Gets category slug from ID
 */
export function getCategorySlug(categoryId: number): string {
  return CATEGORY_METADATA[categoryId]?.slug || `category-${categoryId}`;
}

/**
 * Gets category ID from slug
 */
export function getCategoryIdFromSlug(slug: string): number | null {
  const entry = Object.entries(CATEGORY_METADATA).find(
    ([_, meta]) => meta.slug === slug
  );
  return entry ? parseInt(entry[0]) : null;
}
