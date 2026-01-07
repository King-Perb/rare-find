/**
 * Design System / Brandbook Page
 *
 * Technical brand book documenting the Rare Find design system
 */

export default function DesignPage() {
  return (
    <div className="container py-10 space-y-10 max-w-6xl mx-auto px-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
        <p className="text-muted-foreground text-lg">
          The technical brand book for Rare Find. Documenting colors, typography, spacing, and components.
        </p>
      </div>

      {/* Colors */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Colors</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Our color palette uses zinc for neutrals and blue for primary actions. Status colors (green, yellow, red) are used for evaluation results.
          </p>
        </div>

        {/* Primary Colors */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Primary Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorCard
              name="Blue 500"
              className="bg-blue-500 text-white"
              hex="#3b82f6"
              usage="Primary actions, links, focus states"
            />
            <ColorCard
              name="Blue 600"
              className="bg-blue-600 text-white"
              hex="#2563eb"
              usage="Primary buttons, active states"
            />
            <ColorCard
              name="Blue 700"
              className="bg-blue-700 text-white"
              hex="#1d4ed8"
              usage="Button hover states"
            />
            <ColorCard
              name="Indigo 600"
              className="bg-indigo-600 text-white"
              hex="#4f46e5"
              usage="Gradient accents, brand elements"
            />
          </div>
        </div>

        {/* Neutral Colors */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Neutral Colors (Zinc)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorCard
              name="Zinc 50"
              className="bg-zinc-50 border border-zinc-200"
              hex="#fafafa"
              usage="Page backgrounds"
            />
            <ColorCard
              name="Zinc 100"
              className="bg-zinc-100 border border-zinc-200"
              hex="#f4f4f5"
              usage="Disabled states, subtle backgrounds"
            />
            <ColorCard
              name="Zinc 200"
              className="bg-zinc-200"
              hex="#e4e4e7"
              usage="Borders, dividers"
            />
            <ColorCard
              name="Zinc 300"
              className="bg-zinc-300"
              hex="#d4d4d8"
              usage="Disabled elements"
            />
            <ColorCard
              name="Zinc 400"
              className="bg-zinc-400 text-white"
              hex="#a1a1aa"
              usage="Placeholder text, muted content"
            />
            <ColorCard
              name="Zinc 500"
              className="bg-zinc-500 text-white"
              hex="#71717a"
              usage="Secondary text"
            />
            <ColorCard
              name="Zinc 600"
              className="bg-zinc-600 text-white"
              hex="#52525b"
              usage="Body text (dark mode)"
            />
            <ColorCard
              name="Zinc 700"
              className="bg-zinc-700 text-white"
              hex="#3f3f46"
              usage="Borders (dark mode)"
            />
            <ColorCard
              name="Zinc 800"
              className="bg-zinc-800 text-white"
              hex="#27272a"
              usage="Card backgrounds (dark mode)"
            />
            <ColorCard
              name="Zinc 900"
              className="bg-zinc-900 text-white"
              hex="#18181b"
              usage="Card backgrounds, elevated surfaces"
            />
            <ColorCard
              name="Black"
              className="bg-black text-white"
              hex="#000000"
              usage="Page background (dark mode)"
            />
            <ColorCard
              name="White"
              className="bg-white border border-zinc-200"
              hex="#ffffff"
              usage="Card backgrounds, text (dark mode)"
            />
          </div>
        </div>

        {/* Status Colors */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Status Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorCard
              name="Green 600"
              className="bg-green-600 text-white"
              hex="#16a34a"
              usage="Success states, good deals, high confidence"
            />
            <ColorCard
              name="Yellow 600"
              className="bg-yellow-600 text-white"
              hex="#ca8a04"
              usage="Warnings, medium confidence, replicas"
            />
            <ColorCard
              name="Red 600"
              className="bg-red-600 text-white"
              hex="#dc2626"
              usage="Errors, overpriced items, low confidence"
            />
            <ColorCard
              name="Purple 100"
              className="bg-purple-100 border border-purple-200"
              hex="#f3e8ff"
              usage="Feature highlights, accents"
            />
          </div>
        </div>

        {/* Dark Mode Colors */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Dark Mode Specific</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorCard
              name="Gray 700"
              className="bg-gray-700 text-white"
              hex="#374151"
              usage="Card backgrounds (dark mode)"
            />
            <ColorCard
              name="Gray 800"
              className="bg-gray-800 text-white"
              hex="#1f2937"
              usage="Section backgrounds (dark mode)"
            />
            <ColorCard
              name="Gray 900"
              className="bg-gray-900 text-white"
              hex="#111827"
              usage="Page backgrounds (dark mode)"
            />
            <ColorCard
              name="Blue 400"
              className="bg-blue-400 text-white"
              hex="#60a5fa"
              usage="Primary actions (dark mode)"
            />
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Typography</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We use Geist Sans for body text and Geist Mono for code. The typography scale follows a consistent hierarchy.
          </p>
        </div>
        <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg bg-white dark:bg-zinc-900">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl lg:text-6xl">
                Heading 1: AI-Powered Bargain Detection
              </h1>
              <p className="text-xs text-zinc-500 mt-1">text-4xl sm:text-5xl lg:text-6xl font-bold</p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Heading 2: Find Undervalued Items
              </h2>
              <p className="text-xs text-zinc-500 mt-1">text-3xl font-semibold</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                Heading 3: Evaluation Results
              </h3>
              <p className="text-xs text-zinc-500 mt-1">text-2xl font-semibold</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold tracking-tight">
                Heading 4: Listing Details
              </h4>
              <p className="text-xs text-zinc-500 mt-1">text-xl font-semibold</p>
            </div>
            <div>
              <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Paragraph (Large): Find undervalued items on Amazon and eBay. Paste a listing URL and get instant AI analysis.
              </p>
              <p className="text-xs text-zinc-500 mt-1">text-lg leading-8</p>
            </div>
            <div>
              <p className="leading-7 text-zinc-900 dark:text-zinc-100">
                Paragraph (Base): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>
              <p className="text-xs text-zinc-500 mt-1">Base text, leading-7</p>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Small Text: Helper text, captions, and secondary information.
              </p>
              <p className="text-xs text-zinc-500 mt-1">text-sm</p>
            </div>
            <div>
              <blockquote className="mt-6 border-l-4 border-blue-500 pl-6 italic text-zinc-700 dark:text-zinc-300">
                &quot;Blockquote: The best way to predict the future is to create it.&quot;
              </blockquote>
              <p className="text-xs text-zinc-500 mt-1">border-l-4 border-blue-500 pl-6 italic</p>
            </div>
            <div>
              <code className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono text-zinc-900 dark:text-zinc-100">
                Code: const example = &quot;inline code&quot;;
              </code>
              <p className="text-xs text-zinc-500 mt-1">font-mono bg-zinc-100 dark:bg-zinc-800</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Spacing Scale</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Our spacing system uses a consistent scale based on 4px increments.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 6, 8, 10, 12, 16, 24].map((size) => (
            <div key={size} className="space-y-2">
              <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  {size * 4}px
                </div>
              </div>
              <p className="text-xs text-center text-zinc-600 dark:text-zinc-400">
                {size} ({size * 4}px)
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Border Radius</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Consistent border radius values for rounded corners.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RadiusCard name="sm" value="rounded-sm" size="0.125rem" />
          <RadiusCard name="md" value="rounded-md" size="0.375rem" />
          <RadiusCard name="lg" value="rounded-lg" size="0.5rem" />
          <RadiusCard name="xl" value="rounded-xl" size="0.75rem" />
          <RadiusCard name="2xl" value="rounded-2xl" size="1rem" />
          <RadiusCard name="full" value="rounded-full" size="9999px" />
        </div>
      </section>

      {/* Components Preview */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Components</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Common component patterns used throughout the application.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="h-14 px-8 text-base font-semibold rounded-2xl bg-blue-600 text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed">
              Primary Button
            </button>
            <button className="px-6 py-3 text-sm font-medium rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 transition-all hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              Secondary Button
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400">
              Outline Button
            </button>
            <button className="px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl">
              Ghost Button
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Input Fields</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label htmlFor="design-url-input" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                URL Input
              </label>
              <input
                id="design-url-input"
                type="url"
                placeholder="Paste Amazon or eBay URL..."
                className="w-full h-14 pl-12 pr-4 text-base rounded-2xl border-2 border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-400"
              />
            </div>
            <div>
              <label htmlFor="design-standard-input" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Standard Input
              </label>
              <input
                id="design-standard-input"
                type="text"
                placeholder="Enter text..."
                className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">Card Title</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Card content with consistent padding and border radius.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">Card with Shadow</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Elevated card with shadow for emphasis.
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Status Indicators</h3>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
              Success / Good Deal
            </div>
            <div className="px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
              Warning / Replica
            </div>
            <div className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
              Error / Overpriced
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Usage Guidelines</h2>
        </div>
        <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg bg-white dark:bg-zinc-900">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Color Usage</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Use blue-600 for primary actions and CTAs</li>
              <li>Use zinc scale for neutral backgrounds and text</li>
              <li>Use status colors (green/yellow/red) only for evaluation results and alerts</li>
              <li>Maintain sufficient contrast ratios for accessibility (WCAG AA minimum)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Typography</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Use Geist Sans for all body text and headings</li>
              <li>Maintain consistent line heights (leading-7 for body, leading-8 for large text)</li>
              <li>Use font-semibold for headings, font-bold only for hero text</li>
              <li>Keep tracking-tight for headings to improve readability</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Spacing</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Use spacing scale consistently (4px increments)</li>
              <li>Prefer gap-4, gap-6, gap-8 for component spacing</li>
              <li>Use py-24 for hero sections, py-12 for standard sections</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Components</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Primary buttons: rounded-2xl, h-14 for hero, standard height for forms</li>
              <li>Cards: rounded-2xl with border or shadow for elevation</li>
              <li>Inputs: rounded-2xl for hero inputs, rounded-lg for forms</li>
              <li>Always include focus states with ring utilities</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ColorCardProps {
  readonly name: string;
  readonly className: string;
  readonly hex?: string;
  readonly usage?: string;
}

function ColorCard({ name, className, hex, usage }: ColorCardProps) {
  return (
    <div className="space-y-2">
      <div className={`h-24 rounded-lg flex flex-col items-center justify-center text-sm font-medium ${className}`}>
        <span className="text-xs font-semibold">{name}</span>
        {hex && <span className="text-xs opacity-80 mt-1">{hex}</span>}
      </div>
      {usage && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">{usage}</p>
      )}
    </div>
  );
}

interface RadiusCardProps {
  readonly name: string;
  readonly value: string;
  readonly size: string;
}

function RadiusCard({ name, value, size }: RadiusCardProps) {
  return (
    <div className="space-y-2">
      <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
        <div className={`w-16 h-16 bg-blue-500 ${value}`} />
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-zinc-900 dark:text-white">{name}</p>
        <p className="text-xs text-zinc-500">{value}</p>
        <p className="text-xs text-zinc-400">{size}</p>
      </div>
    </div>
  );
}
