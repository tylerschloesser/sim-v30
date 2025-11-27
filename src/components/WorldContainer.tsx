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

  return (
    <svg className="w-full h-full">
      <g transform={`translate(${size.width / 2 - camera.x}, ${size.height / 2 - camera.y})`}>
        <circle cx={0} cy={0} r={32} fill="blue" />
        {pointerWorld && (
          <circle cx={pointerWorld.x} cy={pointerWorld.y} r={16} fill="red" />
        )}
      </g>
    </svg>
  );
}
