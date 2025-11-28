import { SizeObserver } from "./SizeObserver";
import { WorldContainer } from "./WorldContainer";

export function MiniMap() {
  return (
    <div className="fixed bottom-4 right-4 w-60 h-40 overflow-hidden border bg-white">
      <SizeObserver>
        {(size) => (
          <WorldContainer size={size} pointer={null} scale={0.125} />
        )}
      </SizeObserver>
    </div>
  );
}
