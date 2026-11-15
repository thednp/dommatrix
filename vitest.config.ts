import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text", "lcov"],
      enabled: true,
      include: ["src/index.ts"],
    },
    browser: {
      enabled: true,
      provider: playwright({}),
      instances: [{ browser: "chromium" }],
      ui: false,
      headless: true,
    },
  },
});
