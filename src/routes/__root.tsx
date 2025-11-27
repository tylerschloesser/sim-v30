import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppStateProvider } from "../state/AppState";
import { useAppState } from "../hooks/useAppState";
import { useTicker } from "../hooks/useTicker";

function RootLayout() {
  const { state, updateState } = useAppState();
  useTicker(updateState);

  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <span className="ml-auto font-mono">{state.tick}</span>
      </div>
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
