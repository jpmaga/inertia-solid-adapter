# Inertia.js Solid Adapter

## Sample entrypoint
```jsx
import { render } from 'solid-js/web';
import { createInertiaApp } from "inertia-solid-adapter"
import Layout from "./Layout"

createInertiaApp({
    resolve: async (name: string) => {
        const { default: component } = await import(`./Pages/${name}.tsx`)
        component.layout = component.layout || ((page) => <Layout children={page} />)

        return component
    },
    setup({ el, App, props }) {
        render(() => <App {...props} />, el)
    },
})
```

Visit [inertiajs.com](https://inertiajs.com/) to learn more.
