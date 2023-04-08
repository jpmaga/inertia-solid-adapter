import { router } from "@inertiajs/core"
import { inertiaCtx, setInertiaCtx } from "./context"
import { createComponent, createEffect, createMemo, JSX } from "solid-js"

export default function App(props): JSX.Element {
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

  const renderChildren = createMemo(() => {
    if (inertiaCtx().component) {
      const child = createComponent(inertiaCtx().component, {
        key: inertiaCtx().key,
        ...inertiaCtx().page.props,
      })
      if (typeof inertiaCtx().component.layout === "function") {
        return createComponent(inertiaCtx().component.layout, {
          get children() {
            return child
          },
        })
      }
      return child
    }
  })

  return <>{renderChildren()}</>
}
