export type TileId = `${number},${number}`;

export function createTileId(x: number, y: number): TileId {
  return `${x},${y}`;
}

export function parseTileId(id: string): { x: number; y: number } {
  const [x, y] = id.split(",").map(Number);
  return { x, y };
}
