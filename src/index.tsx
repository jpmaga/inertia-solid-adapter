import { router as Router } from "@inertiajs/core"

export const router = Router
export { default as createInertiaApp } from "./createInertiaApp"
export { default as Link } from "./Link"
export type { InertiaLinkProps } from "./Link"
export { usePage, usePageProps } from "./context"
