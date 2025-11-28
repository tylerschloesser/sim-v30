import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useImmer } from "use-immer";
import { Nav } from "../components/Nav";
import {
  SizeObserver,
  type CanvasPointerEvent,
} from "../components/SizeObserver";
import { WorldContainer, type Pointer } from "../components/WorldContainer";
import { BASE_TILE_SIZE } from "../constants";
import { hasOverlappingEntity } from "../utils/world";
import { getEntityAtTile } from "../utils/chunks";
import { useAppState } from "../hooks/useAppState";
import { addEntity, connectTiles } from "../state/AppStateContext";
import { createDefaultState } from "../state/createDefaultState";
import { createTileId, parseTileId } from "../utils/tileId";
import type { TileId } from "../utils/tileId";
import { findPath } from "../utils/pathfinding";

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
  const { world, selectedTileId } = state;
  const { camera, chunks } = world;

  // from center
  const [pointer, setPointer] = useImmer<Pointer | null>(null);

  const [drag, setDrag] = useImmer<DragState | null>(null);

  // Compute pointer world position
  const pointerWorld = useMemo(() => {
    if (!pointer) return null;
    return {
      x: pointer.x / BASE_TILE_SIZE + camera.x,
      y: pointer.y / BASE_TILE_SIZE + camera.y,
    };
  }, [pointer, camera]);

  // Get hovered tile ID (only if on an entity)
  const hoverTileId = useMemo((): TileId | null => {
    if (!pointerWorld) return null;
    const tileX = Math.floor(pointerWorld.x);
    const tileY = Math.floor(pointerWorld.y);
    const entityId = getEntityAtTile(chunks, tileX, tileY);
    return entityId ? createTileId(tileX, tileY) : null;
  }, [pointerWorld, chunks]);

  // Compute preview path when hovering over different entity
  const previewPath = useMemo((): TileId[] | null => {
    if (!selectedTileId || !hoverTileId) return null;

    const selectedPos = parseTileId(selectedTileId);
    const hoverPos = parseTileId(hoverTileId);

    const srcEntity = getEntityAtTile(chunks, selectedPos.x, selectedPos.y);
    const dstEntity = getEntityAtTile(chunks, hoverPos.x, hoverPos.y);

    if (!srcEntity || !dstEntity || srcEntity === dstEntity) return null;

    return findPath(
      chunks,
      selectedTileId as TileId,
      hoverTileId,
      new Set([srcEntity, dstEntity]),
    );
  }, [selectedTileId, hoverTileId, chunks]);

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
        draft.world.camera.x = drag.startCamera.x - deltaX / BASE_TILE_SIZE;
        draft.world.camera.y = drag.startCamera.y - deltaY / BASE_TILE_SIZE;
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
        const worldX = e.x / BASE_TILE_SIZE + camera.x;
        const worldY = e.y / BASE_TILE_SIZE + camera.y;
        const tileX = Math.floor(worldX);
        const tileY = Math.floor(worldY);

        const clickedEntityId = getEntityAtTile(chunks, tileX, tileY);

        if (clickedEntityId) {
          const clickedTileId = createTileId(tileX, tileY);

          // If we have a preview path and clicking on a different entity, create connection
          if (previewPath && previewPath.length > 1) {
            updateState((draft) => {
              connectTiles(draft.world, previewPath);
              // Selection stays on source tile
            });
          } else {
            // Toggle selection
            updateState((draft) => {
              if (draft.selectedTileId === clickedTileId) {
                draft.selectedTileId = null;
              } else {
                draft.selectedTileId = clickedTileId;
              }
            });
          }
        } else {
          // Create new entity on empty space
          const width = 2;
          const height = 2;
          const topLeftX = Math.round(worldX - width / 2);
          const topLeftY = Math.round(worldY - height / 2);

          if (
            !hasOverlappingEntity(chunks, {
              x: topLeftX,
              y: topLeftY,
            })
          ) {
            updateState((draft) => {
              addEntity(draft.world, {
                position: { x: topLeftX, y: topLeftY },
                width,
                height,
                color: { h: Math.random() * 360, s: 100, l: 50 },
              });
            });
          }
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
          {(size) => (
            <WorldContainer
              size={size}
              pointer={pointer}
              previewPath={previewPath}
            />
          )}
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
