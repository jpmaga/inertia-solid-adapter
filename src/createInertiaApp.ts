import { Page, PageProps, PageResolver, setupProgress } from "@inertiajs/core"
import { Component } from "solid-js"
import App from "./App"

type Key = any

type AppType<SharedProps extends PageProps = PageProps> = Component<
  {
    layout?: any
    children?: (props: {
      Component: Component
      key: Key
      props: Page<SharedProps>["props"]
    }) => Component
  } & SetupOptions<unknown, SharedProps>["props"]
>

export type SetupOptions<ElementType, SharedProps extends PageProps> = {
  el: ElementType
  App: AppType
  props: {
    initialPage: Page<SharedProps>
    initialComponent: Component
    resolveComponent: PageResolver
  }
}

type BaseInertiaAppOptions = {
  resolve: PageResolver
}

type CreateInertiaAppSetupReturnType = Component | void
type InertiaAppOptionsForCSR<SharedProps extends PageProps> =
  BaseInertiaAppOptions & {
    id?: string
    page?: Page | string
    render?: undefined
    progress?:
      | false
      | {
          delay?: number
          color?: string
          includeCSS?: boolean
          showSpinner?: boolean
        }
    setup(
      options: SetupOptions<HTMLElement, SharedProps>
    ): CreateInertiaAppSetupReturnType
  }

export default async function createInertiaApp<
  SharedProps extends PageProps = PageProps
>({
  id = "app",
  resolve,
  setup,
  progress = {},
  page,
}: InertiaAppOptionsForCSR<SharedProps>): Promise<CreateInertiaAppSetupReturnType> {
  const el = document.getElementById(id)
  const initialPage = page || JSON.parse(el?.dataset.page ?? "{}") || {}
  // @ts-ignore
  const resolveComponent = (name) =>
    Promise.resolve(resolve(name)).then(
      (module: any) => module.default || module
    )

  await resolveComponent(initialPage.component).then((initialComponent) => {
    return setup({
      // @ts-ignore
      el,
      App,
      props: {
        initialPage,
        initialComponent,
        resolveComponent,
      },
    })
  })

  if (progress) {
    setupProgress(progress)
  }
}
