import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Supabase client before importing logger
vi.mock('../supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

// Mock DI setup to prevent auto-initialization
vi.mock('../di/setup', () => ({
  setupDI: vi.fn(),
  initializeDI: vi.fn(),
}));

// Mock the container with proper methods
// Note: vi.mock is hoisted, so we must define everything inside the factory
vi.mock('../di/container', () => {
  const mockLoggerInstance = {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  return {
    container: {
      resolve: vi.fn(() => mockLoggerInstance),
      register: vi.fn(),
      registerSingleton: vi.fn(),
      has: vi.fn(),
      clear: vi.fn(),
      createChild: vi.fn(),
    },
    ServiceKeys: {
      Logger: Symbol('Logger'),
      MarketplaceService: Symbol('MarketplaceService'),
      ListingService: Symbol('ListingService'),
      EvaluationService: Symbol('EvaluationService'),
      DatabaseService: Symbol('DatabaseService'),
      AuthService: Symbol('AuthService'),
    },
  };
});

import {
  logApiRequest,
  logApiResponse,
  logMarketplaceCall,
  logAIEvaluation,
} from '../logger';

describe('logger', () => {
  let mockLogger: {
    info: ReturnType<typeof vi.fn>;
    debug: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Get the mocked logger instance from container
    const { container } = await import('../di/container');
    mockLogger = container.resolve(Symbol('Logger'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('logApiRequest', () => {
    it('should log API request without userId', () => {
      logApiRequest('GET', '/api/listings');

      expect(mockLogger.info).toHaveBeenCalledWith(
        'API Request: GET /api/listings',
        {
          method: 'GET',
          path: '/api/listings',
          userId: undefined,
        }
      );
    });

    it('should log API request with userId', () => {
      logApiRequest('POST', '/api/evaluations', 'user-123');

      expect(mockLogger.info).toHaveBeenCalledWith(
        'API Request: POST /api/evaluations',
        {
          method: 'POST',
          path: '/api/evaluations',
          userId: 'user-123',
        }
      );
    });

    it('should log API request with metadata', () => {
      const metadata = { ip: '127.0.0.1', userAgent: 'test' };
      logApiRequest('GET', '/api/listings', 'user-123', metadata);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'API Request: GET /api/listings',
        {
          method: 'GET',
          path: '/api/listings',
          userId: 'user-123',
          ip: '127.0.0.1',
          userAgent: 'test',
        }
      );
    });
  });

  describe('logApiResponse', () => {
    it('should log API response', () => {
      logApiResponse('GET', '/api/listings', 200, 150);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'API Response: GET /api/listings 200',
        {
          method: 'GET',
          path: '/api/listings',
          statusCode: 200,
          duration: '150ms',
          userId: undefined,
        }
      );
    });

    it('should log API response with userId', () => {
      logApiResponse('POST', '/api/evaluations', 201, 250, 'user-123');

      expect(mockLogger.info).toHaveBeenCalledWith(
        'API Response: POST /api/evaluations 201',
        {
          method: 'POST',
          path: '/api/evaluations',
          statusCode: 201,
          duration: '250ms',
          userId: 'user-123',
        }
      );
    });
  });

  describe('logMarketplaceCall', () => {
    it('should log successful marketplace API call', () => {
      logMarketplaceCall('amazon', '/products', true, 300);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Marketplace API: amazon /products',
        {
          marketplace: 'amazon',
          endpoint: '/products',
          success: true,
          duration: '300ms',
        }
      );
    });

    it('should log failed marketplace API call', () => {
      logMarketplaceCall('ebay', '/search', false, 500);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Marketplace API: ebay /search',
        {
          marketplace: 'ebay',
          endpoint: '/search',
          success: false,
          duration: '500ms',
        }
      );
    });

    it('should log marketplace API call with metadata', () => {
      const metadata = { listingId: '123', retries: 2 };
      logMarketplaceCall('amazon', '/products', true, 300, metadata);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Marketplace API: amazon /products',
        {
          marketplace: 'amazon',
          endpoint: '/products',
          success: true,
          duration: '300ms',
          listingId: '123',
          retries: 2,
        }
      );
    });
  });

  describe('logAIEvaluation', () => {
    it('should log successful AI evaluation', () => {
      logAIEvaluation('listing-123', true, 2000);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'AI Evaluation: listing-123',
        {
          listingId: 'listing-123',
          success: true,
          duration: '2000ms',
        }
      );
    });

    it('should log failed AI evaluation', () => {
      logAIEvaluation('listing-456', false, 5000);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'AI Evaluation: listing-456',
        {
          listingId: 'listing-456',
          success: false,
          duration: '5000ms',
        }
      );
    });

    it('should log AI evaluation with metadata', () => {
      const metadata = { confidence: 85, model: 'gpt-4' };
      logAIEvaluation('listing-789', true, 1500, metadata);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'AI Evaluation: listing-789',
        {
          listingId: 'listing-789',
          success: true,
          duration: '1500ms',
          confidence: 85,
          model: 'gpt-4',
        }
      );
    });
  });
});
