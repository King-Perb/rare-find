/**
 * RapidAPI Real-Time Amazon Data API Types
 *
 * Types for the Real-Time Amazon Data API from RapidAPI
 * API: https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
 */

/**
 * API response wrapper
 */
export interface RapidAPIResponse<T> {
  status: 'OK' | 'ERROR';
  request_id: string;
  data: T;
}

/**
 * Product details response from /product-details endpoint
 */
export interface RapidAPIProductDetails {
  asin: string;
  product_title: string;
  product_description?: string;
  product_information?: Record<string, string>;
  product_photos: string[];
  product_details?: Record<string, string>;
  product_price?: string;
  product_original_price?: string;
  product_availability?: string;
  product_star_rating?: string;
  product_num_ratings?: number;
  product_url: string;
  product_category?: string;
  is_prime?: boolean;
  is_best_seller?: boolean;
  is_amazon_choice?: boolean;
  climate_pledge_friendly?: boolean;
  sales_volume?: string;
  delivery?: string;
  has_variations?: boolean;
  product_variations?: RapidAPIProductVariation[];
  // Seller info
  seller_id?: string;
  seller_name?: string;
  seller_link?: string;
  fulfilled_by_amazon?: boolean;
  // Additional fields
  brand?: string;
  product_dimensions?: string;
  product_weight?: string;
  country_of_origin?: string;
  item_model_number?: string;
}

/**
 * Product variation
 */
export interface RapidAPIProductVariation {
  asin: string;
  title: string;
  price?: string;
  image?: string;
  is_current?: boolean;
}

/**
 * Search result item
 */
export interface RapidAPISearchResult {
  asin: string;
  product_title: string;
  product_price?: string;
  product_original_price?: string;
  product_star_rating?: string;
  product_num_ratings?: number;
  product_url: string;
  product_photo: string;
  is_prime?: boolean;
  is_best_seller?: boolean;
  is_amazon_choice?: boolean;
  climate_pledge_friendly?: boolean;
  sales_volume?: string;
  delivery?: string;
}

/**
 * Search response
 */
export interface RapidAPISearchResponse {
  total_products: number;
  country: string;
  domain: string;
  products: RapidAPISearchResult[];
}

/**
 * Product reviews response
 */
export interface RapidAPIReviewsResponse {
  asin: string;
  total_reviews: number;
  total_ratings: number;
  star_rating: string;
  reviews: RapidAPIReview[];
}

/**
 * Individual review
 */
export interface RapidAPIReview {
  review_id: string;
  review_title: string;
  review_comment: string;
  review_star_rating: string;
  review_date: string;
  is_verified_purchase: boolean;
  reviewer_name?: string;
  helpful_vote_count?: number;
}

/**
 * Seller details response
 */
export interface RapidAPISellerDetails {
  seller_id: string;
  seller_name: string;
  seller_link: string;
  seller_rating?: string;
  seller_num_ratings?: number;
  positive_feedback_percent?: string;
}

/**
 * API configuration
 */
export interface RapidAPIConfig {
  apiKey: string;
  apiHost: string;
}

/**
 * Request options for product details
 */
export interface RapidAPIProductDetailsRequest {
  asin: string;
  country?: string;
}

/**
 * Request options for search
 */
export interface RapidAPISearchRequest {
  query: string;
  page?: number;
  country?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'RELEVANCE' | 'LOWEST_PRICE' | 'HIGHEST_PRICE' | 'REVIEWS' | 'NEWEST';
}
