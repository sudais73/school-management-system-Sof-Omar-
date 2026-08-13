import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    netlify(),
    viteReact(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        id: "/",
        name: "School Management System",
        short_name: "School Management",
        description:
          "A complete school management system for managing students, teachers, classes, subjects, and school activities.",

        start_url: "/",
        scope: "/",

        display: "standalone",

        theme_color: "#ffffff",
        background_color: "#ffffff",

        orientation: "portrait",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        navigateFallback: "/",
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
});