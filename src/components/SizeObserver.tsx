import {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  type ReactNode,
  useMemo,
} from "react";
import { invariant } from "../utils/invariant";

export interface Size {
  width: number;
  height: number;
}

export interface CanvasPointerEvent {
  x: number;
  y: number;
  size: Size;
  nativeEvent: PointerEvent;
}

interface SizeObserverProps {
  children: (size: Size) => ReactNode;
  onPointerDown?: (e: CanvasPointerEvent) => void;
  onPointerMove?: (e: CanvasPointerEvent) => void;
  onPointerUp?: (e: CanvasPointerEvent) => void;
  onPointerEnter?: (e: CanvasPointerEvent) => void;
  onPointerLeave?: (e: CanvasPointerEvent) => void;
}

export function SizeObserver({
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}: SizeObserverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);
  const size = useMemo(() => {
    return { width: rect.width, height: rect.height };
  }, [rect.width, rect.height]);

  useEffect(() => {
    invariant(ref.current);

    const transform = (e: PointerEvent): CanvasPointerEvent => {
      invariant(ref.current);
      const rect = ref.current.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        size,
        nativeEvent: e,
      };
    };

    const handleDown = (e: PointerEvent) => {
      if (e.target instanceof Element && ref.current?.contains(e.target)) {
        onPointerDown?.(transform(e));
      }
    };
    const handleMove = (e: PointerEvent) => onPointerMove?.(transform(e));
    const handleUp = (e: PointerEvent) => onPointerUp?.(transform(e));
    const handleEnter = (e: PointerEvent) => onPointerEnter?.(transform(e));
    const handleLeave = (e: PointerEvent) => onPointerLeave?.(transform(e));

    document.addEventListener("pointerdown", handleDown);
    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
    ref.current.addEventListener("pointerenter", handleEnter);
    ref.current.addEventListener("pointerleave", handleLeave);

    return () => {
      invariant(ref.current);
      document.removeEventListener("pointerdown", handleDown);
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
      ref.current.removeEventListener("pointerenter", handleEnter);
      ref.current.removeEventListener("pointerleave", handleLeave);
    };
  }, [
    size,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
  ]);

  return (
    <div ref={ref} className="absolute inset-0">
      {size.width > 0 && size.height > 0 && children(size)}
    </div>
  );
}

function useRect(ref: React.RefObject<HTMLDivElement | null>): DOMRectReadOnly {
  const [rect, setRect] = useState<DOMRectReadOnly>(new DOMRectReadOnly());
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setRect(entry.contentRect);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return rect;
}
