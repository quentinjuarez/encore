import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/icon', '@nuxt/fonts', 'nuxt-auth-utils'],

  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  runtimeConfig: {
    // NUXT_SETLISTFM_API_KEY
    setlistfmApiKey: '',
    public: {
      // NUXT_PUBLIC_SITE_URL
      siteUrl: 'http://localhost:3000',
    },
  },

  fonts: {
    families: [
      { name: 'Fredoka', provider: 'google' },
      { name: 'Nunito', provider: 'google' },
      { name: 'Space Mono', provider: 'google' },
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Encore',
      titleTemplate: '%s - Encore',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#E0662E' },
        {
          name: 'description',
          content:
            'Encore turns a live concert setlist into a Spotify playlist. Search a band, pick a show, relive it.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
});
