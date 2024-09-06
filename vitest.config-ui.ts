import { defineConfig } from "vitest/config";


export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text", "lcov"],
      enabled: true,
      include: ["src/**/*.{ts,tsx}"],
    },
    browser: {
      provider: 'preview', // or 'webdriverio'
      enabled: true,
      headless: false,
      name: 'chromium', // browser name is required
      // enableUI: true
    },
  },
});
