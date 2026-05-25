export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
      neutral: 'gray',
    },
    icons: {
      // Use the already client-bundled ph:check instead of the default
      // i-lucide-check so the checkbox checkmark resolves offline on the
      // static GitHub Pages host without hitting the Iconify API.
      check: 'ph:check',
    },
    card: {
      variants: {
        variant: {
          outline: {
            root: 'bg-default dark:bg-elevated shadow-sm ring ring-default divide-y divide-default',
          },
        },
      },
    },
  },
})
