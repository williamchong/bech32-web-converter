import * as Sentry from "@sentry/nuxt";

Sentry.init({
  // If set up, you can use your runtime config here
  // dsn: useRuntimeConfig().public.sentry.dsn,
  dsn: "https://038f8510d11080ab66e39300879fdcd0@o178577.ingest.us.sentry.io/4509538708357120",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
