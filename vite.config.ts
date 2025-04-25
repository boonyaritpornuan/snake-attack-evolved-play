import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // You can switch this to '@vitejs/plugin-react' if you prefer
import path from "path";
import { componentTagger } from "lovable-tagger";

// If you want to use mode-specific logic, define a function config
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
}));
