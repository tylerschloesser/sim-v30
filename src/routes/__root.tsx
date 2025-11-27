import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AppStateProvider, useAppState } from '../state/AppState'
import { useTicker } from '../hooks/useTicker'

function RootLayout() {
  const { updateState } = useAppState()
  useTicker(updateState)

  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: () => (
    <AppStateProvider>
      <RootLayout />
    </AppStateProvider>
  ),
})
