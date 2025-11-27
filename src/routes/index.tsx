import { createFileRoute } from "@tanstack/react-router";
import { useImmer } from "use-immer";
import {
  SizeObserver,
  type CanvasPointerEvent,
} from "../components/SizeObserver";
import { WorldContainer, type Pointer } from "../components/WorldContainer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [pointer, setPointer] = useImmer<Pointer | null>(null);

  const handlePointerEnter = (e: CanvasPointerEvent) => {
    setPointer({ x: e.x, y: e.y, id: e.nativeEvent.pointerId });
  };

  const handlePointerMove = (e: CanvasPointerEvent) => {
    setPointer((draft) => {
      if (draft && draft.id === e.nativeEvent.pointerId) {
        draft.x = e.x;
        draft.y = e.y;
      }
    });
  };

  const handlePointerLeave = (e: CanvasPointerEvent) => {
    setPointer((draft) => {
      if (draft && draft.id === e.nativeEvent.pointerId) {
        return null;
      }
    });
  };

  return (
    <SizeObserver
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {(size) => <WorldContainer size={size} pointer={pointer} />}
    </SizeObserver>
  );
}
