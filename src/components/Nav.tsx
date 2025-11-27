import { Link } from "@tanstack/react-router";
import { useAppState } from "../hooks/useAppState";

export function Nav() {
  const { state } = useAppState();

  return (
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <span className="ml-auto font-mono select-none">{state.tick}</span>
    </div>
  );
}
