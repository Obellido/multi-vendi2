// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";
import PrimeUI from "tailwindcss-primeui";

export default defineNuxtConfig({
    devtools: { enabled: false },
    runtimeConfig: {
        // Variables disponibles solo en server
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
        USERDB: process.env.USERDB || 'admin',
        PASSDB: process.env.PASSDB || 'admin',
        URLDB: process.env.URLDB || 'http://localhost:5984',
        NAMEDB: process.env.NAMEDB || 'vendi2',
    },
    modules: [
        "@nuxtjs/tailwindcss",
        "@primevue/nuxt-module",
        "@nuxt/image",
        "@vueuse/nuxt",
        "@pinia/nuxt"
    ],
    primevue: {
        options: {
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: ".p-dark",
                },
            },
            ripple: true,
        },
        autoImport: true,
    },
    css: ["primeicons/primeicons.css"],
    tailwindcss: {
        config: {
            plugins: [PrimeUI],
            darkMode: ["class", ".p-dark"],
        },
    },
});