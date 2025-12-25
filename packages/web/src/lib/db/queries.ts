/**
 * Database query helpers using Supabase client
 * 
 * This file contains reusable database query functions using Supabase client.
 * All queries respect Row Level Security (RLS) policies.
 * 
 * IMPORTANT: Use Supabase client for all data access operations (respects RLS).
 * Prisma is only for schema management and migrations.
 */

import { supabase } from '../supabase/client';
import type {
  Listing,
  ListingInsert,
  ListingUpdate,
  Recommendation,
  RecommendationInsert,
  RecommendationUpdate,
  SearchPreference,
  SearchPreferenceInsert,
  SearchPreferenceUpdate,
  AIEvaluation,
  AIEvaluationInsert,
  // AIEvaluationUpdate,
  User,
  UserInsert,
  UserUpdate,
  Notification,
  NotificationInsert,
  // NotificationUpdate,
} from './types';

// ============================================================================
// User queries
// ============================================================================

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Create a new user
 */
export async function createUser(userData: UserInsert): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update user
 */
export async function updateUser(
  userId: string,
  userData: UserUpdate
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// ============================================================================
// Listing queries
// ============================================================================

/**
 * Get listing by ID
 */
export async function getListingById(listingId: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Create a new listing
 */
export async function createListing(listingData: ListingInsert): Promise<Listing> {
  const { data, error } = await supabase
    .from('listings')
    .insert(listingData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update listing
 */
export async function updateListing(
  listingId: string,
  listingData: ListingUpdate
): Promise<Listing> {
  const { data, error } = await supabase
    .from('listings')
    .update(listingData)
    .eq('id', listingId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Find listing by marketplace and marketplace ID
 */
export async function findListingByMarketplace(
  marketplace: string,
  marketplaceId: string
): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('marketplace', marketplace)
    .eq('marketplaceId', marketplaceId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

// ============================================================================
// AI Evaluation queries
// ============================================================================

/**
 * Create AI evaluation
 */
export async function createAIEvaluation(
  evaluationData: AIEvaluationInsert
): Promise<AIEvaluation> {
  const { data, error } = await supabase
    .from('ai_evaluations')
    .insert(evaluationData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get AI evaluation by listing ID
 */
export async function getEvaluationByListingId(
  listingId: string
): Promise<AIEvaluation | null> {
  const { data, error } = await supabase
    .from('ai_evaluations')
    .select('*')
    .eq('listingId', listingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

// ============================================================================
// Recommendation queries
// ============================================================================

/**
 * Create recommendation
 */
export async function createRecommendation(
  recommendationData: RecommendationInsert
): Promise<Recommendation> {
  const { data, error } = await supabase
    .from('recommendations')
    .insert(recommendationData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get recommendations by user ID
 */
export async function getRecommendationsByUserId(
  userId: string,
  options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Recommendation[]> {
  let query = supabase
    .from('recommendations')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Get recommendation by ID
 */
export async function getRecommendationById(
  recommendationId: string
): Promise<Recommendation | null> {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('id', recommendationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Update recommendation
 */
export async function updateRecommendation(
  recommendationId: string,
  recommendationData: RecommendationUpdate
): Promise<Recommendation> {
  const { data, error } = await supabase
    .from('recommendations')
    .update(recommendationData)
    .eq('id', recommendationId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// ============================================================================
// Notification queries
// ============================================================================

/**
 * Create notification
 */
export async function createNotification(
  notificationData: NotificationInsert
): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get unread notifications for a user
 */
export async function getUnreadNotifications(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<Notification[]> {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('userId', userId)
    .eq('read', false)
    .order('createdAt', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true, readAt: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// ============================================================================
// Search Preference queries
// ============================================================================

/**
 * Create search preference
 */
export async function createPreference(
  preferenceData: SearchPreferenceInsert
): Promise<SearchPreference> {
  const { data, error } = await supabase
    .from('search_preferences')
    .insert(preferenceData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get preferences by user ID
 */
export async function getPreferencesByUserId(
  userId: string,
  options?: {
    isActive?: boolean;
  }
): Promise<SearchPreference[]> {
  let query = supabase
    .from('search_preferences')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (options?.isActive !== undefined) {
    query = query.eq('isActive', options.isActive);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Get active preferences by user ID
 */
export async function getActivePreferences(userId: string): Promise<SearchPreference[]> {
  return getPreferencesByUserId(userId, { isActive: true });
}

/**
 * Update preference
 */
export async function updatePreference(
  preferenceId: string,
  preferenceData: SearchPreferenceUpdate
): Promise<SearchPreference> {
  const { data, error } = await supabase
    .from('search_preferences')
    .update(preferenceData)
    .eq('id', preferenceId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Delete preference
 */
export async function deletePreference(preferenceId: string): Promise<void> {
  const { error } = await supabase
    .from('search_preferences')
    .delete()
    .eq('id', preferenceId);

  if (error) {
    throw error;
  }
}
