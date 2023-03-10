import { router } from "@inertiajs/core"
import { inertiaCtx, setInertiaCtx } from "./context"
import { createComponent, createEffect, JSX, Show } from "solid-js"

export default function App(props): JSX.Element {
    setInertiaCtx({
        component: props.initialComponent || null,
        page: props.initialPage,
        key: null,
    })

    createEffect(() => {
        router.init({
            initialPage: props.initialPage,
            resolveComponent: props.resolveComponent,
            swapComponent: async ({ component, page, preserveState }) => {
                setInertiaCtx((current) => ({
                    component,
                    page,
                    key: (preserveState ? current.key : Date.now()) as any,
                }))
            },
        })
    })

    const renderChildren = () =>
        props.children ||
        (({ Component, props, key }) => {
            const child = createComponent(Component, { key, ...props })

            if (typeof Component.layout === "function") {
                return Component.layout(child)
            }

            if (Array.isArray(Component.layout)) {
                return Component.layout
                    .concat(child)
                    .reverse()
                    .reduce((children, Layout) => createComponent(Layout, { children, ...props }))
            }

            return child
        })


    return (
        <Show when={!!inertiaCtx().component} keyed>
            {renderChildren()({
                Component: inertiaCtx().component,
                key: inertiaCtx().key,
                props: inertiaCtx().page.props,
            })}

        </Show>
    )

}
