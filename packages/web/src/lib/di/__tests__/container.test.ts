/**
 * Tests for Dependency Injection Container
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DIContainer, ServiceKeys } from '../container';

describe('DIContainer', () => {
  let container: DIContainer;

  beforeEach(() => {
    container = new DIContainer();
  });

  describe('register', () => {
    it('should register a service factory', () => {
      const factory = () => ({ value: 'test' });
      container.register('test-service', factory);

      expect(container.has('test-service')).toBe(true);
    });

    it('should clear singleton cache when re-registering', () => {
      let callCount = 0;
      const factory = () => {
        callCount++;
        return { value: 'test', callCount };
      };

      container.register('test-service', factory);
      container.resolve('test-service');
      expect(callCount).toBe(1);

      // Re-register should clear cache
      container.register('test-service', factory);
      container.resolve('test-service');
      expect(callCount).toBe(2);
    });
  });

  describe('registerSingleton', () => {
    it('should register and pre-create singleton', () => {
      let callCount = 0;
      const factory = () => {
        callCount++;
        return { value: 'singleton', callCount };
      };

      container.registerSingleton('singleton-service', factory);

      expect(callCount).toBe(1); // Pre-created
      expect(container.has('singleton-service')).toBe(true);
    });

    it('should return same instance on multiple resolves', () => {
      // Use a fixed test ID instead of Math.random() for security and test determinism
      const testId = 12345;
      const factory = () => ({ value: 'singleton', id: testId });
      container.registerSingleton('singleton-service', factory);

      const instance1 = container.resolve<{ value: string; id: number }>('singleton-service');
      const instance2 = container.resolve<{ value: string; id: number }>('singleton-service');

      expect(instance1).toBe(instance2);
      expect(instance1.id).toBe(instance2.id);
    });
  });

  describe('resolve', () => {
    it('should resolve registered service', () => {
      const factory = () => ({ value: 'test' });
      container.register('test-service', factory);

      const instance = container.resolve('test-service');

      expect(instance).toEqual({ value: 'test' });
    });

    it('should throw error for unregistered service', () => {
      expect(() => {
        container.resolve('non-existent');
      }).toThrow('Service not found: non-existent');
    });

    it('should cache resolved services as singletons', () => {
      let callCount = 0;
      const factory = () => {
        callCount++;
        return { value: 'test', callCount };
      };

      container.register('test-service', factory);

      const instance1 = container.resolve('test-service');
      const instance2 = container.resolve('test-service');

      expect(callCount).toBe(1); // Factory called only once
      expect(instance1).toBe(instance2);
    });

    it('should return singleton when registered as singleton', () => {
      const factory = () => ({ value: 'singleton' });
      container.registerSingleton('singleton-service', factory);

      const instance1 = container.resolve('singleton-service');
      const instance2 = container.resolve('singleton-service');

      expect(instance1).toBe(instance2);
    });

    it('should resolve with symbol keys', () => {
      const key = Symbol('test-key');
      const factory = () => ({ value: 'test' });
      container.register(key, factory);

      const instance = container.resolve(key);

      expect(instance).toEqual({ value: 'test' });
    });

    it('should resolve with string keys', () => {
      const factory = () => ({ value: 'test' });
      container.register('test-key', factory);

      const instance = container.resolve('test-key');

      expect(instance).toEqual({ value: 'test' });
    });
  });

  describe('has', () => {
    it('should return true for registered service', () => {
      container.register('test-service', () => ({}));
      expect(container.has('test-service')).toBe(true);
    });

    it('should return false for unregistered service', () => {
      expect(container.has('non-existent')).toBe(false);
    });

    it('should work with symbol keys', () => {
      const key = Symbol('test-key');
      container.register(key, () => ({}));
      expect(container.has(key)).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all registered services', () => {
      container.register('service1', () => ({}));
      container.register('service2', () => ({}));

      expect(container.has('service1')).toBe(true);
      expect(container.has('service2')).toBe(true);

      container.clear();

      expect(container.has('service1')).toBe(false);
      expect(container.has('service2')).toBe(false);
    });

    it('should clear singleton cache', () => {
      container.registerSingleton('singleton', () => ({ value: 'test' }));
      container.resolve('singleton');

      container.clear();

      expect(container.has('singleton')).toBe(false);
      expect(() => container.resolve('singleton')).toThrow();
    });
  });

  describe('createChild', () => {
    it('should create child container with parent services', () => {
      container.register('parent-service', () => ({ value: 'parent' }));

      const child = container.createChild();

      expect(child.has('parent-service')).toBe(true);
      const instance = child.resolve('parent-service');
      expect(instance).toEqual({ value: 'parent' });
    });

    it('should allow child to register its own services', () => {
      container.register('parent-service', () => ({ value: 'parent' }));

      const child = container.createChild();
      child.register('child-service', () => ({ value: 'child' }));

      expect(child.has('parent-service')).toBe(true);
      expect(child.has('child-service')).toBe(true);
      expect(container.has('child-service')).toBe(false);
    });

    it('should not affect parent when child registers service', () => {
      const child = container.createChild();
      child.register('child-service', () => ({ value: 'child' }));

      expect(container.has('child-service')).toBe(false);
    });

    it('should create independent singleton cache', () => {
      container.registerSingleton('singleton', () => ({ id: 1 }));

      const child = container.createChild();
      const parentInstance = container.resolve('singleton');
      const childInstance = child.resolve('singleton');

      // Should be different instances
      expect(parentInstance).not.toBe(childInstance);
    });
  });

  describe('ServiceKeys', () => {
    it('should export ServiceKeys object', () => {
      expect(ServiceKeys).toBeDefined();
      expect(typeof ServiceKeys).toBe('object');
    });

    it('should have all required service keys', () => {
      expect(ServiceKeys.Logger).toBeDefined();
      expect(ServiceKeys.MarketplaceService).toBeDefined();
      expect(ServiceKeys.ListingService).toBeDefined();
      expect(ServiceKeys.EvaluationService).toBeDefined();
      expect(ServiceKeys.DatabaseService).toBeDefined();
      expect(ServiceKeys.AuthService).toBeDefined();
    });

    it('should have unique symbol keys', () => {
      const keys = Object.values(ServiceKeys);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });
  });
});
