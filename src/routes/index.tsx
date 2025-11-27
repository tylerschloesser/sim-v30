import { createFileRoute } from "@tanstack/react-router";
import { ContainerObserver } from "../components/ContainerObserver";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <ContainerObserver>
      {(size) => (
        <div className="p-2">
          <h3 className="text-2xl font-bold">Welcome Home!</h3>
          <p>
            Container size: {size.width}px x {size.height}px
          </p>
        </div>
      )}
    </ContainerObserver>
  );
}
