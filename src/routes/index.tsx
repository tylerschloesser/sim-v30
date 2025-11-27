import { createFileRoute } from "@tanstack/react-router";
import { SizeObserver } from "../components/SizeObserver";
import { WorldContainer } from "../components/WorldContainer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SizeObserver>
      {(size) => <WorldContainer size={size} />}
    </SizeObserver>
  );
}
