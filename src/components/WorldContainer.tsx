import { useMemo } from "react";
import type { Size } from "./SizeObserver";
import { useAppState } from "../hooks/useAppState";

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

const BASE_CELL_SIZE = 32;

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
  const { camera } = state;

  const cellSize = BASE_CELL_SIZE * scale;
  const patternId = `dot-grid-${scale}`;

  const scaledCamera = { x: camera.x * scale, y: camera.y * scale };

  const pointerWorld = pointer
    ? {
        x: pointer.x + scaledCamera.x,
        y: pointer.y + scaledCamera.y,
      }
    : null;

  const gridX =
    Math.floor((scaledCamera.x - size.width / 2) / cellSize) * cellSize -
    cellSize;
  const gridY =
    Math.floor((scaledCamera.y - size.height / 2) / cellSize) * cellSize -
    cellSize;

  const connectionLines = useMemo(() => {
    const lines: ConnectionLine[] = [];
    const seen = new Set<string>();

    for (const entity of Object.values(state.entities)) {
      for (const connectedId of Object.keys(entity.connections)) {
        const pairId =
          entity.id < connectedId
            ? `${entity.id}-${connectedId}`
            : `${connectedId}-${entity.id}`;

        if (seen.has(pairId)) continue;
        seen.add(pairId);

        const other = state.entities[connectedId];
        if (!other) continue;

        lines.push({
          id: pairId,
          x1: entity.position.x,
          y1: entity.position.y,
          x2: other.position.x,
          y2: other.position.y,
        });
      }
    }
    return lines;
  }, [state.entities]);

  return (
    <svg className="w-full h-full">
      <defs>
        <pattern
          id={patternId}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={cellSize / 2}
            cy={cellSize / 2}
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
          width={size.width + cellSize * 2}
          height={size.height + cellSize * 2}
          fill={`url(#${patternId})`}
        />
        {Object.values(state.entities).map((entity) => (
          <circle
            key={entity.id}
            cx={entity.position.x * scale}
            cy={entity.position.y * scale}
            r={entity.radius * scale}
            fill={`hsl(${entity.color.h}, ${entity.color.s}%, ${entity.color.l}%)`}
          />
        ))}
        {connectionLines.map((line) => (
          <line
            key={line.id}
            x1={line.x1 * scale}
            y1={line.y1 * scale}
            x2={line.x2 * scale}
            y2={line.y2 * scale}
            stroke="#000"
            strokeWidth={2 * scale}
          />
        ))}
        {pointerWorld && (
          <circle
            cx={pointerWorld.x}
            cy={pointerWorld.y}
            r={cellSize / 2}
            fill="red"
          />
        )}
      </g>
    </svg>
  );
}
