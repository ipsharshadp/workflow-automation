import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

// WordPress externals (USED ONLY IN PRODUCTION)
const wpExternals = {
  react: "React",
  "react-dom": "ReactDOM",
};

export default defineConfig({
  plugins: [react()],

  // DEV MODE → allow Vite to load React normally (NO externals)
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    cors: {
      origin: ["http://wordpress-demo.test"],
      //methods: ["GET", "HEAD", "OPTIONS"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    hmr: {
      host: "127.0.0.1",
      protocol: "ws",
      port: 5173,
    },
  },

  build: {
    outDir: "../build",
    emptyOutDir: true,
    copyPublicDir: false,

    rollupOptions: {
      input: path.resolve(__dirname, "src/main.jsx"),

      // ONLY externalize React in PRODUCTION
      ...(isProd
        ? {
          external: Object.keys(wpExternals),
          output: {
            format: "iife",
            globals: wpExternals,
            entryFileNames: "js/app.js",
            assetFileNames: "css/[name].[ext]",
          },
        }
        : {}),
    },
  },

  // DEV MODE → Vite optimizes React normally
  // PROD MODE → skip, because we externalize React
  optimizeDeps: {
    exclude: isProd ? ["react", "react-dom"] : [],
  },
});
