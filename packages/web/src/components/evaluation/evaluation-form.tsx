/**
 * Evaluation Form Component
 *
 * Form for inputting marketplace listing URLs and submitting for evaluation
 */

'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UseEvaluationReturn } from '@/hooks/use-evaluation';
import { getErrorMessage } from '@/lib/errors';
import { ErrorDisplay } from '@/components/ui/error-display';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { shake } from '@/lib/animations/variants';

export interface EvaluationFormProps {
  /** Evaluation hook instance */
  readonly evaluation: UseEvaluationReturn;
  /** Optional placeholder text */
  readonly placeholder?: string;
  /** Optional submit button text */
  readonly submitText?: string;
  /** Form variant - 'standard' or 'hero' */
  readonly variant?: 'standard' | 'hero';
  /** Show link icon inside input (hero variant only) */
  readonly showIcon?: boolean;
  /** Show helper text below input */
  readonly showHelperText?: boolean;
  /** Custom validation function */
  readonly onValidate?: (url: string) => string | null;
  /** Callback for mock data button (hero variant only) */
  readonly onShowMock?: () => void;
  /** Show mock data button */
  readonly showMockButton?: boolean;
}

/**
 * Evaluation form component
 *
 * Handles URL input, validation, and submission for listing evaluation
 */
export function EvaluationForm({
  evaluation,
  placeholder = 'Paste Amazon or eBay listing URL here...',
  submitText = 'Evaluate Listing',
  variant = 'standard',
  showIcon = false,
  showHelperText = false,
  onValidate,
  onShowMock,
  showMockButton = false,
}: EvaluationFormProps) {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [shouldShake, setShouldShake] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    // Basic URL validation
    if (!url.trim()) {
      setLocalError('Please enter a URL');
      // Trigger shake animation on error
      if (!shouldReduceMotion) {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
      }
      return;
    }

    // Validate URL format
    try {
      new URL(url.trim());
    } catch {
      setLocalError('Please enter a valid URL');
      // Trigger shake animation on error
      if (!shouldReduceMotion) {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
      }
      return;
    }

    // Custom validation if provided
    if (onValidate) {
      const customError = onValidate(url.trim());
      if (customError) {
        setLocalError(customError);
        // Trigger shake animation on error
        if (!shouldReduceMotion) {
          setShouldShake(true);
          setTimeout(() => setShouldShake(false), 500);
        }
        return;
      }
    }

    // Submit evaluation
    await evaluation.evaluateListing(url.trim());
  };

  const handleReset = () => {
    setUrl('');
    setLocalError(null);
    evaluation.reset();
  };

  let displayError = getErrorMessage(localError) || getErrorMessage(evaluation.error);

  // Safety check: Ensure displayError is always a string (never an object)
  if (displayError && typeof displayError !== 'string') {
    console.error('[evaluation-form] ERROR: displayError is not a string! Converting...', displayError);
    displayError = String(displayError);
    // If it's still "[object Object]", use fallback
    if (displayError === '[object Object]') {
      displayError = 'An error occurred. Please try again.';
    }
  }

  const isHero = variant === 'hero';

  // Hero variant input classes with enhanced focus animation
  const heroInputClasses = "w-full h-14 pl-12 pr-4 text-base rounded-2xl border-2 border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 transition-all duration-150 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20";

  // Standard variant input classes with enhanced focus animation
  const standardInputClasses = "flex-1 px-4 py-2 border border-gray-300 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-75 dark:bg-gray-800 dark:border-gray-600 dark:text-white";

  // Hero variant button classes
  const heroButtonClasses = "h-14 px-8 text-base font-semibold rounded-2xl bg-blue-600 text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500 flex items-center justify-center gap-2 min-w-[160px]";

  // Standard variant button classes
  const standardButtonClasses = "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors";

  return (
    <form onSubmit={handleSubmit} className={isHero ? "w-full max-w-2xl mt-4" : "w-full max-w-2xl space-y-4"}>
      <div className="space-y-2">
        <div className={isHero ? "flex flex-col sm:flex-row gap-3" : "flex gap-2"}>
          <div className={isHero ? "relative flex-1" : ""}>
            {showIcon && isHero && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg
                  className="h-5 w-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            )}
            {shouldReduceMotion || !shouldShake ? (
              <input
                id="listing-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setLocalError(null);
                }}
                placeholder={placeholder}
                disabled={evaluation.isLoading}
                className={isHero ? heroInputClasses : standardInputClasses}
                aria-invalid={displayError ? 'true' : 'false'}
                aria-describedby={displayError ? 'url-error' : undefined}
              />
            ) : (
              <motion.input
                id="listing-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setLocalError(null);
                }}
                placeholder={placeholder}
                disabled={evaluation.isLoading}
                className={isHero ? heroInputClasses : standardInputClasses}
                aria-invalid={displayError ? 'true' : 'false'}
                aria-describedby={displayError ? 'url-error' : undefined}
                animate={shouldShake ? 'shake' : 'normal'}
                variants={shake}
              />
            )}
          </div>
          {isHero ? (
            <AnimatedButton
              type="submit"
              disabled={evaluation.isLoading || !url.trim()}
              isLoading={evaluation.isLoading}
              loadingText="Analyzing..."
              className="h-14 px-8 text-base font-semibold rounded-2xl min-w-[160px]"
            >
              {submitText}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </AnimatedButton>
          ) : (
            <AnimatedButton
              type="submit"
              disabled={evaluation.isLoading || !url.trim()}
              isLoading={evaluation.isLoading}
              loadingText="Evaluating..."
            >
              {submitText}
            </AnimatedButton>
          )}
        </div>
        <ErrorDisplay
          error={displayError}
          id="url-error"
          className={isHero ? "mt-3" : ""}
          align={isHero ? "left" : undefined}
        />
      </div>

      {showHelperText && (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          Example: https://www.amazon.com/dp/B08XYZ123 or https://www.ebay.com/itm/123456789
        </p>
      )}

      {showMockButton && onShowMock && (
        <>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              or
            </span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <button
            type="button"
            onClick={onShowMock}
            disabled={evaluation.isLoading}
            className="mt-4 w-full sm:w-auto mx-auto px-6 py-3 text-sm font-medium rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 transition-all hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Show Mock Evaluation
          </button>
        </>
      )}

      {(evaluation.result || evaluation.listing) && !isHero && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline"
          >
            Evaluate another listing
          </button>
        </div>
      )}

      {!isHero && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          <p>Supported marketplaces: Amazon, eBay</p>
          <p>Example: https://www.amazon.com/dp/B08XYZ123 or https://www.ebay.com/itm/123456789</p>
        </div>
      )}
    </form>
  );
}
