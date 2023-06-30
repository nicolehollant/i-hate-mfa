// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxthq/ui'],
  srcDir: './src',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'iHateMFA',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Silly way to get around MFA. I am begging you to not use this.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
})
