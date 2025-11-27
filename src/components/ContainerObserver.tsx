import { useRef, useState, useLayoutEffect, type ReactNode } from "react";

export interface Size {
  width: number;
  height: number;
}

interface ContainerObserverProps {
  children: (size: Size) => ReactNode;
}

export function ContainerObserver({ children }: ContainerObserverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {children(size)}
    </div>
  );
}
