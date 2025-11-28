import { useMemo } from "react";
import type { Size } from "./SizeObserver";
import { useAppState } from "../hooks/useAppState";
import { BASE_TILE_SIZE } from "../constants";
import { findEntityAtPoint, hasOverlappingEntity } from "../utils/world";
import { getEntityCenter } from "../state/AppStateContext";

export interface Pointer {
  x: number;
  y: number;
  id: number;
}

interface WorldContainerProps {
  size: Size;
  pointer: Pointer | null;
  scale?: number;
}

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function WorldContainer({
  size,
  pointer,
  scale = 1,
}: WorldContainerProps) {
  const { state } = useAppState();
  const { world, selectedEntityId } = state;
  const { camera, entities } = world;

  const tileSize = BASE_TILE_SIZE * scale;
  const patternId = `dot-grid-${scale}`;

  const scaledCamera = useMemo(
    () => ({ x: camera.x * tileSize, y: camera.y * tileSize }),
    [camera, tileSize],
  );

  const pointerWorld = useMemo(
    () =>
      pointer
        ? {
            x: pointer.x / tileSize + camera.x,
            y: pointer.y / tileSize + camera.y,
          }
        : null,
    [pointer, camera, tileSize],
  );

  const gridX =
    Math.floor((scaledCamera.x - size.width / 2) / tileSize) * tileSize -
    tileSize;
  const gridY =
    Math.floor((scaledCamera.y - size.height / 2) / tileSize) * tileSize -
    tileSize;

  const connectionLines = useMemo(() => {
    const lines: ConnectionLine[] = [];
    const seen = new Set<string>();

    for (const entity of Object.values(entities)) {
      for (const connectedId of Object.keys(entity.connections)) {
        const pairId =
          entity.id < connectedId
            ? `${entity.id}-${connectedId}`
            : `${connectedId}-${entity.id}`;

        if (seen.has(pairId)) continue;
        seen.add(pairId);

        const other = entities[connectedId];
        if (!other) continue;

        const center1 = getEntityCenter(entity);
        const center2 = getEntityCenter(other);

        lines.push({
          id: pairId,
          x1: center1.x,
          y1: center1.y,
          x2: center2.x,
          y2: center2.y,
        });
      }
    }
    return lines;
  }, [entities]);

  const hoverEntityId = useMemo(() => {
    if (!pointerWorld) return null;
    return findEntityAtPoint(entities, pointerWorld);
  }, [pointerWorld, entities]);

  const previewOverlaps = useMemo(() => {
    if (!pointerWorld) return false;
    return hasOverlappingEntity(entities, {
      x: Math.round(pointerWorld.x - 1),
      y: Math.round(pointerWorld.y - 1),
      width: 2,
      height: 2,
    });
  }, [pointerWorld, entities]);

  return (
    <svg className="w-full h-full">
      <defs>
        <pattern
          id={patternId}
          width={tileSize}
          height={tileSize}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={tileSize / 2}
            cy={tileSize / 2}
            r={1.5 * scale}
            fill="#ccc"
          />
        </pattern>
      </defs>
      <g
        transform={`translate(${size.width / 2 - scaledCamera.x}, ${size.height / 2 - scaledCamera.y})`}
      >
        <rect
          x={gridX}
          y={gridY}
          width={size.width + tileSize * 2}
          height={size.height + tileSize * 2}
          fill={`url(#${patternId})`}
        />
        {Object.values(entities).map((entity) => (
          <rect
            key={entity.id}
            x={entity.position.x * tileSize}
            y={entity.position.y * tileSize}
            width={entity.width * tileSize}
            height={entity.height * tileSize}
            fill={`hsl(${entity.color.h}, ${entity.color.s}%, ${entity.color.l}%)`}
            stroke={
              selectedEntityId === entity.id
                ? "#0ff"
                : hoverEntityId === entity.id
                  ? "#ff0"
                  : "#000"
            }
            strokeWidth={2 * scale}
          />
        ))}
        {connectionLines.map((line) => (
          <line
            key={line.id}
            x1={line.x1 * tileSize}
            y1={line.y1 * tileSize}
            x2={line.x2 * tileSize}
            y2={line.y2 * tileSize}
            stroke="#000"
            strokeWidth={2 * scale}
          />
        ))}
        {!hoverEntityId && !previewOverlaps && pointerWorld && (
          <rect
            x={Math.round(pointerWorld.x - 1) * tileSize}
            y={Math.round(pointerWorld.y - 1) * tileSize}
            width={2 * tileSize}
            height={2 * tileSize}
            fill="red"
            opacity={0.5}
          />
        )}
      </g>
    </svg>
  );
}
