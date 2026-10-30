import { Product, ProductCategory } from '../types/product';
import { INAUGURAL_CATALOGUE, INAUGURAL_CATALOGUE_BY_SLUG } from '../config/inauguralCatalogue';

/**
 * PUBLIC PRODUCT SERVICE (Static Frontend Architecture)
 * Serves static catalog items with zero backend dependencies.
 */

const STATIC_CATEGORIES: ProductCategory[] = [
  { id: 'villas', slug: 'villas', name: 'Private Villas', sortOrder: 1, productCount: 3 },
  { id: 'apartments', slug: 'apartments', name: 'Luxury Apartments', sortOrder: 2, productCount: 3 },
  { id: 'penthouses', slug: 'penthouses', name: 'Sky Penthouses', sortOrder: 3, productCount: 2 },
  { id: 'developments', slug: 'developments', name: 'Master Developments', sortOrder: 4, productCount: 1 }
];

export const productService = {
  /**
   * Fetch all published products
   */
  async getPublishedProducts(): Promise<Product[]> {
    return INAUGURAL_CATALOGUE;
  },

  /**
   * Fetch single product by unique slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    return INAUGURAL_CATALOGUE_BY_SLUG[slug] || INAUGURAL_CATALOGUE.find((p) => p.slug === slug) || null;
  },

  /**
   * Fetch active categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    return STATIC_CATEGORIES;
  },

  /**
   * Fetch featured products for homepage
   */
  async getFeaturedProducts(): Promise<Product[]> {
    return INAUGURAL_CATALOGUE.filter((p) => p.isFeatured);
  },

  /**
   * Formatter utility for price display respecting public visibility and currency
   */
  formatPrice(product: Product): string {
    if (product.isEnquiryOnly || !product.showPricePublicly || product.regularPrice === null) {
      return 'Price Upon Request';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: product.currency || 'USD',
      maximumFractionDigits: 0
    }).format(product.regularPrice);
  }
};