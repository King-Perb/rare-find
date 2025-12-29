/**
 * Evaluation Form Component
 *
 * Form for inputting marketplace listing URLs and submitting for evaluation
 */

'use client';

import { useState, FormEvent } from 'react';
import type { UseEvaluationReturn } from '@/hooks/use-evaluation';
import { getErrorMessage } from '@/lib/errors';
import { ErrorDisplay } from '@/components/ui/error-display';

export interface EvaluationFormProps {
  /** Evaluation hook instance */
  readonly evaluation: UseEvaluationReturn;
  /** Optional placeholder text */
  readonly placeholder?: string;
  /** Optional submit button text */
  readonly submitText?: string;
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
}: EvaluationFormProps) {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    // Basic URL validation
    if (!url.trim()) {
      setLocalError('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url.trim());
    } catch {
      setLocalError('Please enter a valid URL');
      return;
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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="listing-url"
          className="block text-sm font-medium text-foreground"
        >
          Listing URL
        </label>
        <div className="flex gap-2">
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            aria-invalid={displayError ? 'true' : 'false'}
            aria-describedby={displayError ? 'url-error' : undefined}
          />
          <button
            type="submit"
            disabled={evaluation.isLoading || !url.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {evaluation.isLoading ? 'Evaluating...' : submitText}
          </button>
        </div>
        <ErrorDisplay
          error={displayError}
          id="url-error"
        />
      </div>

      {(evaluation.result || evaluation.listing) && (
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

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        <p>Supported marketplaces: Amazon, eBay</p>
        <p>Example: https://www.amazon.com/dp/B08XYZ123 or https://www.ebay.com/itm/123456789</p>
      </div>
    </form>
  );
}
