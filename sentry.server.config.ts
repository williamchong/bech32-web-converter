import * as Sentry from "@sentry/nuxt";
 
Sentry.init({
  dsn: "https://038f8510d11080ab66e39300879fdcd0@o178577.ingest.us.sentry.io/4509538708357120",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
