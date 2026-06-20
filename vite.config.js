import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Adjust warning limit if needed, but chunk splitting is the best approach
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Splits third-party dependencies out of the main execution thread
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("redux")) {
              return "vendor-core";
            }
            return "vendor-libs";
          }
        },
      },
    },
  },
});
