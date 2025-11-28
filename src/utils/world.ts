import type { Entity } from "../state/AppStateContext";

export function findEntityAtPoint(
  entities: Record<string, Entity>,
  point: { x: number; y: number },
): string | null {
  return (
    Object.values(entities).find((entity) => {
      return (
        point.x >= entity.position.x &&
        point.x <= entity.position.x + entity.width &&
        point.y >= entity.position.y &&
        point.y <= entity.position.y + entity.height
      );
    })?.id ?? null
  );
}
