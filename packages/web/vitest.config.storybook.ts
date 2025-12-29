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
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.tsx"],
    css: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/e2e/**",
    // Exclude Playwright E2E tests
    "**/*.e2e.{ts,tsx}", "**/*.spec.ts", // Exclude Playwright spec files
    // Exclude unit tests - this config is only for Storybook tests
    "**/*.test.{ts,tsx}", "**/__tests__/**"
    ],
    projects: [
      // Storybook tests project
      {
        extends: true,
        plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(__dirname, '.storybook')
        })],
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
          setupFiles: ['.storybook/vitest.setup.ts']
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
