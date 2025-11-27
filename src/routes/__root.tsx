import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAppState } from "../hooks/useAppState";
import { useTicker } from "../hooks/useTicker";
import { AppStateProvider } from "../state/AppState";

const SHOW_ROUTER_DEVTOOLS = false;

function RootLayout() {
  const { updateState } = useAppState();
  useTicker(updateState);

  return (
    <>
      <Outlet />
      {SHOW_ROUTER_DEVTOOLS && <TanStackRouterDevtools />}
    </>
  );
}

export const Route = createRootRoute({
  component: () => (
    <AppStateProvider>
      <RootLayout />
    </AppStateProvider>
  ),
});
