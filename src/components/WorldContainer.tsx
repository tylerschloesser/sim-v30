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
  const { state: _ } = useAppState();
  return (
    <svg className="w-full h-full">
      <circle cx={size.width / 2} cy={size.height / 2} r={32} fill="blue" />
      {pointer && <circle cx={pointer.x} cy={pointer.y} r={16} fill="red" />}
    </svg>
  );
}
