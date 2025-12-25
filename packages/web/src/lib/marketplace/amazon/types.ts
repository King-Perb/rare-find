/**
 * Amazon Product Advertising API types
 * 
 * Types for Amazon PA-API 5.0 integration
 */

export interface AmazonSearchRequest {
  Keywords?: string;
  SearchIndex?: string;
  ItemCount?: number;
  ItemPage?: number;
  MinPrice?: number;
  MaxPrice?: number;
  Condition?: 'New' | 'Used' | 'Collectible' | 'Refurbished' | 'All';
  SortBy?: 'Relevance' | 'Price:LowToHigh' | 'Price:HighToLow' | 'NewestArrivals';
}

export interface AmazonSearchResponse {
  SearchResult: {
    TotalResultCount?: number;
    SearchIndex?: string;
    Items?: AmazonItem[];
  };
}

export interface AmazonGetItemsRequest {
  ItemIds: string[]; // Array of ASINs
  Resources?: string[]; // Optional: specific resources to retrieve
  Condition?: 'New' | 'Used' | 'Collectible' | 'Refurbished' | 'All';
  CurrencyOfPreference?: string; // e.g., 'USD'
  LanguagesOfPreference?: string[]; // e.g., ['en_US']
  Merchant?: 'All' | 'Amazon';
  OfferCount?: number;
}

export interface AmazonGetItemsResponse {
  ItemsResult?: {
    Items?: AmazonItem[];
  };
  Errors?: Array<{
    Code?: string;
    Message?: string;
  }>;
}

export interface AmazonItem {
  ASIN: string;
  DetailPageURL: string;
  Images?: {
    Primary?: {
      Large?: {
        URL?: string;
        Height?: number;
        Width?: number;
      };
    };
    Variants?: Array<{
      Large?: {
        URL?: string;
      };
    }>;
  };
  ItemInfo?: {
    ByLineInfo?: {
      Contributor?: Array<{
        Name?: string;
      }>;
    };
    Classifications?: {
      ProductGroup?: {
        DisplayValue?: string;
      };
    };
    ContentInfo?: {
      Edition?: {
        DisplayValue?: string;
      };
    };
    ExternalIds?: {
      EANs?: {
        DisplayValues?: string[];
      };
    };
    Features?: {
      DisplayValues?: string[];
    };
    ManufactureInfo?: {
      ItemPartNumber?: {
        DisplayValue?: string;
      };
    };
    ProductInfo?: {
      UnitCount?: {
        DisplayValue?: number;
      };
    };
    TechnicalInfo?: {
      Formats?: {
        DisplayValues?: string[];
      };
    };
    Title?: {
      DisplayValue?: string;
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        DisplayAmount?: string;
        Amount?: number;
        Currency?: string;
      };
      Availability?: {
        Message?: string;
        Type?: string;
      };
      Condition?: {
        DisplayValue?: string;
        Value?: string;
      };
      MerchantInfo?: {
        Name?: string;
      };
      Shipping?: {
        Standard?: {
          DisplayAmount?: string;
        };
      };
    }>;
    Summaries?: Array<{
      HighestPrice?: {
        DisplayAmount?: string;
        Amount?: number;
        Currency?: string;
      };
      LowestPrice?: {
        DisplayAmount?: string;
        Amount?: number;
        Currency?: string;
      };
      OfferCount?: number;
    }>;
  };
}

export interface AmazonCredentials {
  accessKey: string;
  secretKey: string;
  associateTag: string;
  region?: string; // Default: 'us-east-1'
}

