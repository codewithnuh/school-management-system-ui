import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true, // This ensures that even with paths like /dashboard, Vite will fallback to index.html
  },
  build: {
    rollupOptions: {
      input: "index.html",
    },
  },
});
