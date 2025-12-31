/**
 * Dependency Injection Container
 *
 * Simple DI container for managing service dependencies and enabling testability
 */

type ServiceFactory<T> = () => T;
type ServiceKey = string | symbol;

export class DIContainer {
  private readonly services = new Map<ServiceKey, ServiceFactory<unknown>>();
  private readonly singletons = new Map<ServiceKey, unknown>();

  /**
   * Register a service factory
   */
  register<T>(key: ServiceKey, factory: ServiceFactory<T>): void {
    this.services.set(key, factory);
    // Clear singleton cache if service is re-registered
    this.singletons.delete(key);
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(key: ServiceKey, factory: ServiceFactory<T>): void {
    this.register(key, factory);
    // Pre-create singleton
    this.singletons.set(key, factory());
  }

  /**
   * Resolve a service
   */
  resolve<T>(key: ServiceKey): T {
    // Check if singleton exists
    if (this.singletons.has(key)) {
      return this.singletons.get(key) as T;
    }

    // Get factory and create instance
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service not found: ${String(key)}`);
    }

    const instance = factory() as T;

    // Cache as singleton if it's a singleton service
    // (We check if it was registered as singleton by checking if it's already in singletons)
    // For now, we'll cache all resolved services as singletons
    this.singletons.set(key, instance);

    return instance;
  }

  /**
   * Check if a service is registered
   */
  has(key: ServiceKey): boolean {
    return this.services.has(key);
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }

  /**
   * Create a child container (useful for request-scoped services)
   */
  createChild(): DIContainer {
    const child = new DIContainer();
    // Copy parent services
    for (const [key, factory] of this.services.entries()) {
      child.services.set(key, factory);
    }
    return child;
  }
}

// Global container instance
export const container = new DIContainer();

// Service keys
export const ServiceKeys = {
  Logger: Symbol('Logger'),
  MarketplaceService: Symbol('MarketplaceService'),
  ListingService: Symbol('ListingService'),
  EvaluationService: Symbol('EvaluationService'),
  DatabaseService: Symbol('DatabaseService'),
  AuthService: Symbol('AuthService'),
} as const;
