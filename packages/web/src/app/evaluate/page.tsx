/**
 * Evaluation Page
 * 
 * Page for evaluating marketplace listings by URL
 */

'use client';

import { useEvaluation } from '@/hooks/use-evaluation';
import { EvaluationForm } from '@/components/evaluation/evaluation-form';
import { EvaluationResults } from '@/components/evaluation/evaluation-results';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function EvaluatePage() {
  const evaluation = useEvaluation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Evaluate Marketplace Listing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get AI-powered evaluation of Amazon and eBay listings to find great deals
          </p>
        </div>

        {/* Evaluation Form */}
        <div className="flex justify-center mb-8">
          <EvaluationForm evaluation={evaluation} />
        </div>

        {/* Loading State */}
        {evaluation.isLoading && (
          <LoadingSpinner
            message="Analyzing listing and generating evaluation..."
            variant="simple"
            size="medium"
          />
        )}

        {/* Results */}
        {!evaluation.isLoading && evaluation.result && evaluation.listing && (
          <div className="flex justify-center">
            <EvaluationResults
              result={evaluation.result}
              listing={evaluation.listing}
            />
          </div>
        )}
      </div>
    </div>
  );
}

