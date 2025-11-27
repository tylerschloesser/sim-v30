import { createFileRoute } from "@tanstack/react-router";
import { SizeObserver } from "../components/SizeObserver";
import { WorldContainer } from "../components/WorldContainer";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <h3 className="text-2xl font-bold">About</h3>
      <div className="fixed bottom-4 right-4 w-60 h-40 overflow-hidden border">
        <SizeObserver>
          {(size) => <WorldContainer size={size} pointer={null} />}
        </SizeObserver>
      </div>
    </div>
  );
}
