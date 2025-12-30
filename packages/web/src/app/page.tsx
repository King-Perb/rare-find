/**
 * Home Page
 *
 * Landing page with integrated URL evaluation in the hero section
 */

'use client';

import { motion } from 'framer-motion';
import { useEvaluation } from '@/hooks/use-evaluation';
import { EvaluationResults } from '@/components/evaluation/evaluation-results';
import { getMockEvaluationData } from '@/components/evaluation/mock-evaluation-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EvaluationForm } from '@/components/evaluation/evaluation-form';
import { FadeIn } from '@/components/animations/fade-in';
import { SlideIn } from '@/components/animations/slide-in';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { scaleIn } from '@/lib/animations/variants';

export default function Home() {
  const evaluation = useEvaluation();
  const shouldReduceMotion = useReducedMotion();

  const handleValidate = (url: string): string | null => {
    // Check marketplace support
    const isAmazon = url.includes('amazon.');
    const isEbay = url.includes('ebay.');

    if (!isAmazon && !isEbay) {
      return 'Please enter an Amazon or eBay listing URL';
    }

    return null;
  };

  const handleShowMock = () => {
    const { listing, result } = getMockEvaluationData('overpriced-replica');
    evaluation.setMockData(result, listing);
  };

  const handleReset = () => {
    evaluation.reset();
  };

  const hasResults = evaluation.result && evaluation.listing;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      {/* Hero Section */}
      <main className="flex w-full max-w-4xl flex-col items-center justify-center py-24 px-6 sm:px-16">
        <div className="flex flex-col items-center gap-6 text-center w-full">
          {/* Logo/Brand - Fade + Scale Animation */}
          {shouldReduceMotion ? (
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
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="flex items-center gap-2 mb-2"
            >
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
            </motion.div>
          )}

          {/* Headline - Fade + Slide Up Animation */}
          <SlideIn direction="up" delay={0.1}>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              AI-Powered Bargain Detection
            </h1>
          </SlideIn>

          {/* Description - Fade In with Delay */}
          <FadeIn delay={0.2}>
            <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
              Find undervalued items on Amazon and eBay. Paste a listing URL and get instant AI analysis.
            </p>
          </FadeIn>

          {/* URL Input Form - Hero Style - Fade In with Delay */}
          {!hasResults && (
            <FadeIn delay={0.3}>
              <EvaluationForm
                evaluation={evaluation}
                placeholder="Paste Amazon or eBay URL..."
                submitText="Evaluate"
                variant="hero"
                showIcon={true}
                showHelperText={true}
                onValidate={handleValidate}
                onShowMock={handleShowMock}
                showMockButton={true}
              />
            </FadeIn>
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
                <svg className="h-6 w-6 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
