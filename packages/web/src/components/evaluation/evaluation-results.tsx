/**
 * Evaluation Results Component
 *
 * Displays listing details and AI evaluation results
 */

'use client';

import Image from 'next/image';
import type { EvaluationResult } from '@/lib/ai/types';
import type { MarketplaceListing } from '@/lib/marketplace/types';

export interface EvaluationResultsProps {
  /** Evaluation result from AI */
  readonly result: EvaluationResult;
  /** Listing data that was evaluated */
  readonly listing: MarketplaceListing;
}

/**
 * Format currency value
 */
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format percentage
 */
function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Get confidence color based on score
 */
function getConfidenceColor(score: number): string {
  if (score >= 80) return 'text-green-700 dark:text-green-400';
  if (score >= 60) return 'text-yellow-700 dark:text-yellow-400';
  return 'text-red-700 dark:text-red-400';
}

/**
 * Get confidence label
 */
function getConfidenceLabel(score: number): string {
  if (score >= 80) return 'High';
  if (score >= 60) return 'Medium';
  return 'Low';
}

/**
 * Get confidence bar color
 */
function getConfidenceBarColor(score: number): string {
  if (score >= 80) return 'bg-green-600';
  if (score >= 60) return 'bg-yellow-600';
  return 'bg-red-600';
}

/**
 * Evaluation results component
 *
 * Displays listing information, AI evaluation, and reasoning
 */
export function EvaluationResults({ result, listing }: EvaluationResultsProps) {
  const { evaluation } = result;
  const priceDifference = evaluation.estimatedMarketValue - listing.price;
  const isGoodDeal = evaluation.undervaluationPercentage > 0;
  const isReplicaOrNovelty = evaluation.isReplicaOrNovelty ?? false;

  // Debug: Log replica status (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('isReplicaOrNovelty:', isReplicaOrNovelty, 'evaluation.isReplicaOrNovelty:', evaluation.isReplicaOrNovelty);
  }

  // Determine savings/overpayment display
  const hasSavings = priceDifference > 0;
  const overpaymentAmount = Math.max(0, -priceDifference);
  const savingsAmount = Math.max(0, priceDifference);

  // Determine color class - replica takes priority (yellow), then good deals (green)
  const getValueColorClass = (): string => {
    if (isReplicaOrNovelty) {
      return 'text-yellow-700 dark:text-yellow-400';
    }
    if (hasSavings) {
      return 'text-green-700 dark:text-green-400';
    }
    return 'text-foreground';
  };
  const priceColorClass = getValueColorClass();
  const estimatedValueColorClass = getValueColorClass();

  return (
    <div className="w-full max-w-4xl space-y-6 mt-8">
      {/* Listing Details */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Listing Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          {listing.images && listing.images.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Images
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {listing.images.slice(0, 4).map((imageUrl) => (
                  <div
                    key={imageUrl}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${listing.title} - ${imageUrl}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Listing Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {listing.title}
              </h3>
              {listing.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {listing.description}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                <span className={`font-semibold ${priceColorClass}`}>
                  {formatCurrency(listing.price, listing.currency)}
                </span>
              </div>

              {listing.condition && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Condition:</span>
                  <span className="text-foreground capitalize">{listing.condition}</span>
                </div>
              )}

              {listing.category && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-foreground">{listing.category}</span>
                </div>
              )}

              {listing.sellerName && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Seller:</span>
                  <span className="text-foreground">{listing.sellerName}</span>
                </div>
              )}

              {listing.sellerRating !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Seller Rating:</span>
                  <span className="text-foreground">
                    {listing.sellerRating.toFixed(1)}%
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Availability:</span>
                <span className={listing.available ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                  {listing.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <a
              href={listing.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
            >
              View on {listing.marketplace === 'amazon' ? 'Amazon' : 'eBay'} →
            </a>
          </div>
        </div>
      </section>

      {/* AI Evaluation */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-foreground">AI Evaluation</h2>

        {/* Replica/Novelty Warning */}
        {isReplicaOrNovelty && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Replica or Novelty Item
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This item has been identified as a replica, reproduction, or novelty item, not an authentic collectible.
                  The estimated value reflects its value as a replica/novelty item, which is typically much lower than an authentic version.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {isReplicaOrNovelty ? 'Estimated Value (as Replica/Novelty)' : 'Estimated Market Value'}
            </div>
            <div className={`text-2xl font-bold ${estimatedValueColorClass}`}>
              {formatCurrency(evaluation.estimatedMarketValue)}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {hasSavings ? 'Potential Savings' : 'Overpriced By'}
            </div>
            <div className={`text-2xl font-bold ${hasSavings ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {hasSavings
                ? `+${formatCurrency(savingsAmount)}`
                : formatCurrency(overpaymentAmount)}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {isGoodDeal ? 'Undervaluation' : 'Overvaluation'}
            </div>
            <div className={`text-2xl font-bold ${isGoodDeal ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isGoodDeal
                ? `+${formatPercentage(evaluation.undervaluationPercentage)}`
                : formatPercentage(Math.abs(evaluation.undervaluationPercentage))}
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">
              Confidence Score
            </span>
            <span className={`text-lg font-bold ${getConfidenceColor(evaluation.confidenceScore)}`}>
              {evaluation.confidenceScore}/100 ({getConfidenceLabel(evaluation.confidenceScore)})
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getConfidenceBarColor(evaluation.confidenceScore)}`}
              style={{ width: `${evaluation.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Reasoning */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Evaluation Reasoning</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {evaluation.reasoning}
          </p>
        </div>

        {/* Factors */}
        {evaluation.factors && evaluation.factors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Key Factors</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {evaluation.factors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
