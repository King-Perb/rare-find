/**
 * Error Display Component
 *
 * Reusable component for displaying error messages with consistent styling
 */

export interface ErrorDisplayProps {
  /** Error message to display (will be converted to string) */
  readonly error: string | null | undefined;
  /** Optional ID for the error element (for accessibility) */
  readonly id?: string;
  /** Optional additional CSS classes */
  readonly className?: string;
  /** Text alignment */
  readonly align?: 'left' | 'center' | 'right';
}

/**
 * Error display component
 *
 * Displays error messages with consistent styling and accessibility attributes
 */
export function ErrorDisplay({
  error,
  id = 'error-message',
  className = '',
  align = 'left',
}: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <p
      id={id}
      className={`text-sm text-red-600 dark:text-red-400 ${alignmentClass} ${className}`}
      role="alert"
    >
      {String(error)}
    </p>
  );
}
