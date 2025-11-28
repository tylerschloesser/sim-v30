import type { Entity } from "../state/AppStateContext";

export function findEntityAtPoint(
  entities: Record<string, Entity>,
  point: { x: number; y: number },
): string | null {
  return (
    Object.values(entities).find((entity) => {
      const dx = point.x - entity.position.x;
      const dy = point.y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= entity.radius;
    })?.id ?? null
  );
}
