# Inertia.js Solid Adapter [POC]

## Sample entrypoint
```jsx
import { render } from 'solid-js/web';
import { createInertiaApp } from "inertia-solid-adapter"
import Layout from "./Layout"

createInertiaApp({
    resolve: async (name: string) => {
      const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
      let page = pages[`./Pages/${name}.tsx`]
      page.default.layout = page.default.layout || Layout
      return page
    },
    setup({ el, App, props }) {
        render(() => <App {...props} />, el)
    },
})
```

Visit [inertiajs.com](https://inertiajs.com/) to learn more.
