import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppStateProvider } from "../state/AppState";
import { useAppState } from "../hooks/useAppState";
import { useTicker } from "../hooks/useTicker";
import { Nav } from "../components/Nav";

function RootLayout() {
  const { updateState } = useAppState();
  useTicker(updateState);

  return (
    <>
      <Nav />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
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
