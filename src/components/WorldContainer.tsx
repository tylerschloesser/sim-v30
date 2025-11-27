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
}

export function WorldContainer({ size, pointer }: WorldContainerProps) {
  const { state } = useAppState();
  const { camera } = state;

  const pointerWorld = pointer
    ? {
        x: pointer.x - size.width / 2 + camera.x,
        y: pointer.y - size.height / 2 + camera.y,
      }
    : null;

  const gridX = Math.floor((camera.x - size.width / 2) / 32) * 32 - 32;
  const gridY = Math.floor((camera.y - size.height / 2) / 32) * 32 - 32;

  return (
    <svg className="w-full h-full">
      <defs>
        <pattern
          id="dot-grid"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="16" cy="16" r="1.5" fill="#ccc" />
        </pattern>
      </defs>
      <g
        transform={`translate(${size.width / 2 - camera.x}, ${size.height / 2 - camera.y})`}
      >
        <rect
          x={gridX}
          y={gridY}
          width={size.width + 64}
          height={size.height + 64}
          fill="url(#dot-grid)"
        />
        <circle cx={0} cy={0} r={32} fill="blue" />
        {pointerWorld && (
          <circle cx={pointerWorld.x} cy={pointerWorld.y} r={16} fill="red" />
        )}
      </g>
    </svg>
  );
}
