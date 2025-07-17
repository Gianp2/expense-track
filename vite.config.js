import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/expense-track/", // 👈 importante para GitHub Pages o rutas base
  plugins: [react()],
});
