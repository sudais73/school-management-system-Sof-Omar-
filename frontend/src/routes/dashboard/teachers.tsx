import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/teachers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/teachers"!</div>
}
