import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// Storybook tests configuration
// This config is used for running Storybook story tests in browser mode
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    css: true,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/e2e/**",
      "**/*.e2e.{ts,tsx}",
      "**/*.spec.ts",
      "**/*.test.{ts,tsx}",
      "**/__tests__/**"
    ],
    coverage: {
      provider: "v8",
      exclude: [
        // Test files themselves
        "**/*.test.{ts,tsx}",
        "**/__tests__/**",
        "**/test/**",
        // Story files
        "**/*.stories.{ts,tsx}",
        // Mock data files - test data, not component logic
        "**/mock-*.ts",
        "**/mock-*.tsx",
        "**/*mock*.ts",
        "**/*mock*.tsx",
        // Library code - tested separately with unit tests
        "src/lib/**",
        // App routes and API - not components, tested separately
        "src/app/**",
        // Hooks - not components, tested separately
        "src/hooks/**",
        // Generated files
        "src/generated/**",
        // Type definition files
        "src/types/**",
        // Config files
        "next.config.ts",
        "postcss.config.mjs",
        "eslint.config.mjs",
        "vitest.config.ts",
        "vitest.config.unit.ts",
        "playwright.config.ts",
        // Setup files
        "src/test/**",
        ".storybook/**",
        // Build outputs
        "**/*.d.ts",
        "**/dist/**",
        "**/build/**",
        ".next/**",
        "node_modules/**",
        // Documentation
        "doc/**",
        "**/*.md",
        // Public assets
        "public/**",
      ],
      include: ["src/components/**/*.{ts,tsx}"],
    },
    projects: [
      {
        plugins: [
          storybookTest({
            configDir: path.join(__dirname, '.storybook'),
            storybookScript: 'npm run storybook -- --no-open',
            storybookUrl: 'http://localhost:6006',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: [path.join(__dirname, '.storybook/vitest.setup.ts')]
        }
      }
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@rare-find/shared": path.resolve(__dirname, "../shared/src")
    }
  }
});
