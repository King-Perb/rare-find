/**
 * Dependency Injection Setup
 *
 * Registers all services with the DI container
 */

import { container, ServiceKeys } from './container';
import { LoggerService } from '../services/logger.service';
import { MarketplaceService } from '../services/marketplace.service';
import { ListingService } from '../services/listing.service';
import { EvaluationService } from '../services/evaluation.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

/**
 * Setup dependency injection container with all services
 */
export function setupDI(): void {
  // Register Logger as singleton
  container.registerSingleton(ServiceKeys.Logger, () => new LoggerService());

  // Register MarketplaceService
  container.register(ServiceKeys.MarketplaceService, () => {
    const logger = container.resolve<LoggerService>(ServiceKeys.Logger);
    return new MarketplaceService(logger);
  });

  // Register ListingService
  container.register(ServiceKeys.ListingService, () => {
    const logger = container.resolve<LoggerService>(ServiceKeys.Logger);
    return new ListingService(logger);
  });

  // Register EvaluationService
  container.register(ServiceKeys.EvaluationService, () => {
    const logger = container.resolve<LoggerService>(ServiceKeys.Logger);
    return new EvaluationService(logger);
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
