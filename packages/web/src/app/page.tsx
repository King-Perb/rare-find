/**
 * Home Page
 * 
 * Landing page with integrated URL evaluation in the hero section
 */

'use client';

import { useState, FormEvent } from 'react';
import { useEvaluation } from '@/hooks/use-evaluation';
import { EvaluationResults } from '@/components/evaluation/evaluation-results';
import { getMockEvaluationData } from '@/components/evaluation/mock-evaluation-data';
import { getErrorMessage } from '@/lib/errors';
import { ErrorDisplay } from '@/components/ui/error-display';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Home() {
  const evaluation = useEvaluation();
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

    // Check marketplace support
    const trimmedUrl = url.trim();
    const isAmazon = trimmedUrl.includes('amazon.');
    const isEbay = trimmedUrl.includes('ebay.');

    if (!isAmazon && !isEbay) {
      setLocalError('Please enter an Amazon or eBay listing URL');
      return;
    }

    // Submit evaluation
    await evaluation.evaluateListing(trimmedUrl);
  };

  const handleReset = () => {
    setUrl('');
    setLocalError(null);
    evaluation.reset();
  };

  const handleShowMock = () => {
    const { listing, result } = getMockEvaluationData('overpriced-replica');
    evaluation.setMockData(result, listing);
    setLocalError(null);
  };

  // Debug: Log error values to see what we're getting
  if (process.env.NODE_ENV === 'development') {
    if (localError) {
      console.log('[page] localError:', localError, 'type:', typeof localError);
    }
    if (evaluation.error) {
      console.log('[page] evaluation.error:', evaluation.error, 'type:', typeof evaluation.error);
    }
  }
  
  let displayError = getErrorMessage(localError) || getErrorMessage(evaluation.error);
  
  // Safety check: Ensure displayError is always a string (never an object)
  if (displayError && typeof displayError !== 'string') {
    console.error('[page] ERROR: displayError is not a string! Converting...', displayError);
    displayError = String(displayError);
    // If it's still "[object Object]", use fallback
    if (displayError === '[object Object]') {
      displayError = 'An error occurred. Please try again.';
    }
  }
  
  // Debug: Verify displayError is a string
  if (process.env.NODE_ENV === 'development' && displayError) {
    console.log('[page] displayError:', displayError, 'type:', typeof displayError);
  }
  
  const hasResults = evaluation.result && evaluation.listing;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      {/* Hero Section */}
      <main className="flex w-full max-w-4xl flex-col items-center justify-center py-24 px-6 sm:px-16">
        <div className="flex flex-col items-center gap-6 text-center w-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-black dark:text-white tracking-tight">
              Rare Find
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl lg:text-6xl">
            AI-Powered Bargain Detection
          </h1>
          
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Find undervalued items on Amazon and eBay. Paste a listing URL and get instant AI analysis.
          </p>

          {/* URL Input Form - Hero Style */}
          {!hasResults && (
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
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
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setLocalError(null);
                    }}
                    placeholder="Paste Amazon or eBay URL..."
                    disabled={evaluation.isLoading}
                    className="w-full h-14 pl-12 pr-4 text-base rounded-2xl border-2 border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 disabled:bg-zinc-100 disabled:cursor-not-allowed dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                    aria-invalid={displayError ? 'true' : 'false'}
                    aria-describedby={displayError ? 'url-error' : undefined}
                  />
                </div>
                <button
                  type="submit"
                  disabled={evaluation.isLoading || !url.trim()}
                  className="h-14 px-8 text-base font-semibold rounded-2xl bg-blue-600 text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500 flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {evaluation.isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Evaluate
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              <ErrorDisplay 
                error={displayError} 
                id="url-error"
                className="mt-3"
                align="left"
              />

              {/* Helper Text */}
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
                Example: https://www.amazon.com/dp/B08XYZ123 or https://www.ebay.com/itm/123456789
              </p>

              {/* Mock Data Button */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  or
                </span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <button
                type="button"
                onClick={handleShowMock}
                disabled={evaluation.isLoading}
                className="mt-4 w-full sm:w-auto mx-auto px-6 py-3 text-sm font-medium rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 transition-all hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Show Mock Evaluation
              </button>
            </form>
          )}

          {/* Loading State */}
          {evaluation.isLoading && (
            <div className="w-full max-w-2xl mt-8">
              <LoadingSpinner
                message="Analyzing listing..."
                subtitle="Extracting data and evaluating market value"
                variant="card"
                size="large"
              />
            </div>
          )}

          {/* Results */}
          {evaluation.result && evaluation.listing && (
            <div className="w-full mt-8">
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Evaluate another listing
                </button>
              </div>
              <EvaluationResults
                result={evaluation.result}
                listing={evaluation.listing}
              />
            </div>
          )}
        </div>
      </main>

      {/* Features Section */}
      {!hasResults && !evaluation.isLoading && (
        <section className="w-full max-w-4xl px-6 sm:px-16 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                Instant Analysis
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Get AI-powered evaluations in seconds, not hours of research
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                Market Value Estimates
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Compare listing prices to estimated true market value
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                Smart Insights
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Understand why a listing might be undervalued
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
