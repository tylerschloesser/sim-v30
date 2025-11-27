import type { Size } from "./SizeObserver";
import { useAppState } from "../hooks/useAppState";

interface WorldContainerProps {
  size: Size;
}

export function WorldContainer({ size }: WorldContainerProps) {
  const { state } = useAppState();
  return (
    <div className="w-full h-full">
      {size.width}x{size.height} | tick: {state.tick} | camera: {state.camera.x},{state.camera.y}
    </div>
  );
}
