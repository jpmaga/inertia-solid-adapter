import { createStore } from "solid-js/store"
import { createSignal } from "solid-js"

export const [inertiaCtx, setInertiaCtx] = createSignal<any>({
  component: null,
  page: {},
  key: null,
})

export const usePage = () => inertiaCtx().page
export const usePageProps = () => inertiaCtx().page?.props?.page
