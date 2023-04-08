import {
  FormDataConvertible,
  mergeDataIntoQueryString,
  Method,
  PreserveStateOption,
  Progress,
  router,
  shouldIntercept,
} from "@inertiajs/core"
import { Dynamic } from "solid-js/web"
import {
  Component,
  JSXElement,
  splitProps,
  mergeProps,
  createEffect,
} from "solid-js"

const noop: any = () => undefined

interface BaseInertiaLinkProps {
  as?: string
  data?: Record<string, FormDataConvertible>
  href: string
  method?: Method
  headers?: Record<string, string>
  onClick?: (event: MouseEvent | KeyboardEvent) => void
  preserveScroll?: PreserveStateOption
  preserveState?: PreserveStateOption
  replace?: boolean
  only?: string[]
  onCancelToken?: (cancelToken: import("axios").CancelTokenSource) => void
  onBefore?: () => void
  onStart?: () => void
  onProgress?: (progress: Progress) => void
  onFinish?: () => void
  onCancel?: () => void
  onSuccess?: () => void
  onError?: () => void
  queryStringArrayFormat?: "indices" | "brackets"
}

export type InertiaLinkProps = BaseInertiaLinkProps & { children?: JSXElement }
// & Omit<HTMLAttributes<HTMLElement>, keyof BaseInertiaLinkProps> &
// Omit<React.AllHTMLAttributes<HTMLElement>, keyof BaseInertiaLinkProps>

type InertiaLink = Component<InertiaLinkProps>

const defaults = {
  as: "a",
  data: {},
  method: "get",
  preserveScroll: false,
  preserveState: null as any,
  replace: false,
  only: [],
  headers: {},
  queryStringArrayFormat: "brackets",
  onClick: noop,
  onCancelToken: noop,
  onBefore: noop,
  onStart: noop,
  onProgress: noop,
  onFinish: noop,
  onCancel: noop,
  onSuccess: noop,
  onError: noop,
} as Omit<InertiaLinkProps, "href">

const Link: InertiaLink = (props) => {
  const merged = mergeProps(defaults, props)
  const [local, rest] = splitProps(merged, [
    ...(Object.keys(defaults) as any),
    "href",
  ])

  const as = () => local.as.toLowerCase()
  const method = () => local.method.toLowerCase() as Method
  const qs = () =>
    mergeDataIntoQueryString(
      method(),
      local.href || "",
      local.data,
      local.queryStringArrayFormat
    )
  const href = () => qs()[0]
  const data = () => qs()[1]

  const visit = (event) => {
    local.onClick(event)

    if (shouldIntercept(event)) {
      event.preventDefault()

      router.visit(local.href, {
        data: data(),
        method: method(),
        preserveScroll: local.preserverScroll,
        preserveState: local.preserveState ?? local.method !== "get",
        replace: local.replace,
        only: local.only,
        headers: local.headers,
        onCancelToken: local.onCancelToken,
        onBefore: local.onBefore,
        onStart: local.onStart,
        onProgress: local.onProgress,
        onFinish: local.onFinish,
        onCancel: local.onCancel,
        onSuccess: local.onSuccess,
        onError: local.onError,
      })
    }
  }

  createEffect(() => {
    if (as() === "a" && method() !== "get") {
      console.warn(
        `Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<Link href="${href()}" method="${method()}" as="button">...</Link>`
      )
    }
  })

  return (
    <Dynamic
      component={as()}
      {...rest}
      {...(as() === "a" ? { href: href() } : {})}
      onClick={visit}
    />
  )
}

export default Link
