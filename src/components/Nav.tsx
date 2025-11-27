import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <div className="p-2 flex gap-2 border-b sticky top-0 bg-white">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
  );
}
