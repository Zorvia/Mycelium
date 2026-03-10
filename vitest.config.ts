// Project: Eclipse
// Owned by :contentReference[oaicite:2]{index=2}
// All credits to the Zorvia Community
// Licensed under ZPL v2.0 — see LICENSE.md

import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
