export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
      neutral: 'gray',
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
