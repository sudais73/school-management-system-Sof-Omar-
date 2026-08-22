import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { nitro } from "nitro/vite";
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    nitro(),

    VitePWA({
      injectRegister: false,
      registerType: "autoUpdate",
       outDir: ".output/public",

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
            src: "/pwa.jpg",
            sizes: "192x192",
            type: "image/jpeg",
          },
          {
            src: "/pwa1.jpg",
            sizes: "512x512",
            type: "image/jpeg",
          },
          {
            src: "/pwa-192x192.svg",
            sizes: "512x512",
            type: "image/svg+xml",
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