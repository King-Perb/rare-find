/**
 * eBay Finding API types
 * 
 * Types for eBay Finding API integration
 */

export interface eBaySearchRequest {
  keywords?: string;
  categoryId?: string;
  itemFilter?: Array<{
    name: string;
    value: string | string[];
  }>;
  sortOrder?: 'BestMatch' | 'CurrentPriceHighest' | 'PricePlusShippingHighest' | 'PricePlusShippingLowest' | 'StartTimeNewest' | 'BidCountMost' | 'CountryAscending' | 'DistanceNearest';
  paginationInput?: {
    entriesPerPage?: number;
    pageNumber?: number;
  };
}

export interface eBaySearchResponse {
  findItemsAdvancedResponse?: Array<{
    searchResult?: {
      '@count'?: string;
      item?: eBayItem[];
    };
    paginationOutput?: {
      totalPages?: string[];
      totalEntries?: string[];
      pageNumber?: string[];
      entriesPerPage?: string[];
    };
  }>;
}

export interface eBayItem {
  itemId: string[];
  title: string[];
  globalId: string[];
  categoryId: string[];
  categoryName: string[];
  galleryURL?: string[];
  viewItemURL: string[];
  productId?: Array<{
    '@type': string;
    __value__: string;
  }>;
  paymentMethod?: string[];
  autoPay?: string[];
  postalCode?: string[];
  location?: string[];
  country?: string[];
  shippingInfo?: Array<{
    shippingServiceCost?: Array<{
      '@currencyId': string;
      __value__: string;
    }>;
    shippingType?: string[];
    shipToLocations?: string[];
    expeditedShipping?: string[];
    oneDayShippingAvailable?: string[];
    handlingTime?: string[];
  }>;
  sellingStatus?: Array<{
    currentPrice?: Array<{
      '@currencyId': string;
      __value__: string;
    }>;
    convertedCurrentPrice?: Array<{
      '@currencyId': string;
      __value__: string;
    }>;
    bidCount?: string[];
    timeLeft?: string[];
    listingStatus?: string[];
  }>;
  listingInfo?: Array<{
    bestOfferEnabled?: string[];
    buyItNowAvailable?: string[];
    startTime?: string[];
    endTime?: string[];
    listingType?: string[];
    gift?: string[];
    watchCount?: string[];
  }>;
  condition?: Array<{
    conditionId?: string[];
    conditionDisplayName?: string[];
  }>;
  isMultiVariationListing?: string[];
  topRatedListing?: string[];
  pictureURLSuperSize?: string[];
  pictureURLLarge?: string[];
  sellerInfo?: Array<{
    sellerUserName?: string[];
    feedbackScore?: string[];
    positiveFeedbackPercent?: string[];
    feedbackRatingStar?: string[];
    topRatedSeller?: string[];
  }>;
  storeInfo?: Array<{
    storeName?: string[];
    storeURL?: string[];
  }>;
  returnsAccepted?: string[];
}

export interface eBayCredentials {
  appId: string;
  devId?: string;
  certId?: string;
  authToken: string;
  siteId?: string; // Default: 'EBAY-US'
}

