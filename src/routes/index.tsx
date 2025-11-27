import { createFileRoute } from "@tanstack/react-router";
import { useImmer } from "use-immer";
import {
  SizeObserver,
  type CanvasPointerEvent,
} from "../components/SizeObserver";
import { WorldContainer, type Pointer } from "../components/WorldContainer";
import { useAppState } from "../hooks/useAppState";

export const Route = createFileRoute("/")({
  component: Index,
});

interface DragState {
  startPointer: { x: number; y: number };
  startCamera: { x: number; y: number };
  pointerId: number;
}

function Index() {
  const { state, updateState } = useAppState();
  const [pointer, setPointer] = useImmer<Pointer | null>(null);
  const [drag, setDrag] = useImmer<DragState | null>(null);

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

    if (drag && e.nativeEvent.pointerId === drag.pointerId) {
      const deltaX = e.x - drag.startPointer.x;
      const deltaY = e.y - drag.startPointer.y;
      updateState((d) => {
        d.camera.x = drag.startCamera.x - deltaX;
        d.camera.y = drag.startCamera.y - deltaY;
      });
    }
  };

  const handlePointerLeave = (e: CanvasPointerEvent) => {
    setPointer((draft) => {
      if (draft && draft.id === e.nativeEvent.pointerId) {
        return null;
      }
    });
  };

  const handlePointerDown = (e: CanvasPointerEvent) => {
    if (!drag) {
      setDrag({
        startPointer: { x: e.x, y: e.y },
        startCamera: { x: state.camera.x, y: state.camera.y },
        pointerId: e.nativeEvent.pointerId,
      });
    }
  };

  const handlePointerUp = (e: CanvasPointerEvent) => {
    if (drag && e.nativeEvent.pointerId === drag.pointerId) {
      setDrag(null);
    }
  };

  return (
    <>
      <SizeObserver
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {(size) => <WorldContainer size={size} pointer={pointer} />}
      </SizeObserver>
    </>
  );
}
