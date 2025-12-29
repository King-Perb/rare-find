/**
 * Loading Spinner Component
 *
 * Reusable component for displaying loading states
 */

export interface LoadingSpinnerProps {
  /** Main loading message */
  readonly message?: string;
  /** Optional secondary/subtitle message */
  readonly subtitle?: string;
  /** Size of the spinner */
  readonly size?: 'small' | 'medium' | 'large';
  /** Variant: simple (just spinner) or card (with background card) */
  readonly variant?: 'simple' | 'card';
  /** Optional additional CSS classes */
  readonly className?: string;
}

/**
 * Loading spinner component
 *
 * Displays a loading spinner with optional messages
 */
export function LoadingSpinner({
  message = 'Loading...',
  subtitle,
  size = 'medium',
  variant = 'simple',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  const borderClasses = {
    small: 'border-2',
    medium: 'border-2',
    large: 'border-4',
  };

  const spinner = (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 dark:border-gray-700 ${borderClasses[size]}`} />
      <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-blue-600 border-t-transparent animate-spin ${borderClasses[size]}`} />
    </div>
  );

  if (variant === 'card') {
    return (
      <div className={`w-full max-w-2xl p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${className}`}>
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <div className="text-center">
            {message && (
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                {message}
              </p>
            )}
            {subtitle && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Simple variant
  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <div className="text-center">
        {spinner}
        {message && (
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            {message}
          </p>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
