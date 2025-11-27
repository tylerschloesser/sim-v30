import type { Size } from "./SizeObserver";
import { useAppState } from "../hooks/useAppState";

interface WorldContainerProps {
  size: Size;
}

export function WorldContainer({ size }: WorldContainerProps) {
  const { state: _ } = useAppState();
  return (
    <svg className="w-full h-full">
      <circle cx={size.width / 2} cy={size.height / 2} r={32} fill="blue" />
    </svg>
  );
}
