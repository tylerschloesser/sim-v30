import type { Entity } from "../state/AppStateContext";

export function hasOverlappingEntity(
  entities: Record<string, Entity>,
  rect: { x: number; y: number; width: number; height: number },
): boolean {
  return Object.values(entities).some((entity) => {
    return (
      rect.x < entity.position.x + entity.width &&
      rect.x + rect.width > entity.position.x &&
      rect.y < entity.position.y + entity.height &&
      rect.y + rect.height > entity.position.y
    );
  });
}

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
