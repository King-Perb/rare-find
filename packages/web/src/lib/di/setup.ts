/**
 * Dependency Injection Setup
 *
 * Registers all services with the DI container
 * Uses shared package services with platform-specific providers
 */

import { container, ServiceKeys } from './container';
import { LoggerService } from '../services/logger.service';
import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services/marketplace.service';
import { ListingService } from '@rare-find/shared/lib/listing/services/listing.service';
import { EvaluationService } from '@rare-find/shared/lib/evaluation/services/evaluation.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { createConfiguredAmazonClient, createEbayClient } from '../marketplace/clients';
import OpenAI from 'openai';

/**
 * Setup dependency injection container with all services
 */
export function setupDI(): void {
  // Register Logger as singleton
  container.registerSingleton(ServiceKeys.Logger, () => new LoggerService());

  // Register MarketplaceService (from shared package)
  container.register(ServiceKeys.MarketplaceService, () => {
    const logger = container.resolve<LoggerService>(ServiceKeys.Logger);
    const amazonClient = createConfiguredAmazonClient();
    const ebayClient = createEbayClient();
    return new MarketplaceService(logger, amazonClient, ebayClient);
  });

  // Register ListingService (from shared package)
  container.register(ServiceKeys.ListingService, () => {
    const logger = container.resolve<LoggerService>(ServiceKeys.Logger);
    return new ListingService(logger);
  });

  // Register EvaluationService (from shared package)
  container.register(ServiceKeys.EvaluationService, () => {
    const logger = container.resolve<LoggerService>(ServiceKeys.Logger);
    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    return new EvaluationService(logger, openaiClient, model);
  });

  // Register AuthService
  container.register(ServiceKeys.AuthService, () => new AuthService());

  // Register DatabaseService
  container.register(ServiceKeys.DatabaseService, () => new DatabaseService());
}

/**
 * Initialize DI container (call this at app startup)
 */
export function initializeDI(): void {
  setupDI();
}

// Auto-initialize on module load
initializeDI();
