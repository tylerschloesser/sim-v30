import { createFileRoute } from "@tanstack/react-router";
import { useImmer } from "use-immer";
import { Nav } from "../components/Nav";
import {
  SizeObserver,
  type CanvasPointerEvent,
} from "../components/SizeObserver";
import { WorldContainer, findEntityAtPoint, type Pointer } from "../components/WorldContainer";
import { useAppState } from "../hooks/useAppState";
import { addEntity, connectEntities } from "../state/AppStateContext";
import { createDefaultState } from "../state/createDefaultState";

const DRAG_THRESHOLD = 5;

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

  // from center
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
      updateState((draft) => {
        draft.world.camera.x = drag.startCamera.x - deltaX;
        draft.world.camera.y = drag.startCamera.y - deltaY;
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
        startCamera: { x: state.world.camera.x, y: state.world.camera.y },
        pointerId: e.nativeEvent.pointerId,
      });
    }
  };

  const handlePointerUp = (e: CanvasPointerEvent) => {
    if (drag && e.nativeEvent.pointerId === drag.pointerId) {
      const deltaX = e.x - drag.startPointer.x;
      const deltaY = e.y - drag.startPointer.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < DRAG_THRESHOLD) {
        const worldX = e.x + state.world.camera.x;
        const worldY = e.y + state.world.camera.y;

        const clickedEntityId = findEntityAtPoint(state.world.entities, {
          x: worldX,
          y: worldY,
        });

        if (clickedEntityId) {
          updateState((draft) => {
            draft.selectedEntityId = clickedEntityId;
          });
        } else {
          updateState((draft) => {
            const newId = addEntity(draft.world, {
              position: { x: worldX, y: worldY },
              radius: 16,
              color: { h: Math.random() * 360, s: 100, l: 50 },
              connections: {},
            });
            connectEntities(draft.world, newId, draft.selectedEntityId ?? "0");
            draft.selectedEntityId = newId;
          });
        }
      }

      setDrag(null);
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col">
      <Nav />
      <div className="flex-1 relative">
        <SizeObserver
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {(size) => <WorldContainer size={size} pointer={pointer} />}
        </SizeObserver>
      </div>
      <BottomBar />
    </div>
  );
}

function BottomBar() {
  const { state, updateState } = useAppState();

  const handleReset = () => {
    if (window.confirm("Reset to initial state?")) {
      updateState(() => createDefaultState());
    }
  };

  return (
    <div className="p-2 flex border-t items-center justify-between">
      <span className="font-mono select-none text-xs">{state.world.tick}</span>
      <button
        onClick={handleReset}
        className="text-xs text-blue-600 hover:underline"
      >
        Reset
      </button>
    </div>
  );
}
