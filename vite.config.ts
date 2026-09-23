/** @format */

import { fileURLToPath, URL } from "node:url";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

/**
 * Shriftning latin subset'ini <head> da preload qiladi.
 * Busiz brauzer uni faqat CSS'ni o'qib bo'lgach topadi va matn kechroq
 * yakuniy shriftga o'tadi. Faqat latin — qolgan subset'lar unicode-range
 * bo'yicha baribir yuklanmaydi.
 */
function preloadLatinFont(): Plugin {
  let base = "/";
  return {
    name: "preload-latin-font",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml(_html, ctx) {
      const font = Object.keys(ctx.bundle ?? {}).find(
        (file) =>
          file.includes("-latin-wght-normal") && file.endsWith(".woff2"),
      );
      if (!font) return;
      return [
        {
          tag: "link",
          attrs: {
            rel: "preload",
            href: base + font,
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          },
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({
        presets: [reactCompilerPreset()],
        // LocatorJS faqat dev'da: JSX elementlariga manba fayli/qatorini yozadi
        plugins: isDev
          ? [["@locator/babel-jsx/dist", { env: "development" }]]
          : [],
      }),
      preloadLatinFont(),
    ],
    server: {
      port: 3000,
      // strictPort: 3000 band bo'lsa Vite jimgina 3001 ga o'tmaydi, balki xato
      // beradi — manzil doim bir xil bo'lishi uchun (API CORS ro'yxati, hamkasblar
      // bilan kelishilgan havola va hokazo).
      strictPort: true,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // React kamdan-kam yangilanadi — alohida chunk'da uzoq muddat keshlanadi
          // va app kodi bilan parallel yuklanadi.
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (
              id.includes("react-dom") ||
              id.includes("/react/") ||
              id.includes("scheduler")
            ) {
              return "react-vendor";
            }
            // react-router ham deyarli har sahifada kerak va kamdan-kam
            // yangilanadi. Nomi ham muhim: aks holda rolldown bu umumiy chunk'ga
            // tasodifiy modul nomini (masalan "button") berib yuboradi.
            if (id.includes("react-router")) {
              return "router-vendor";
            }
            // i18n kutubxonalari app kodiga qaraganda kamroq yangilanadi — alohida
            // chunk'da uzoq muddat keshlanadi.
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "i18n-vendor";
            }
          },
        },
      },
    },
  };
});
