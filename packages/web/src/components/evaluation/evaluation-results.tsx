/**
 * Evaluation Results Component
 *
 * Displays listing details and AI evaluation results
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCountUp } from '@/hooks/use-count-up';
import { FadeIn } from '@/components/animations/fade-in';
import { slideInRight } from '@/lib/animations/variants';
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
  // Use priceDifference to determine if it's a good deal (more reliable than percentage sign)
  const isGoodDeal = priceDifference > 0;
  const isReplicaOrNovelty = evaluation.isReplicaOrNovelty ?? false;

  // Track loading state for each image - start with all images as loading
  const [loadingImages, setLoadingImages] = useState<Set<string>>(
    new Set(listing.images?.slice(0, 4) || [])
  );

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

  // Count-up animations for metrics
  const estimatedValue = useCountUp({
    target: evaluation.estimatedMarketValue,
    duration: 1500,
    formatter: (val) => formatCurrency(val),
  });

  const savingsOrOverpayment = useCountUp({
    target: hasSavings ? savingsAmount : -overpaymentAmount,
    duration: 1500,
    formatter: (val) => {
      const absVal = Math.abs(val);
      return hasSavings ? `+${formatCurrency(absVal)}` : formatCurrency(absVal);
    },
  });

  const undervaluationPercentage = useCountUp({
    target: Math.abs(evaluation.undervaluationPercentage),
    duration: 1500,
    formatter: (val) => {
      // Show positive sign for undervaluation, negative sign for overvaluation
      return isGoodDeal ? `+${formatPercentage(val)}` : `-${formatPercentage(val)}`;
    },
  });

  const confidenceScore = useCountUp({
    target: evaluation.confidenceScore,
    duration: 1500,
  });

  return (
    <div className="w-full max-w-4xl space-y-6 mt-8">
      {/* Listing Details */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={slideInRight}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Listing Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          {listing.images && listing.images.length > 0 && (
            <div>
              <div className="grid grid-cols-2 gap-2">
                {listing.images.slice(0, 4).map((imageUrl, index) => {
                  const isLoading = loadingImages.has(imageUrl);

                  return (
                    <FadeIn key={imageUrl} delay={index * 0.1}>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        {isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-100 dark:bg-zinc-800">
                            <div className="relative h-8 w-8">
                              <div className="absolute top-0 left-0 h-8 w-8 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
                              <div className="absolute top-0 left-0 h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                            </div>
                          </div>
                        )}
                        <Image
                          src={imageUrl}
                          alt={`${listing.title} - ${imageUrl}`}
                          fill
                          className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                          sizes="(max-width: 768px) 50vw, 25vw"
                          onLoadingComplete={() => {
                            setLoadingImages((prev) => {
                              const next = new Set(prev);
                              next.delete(imageUrl);
                              return next;
                            });
                          }}
                          onError={() => {
                            setLoadingImages((prev) => {
                              const next = new Set(prev);
                              next.delete(imageUrl);
                              return next;
                            });
                          }}
                        />
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          )}

          {/* Listing Info */}
          <div className="space-y-4 mt-4 md:mt-0">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {listing.title}
              </h3>
              {listing.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 text-left mt-8 md:mt-0">
                  {listing.description}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Price:</span>
                <span className={`font-semibold ${priceColorClass}`}>
                  {formatCurrency(listing.price, listing.currency)}
                </span>
              </div>

              {listing.condition && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Condition:</span>
                  <span className="text-zinc-900 dark:text-white capitalize">{listing.condition}</span>
                </div>
              )}

              {listing.category && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Category:</span>
                  <span className="text-zinc-900 dark:text-white">{listing.category}</span>
                </div>
              )}

              {listing.sellerName && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Seller:</span>
                  <span className="text-zinc-900 dark:text-white">{listing.sellerName}</span>
                </div>
              )}

              {listing.sellerRating !== undefined && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Seller Rating:</span>
                  <span className="text-zinc-900 dark:text-white">
                    {listing.sellerRating.toFixed(1)}%
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Availability:</span>
                <span className={listing.available ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                  {listing.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <a
              href={listing.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              View on {listing.marketplace === 'amazon' ? 'Amazon' : 'eBay'}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </motion.section>

      {/* AI Evaluation */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={slideInRight}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">AI Evaluation</h2>

        {/* Replica/Novelty Warning */}
        {isReplicaOrNovelty && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
            <div className="flex items-start">
              <svg className="hidden md:block h-5 w-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-1 text-left">
                  Replica or Novelty Item
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 text-left">
                  This item has been identified as a replica, reproduction, or novelty item, not an authentic collectible.
                  The estimated value reflects its value as a replica/novelty item, which is typically much lower than an authentic version.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Estimated Market Value
            </div>
            <div className={`text-2xl font-bold ${estimatedValueColorClass}`}>
              {estimatedValue}
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              {hasSavings ? 'Potential Savings' : 'Overpriced By'}
            </div>
            <div className={`text-2xl font-bold ${hasSavings ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {savingsOrOverpayment}
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              {isGoodDeal ? 'Undervaluation' : 'Overvaluation'}
            </div>
            <div className={`text-2xl font-bold ${isGoodDeal ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {undervaluationPercentage}
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              Confidence Score
            </span>
            <span className={`text-lg font-bold ${getConfidenceColor(evaluation.confidenceScore)}`}>
              {Math.round(confidenceScore as number)}/100 ({getConfidenceLabel(evaluation.confidenceScore)})
            </span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${getConfidenceBarColor(evaluation.confidenceScore)}`}
              initial={{ width: 0 }}
              animate={{ width: `${evaluation.confidenceScore}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Reasoning */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">Evaluation Reasoning</h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap text-left">
            {evaluation.reasoning}
          </p>
        </div>

        {/* Factors */}
        {evaluation.factors && evaluation.factors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">Key Factors</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-700 dark:text-zinc-300 text-left">
              {evaluation.factors.map((factor) => (
                <li key={factor} className="text-left">{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.section>
    </div>
  );
}
