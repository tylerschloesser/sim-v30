import { useMemo } from "react";
import type { Size } from "./SizeObserver";
import { useAppState } from "../hooks/useAppState";
import { BASE_TILE_SIZE } from "../constants";
import {
  findEntityAtPoint,
  hasOverlappingEntity,
  wouldBlockConnection,
} from "../utils/world";
import { getEntityAtTile, getTileIdFromChunkIndex } from "../utils/chunks";
import { parseTileId } from "../utils/tileId";
import type { TileId } from "../utils/tileId";

export interface Pointer {
  x: number;
  y: number;
  id: number;
}

interface WorldContainerProps {
  size: Size;
  pointer: Pointer | null;
  scale?: number;
  previewPath?: TileId[] | null;
}

export function WorldContainer({
  size,
  pointer,
  scale = 1,
  previewPath,
}: WorldContainerProps) {
  const { state } = useAppState();
  const { world, selectedTileId } = state;
  const { camera, entities, chunks } = world;

  const tileSize = BASE_TILE_SIZE * scale;
  const patternId = `dot-grid-${scale}`;

  const scaledCamera = useMemo(
    () => ({ x: camera.x * tileSize, y: camera.y * tileSize }),
    [camera, tileSize],
  );

  const pointerWorld = useMemo(
    () =>
      pointer
        ? {
            x: pointer.x / tileSize + camera.x,
            y: pointer.y / tileSize + camera.y,
          }
        : null,
    [pointer, camera, tileSize],
  );

  const gridX =
    Math.floor((scaledCamera.x - size.width / 2) / tileSize) * tileSize -
    tileSize;
  const gridY =
    Math.floor((scaledCamera.y - size.height / 2) / tileSize) * tileSize -
    tileSize;

  // Build SVG path for tile-based connections
  const connectionPath = useMemo(() => {
    const segments: string[] = [];
    const seen = new Set<string>();

    for (const [chunkKey, chunk] of Object.entries(chunks)) {
      for (let i = 0; i < chunk.tiles.length; i++) {
        const tile = chunk.tiles[i];
        if (!tile?.connections) continue;

        const tileId = getTileIdFromChunkIndex(chunkKey, i);
        const { x: x1, y: y1 } = parseTileId(tileId);

        for (const connectedId of Object.keys(tile.connections)) {
          const pairKey =
            tileId < connectedId
              ? `${tileId}|${connectedId}`
              : `${connectedId}|${tileId}`;
          if (seen.has(pairKey)) continue;
          seen.add(pairKey);

          const { x: x2, y: y2 } = parseTileId(connectedId);
          segments.push(`M${x1 + 0.5} ${y1 + 0.5} L${x2 + 0.5} ${y2 + 0.5}`);
        }
      }
    }

    return segments.join(" ");
  }, [chunks]);

  const hoverEntityId = useMemo(() => {
    if (!pointerWorld) return null;
    return findEntityAtPoint(chunks, pointerWorld);
  }, [pointerWorld, chunks]);

  // Build preview path SVG
  const previewPathD = useMemo(() => {
    if (!previewPath || previewPath.length < 2) return null;

    const commands = previewPath.map((tileId, i) => {
      const { x, y } = parseTileId(tileId);
      const cmd = i === 0 ? "M" : "L";
      return `${cmd}${x + 0.5} ${y + 0.5}`;
    });

    return commands.join(" ");
  }, [previewPath]);

  const previewOverlaps = useMemo(() => {
    if (!pointerWorld) return false;
    const x = Math.round(pointerWorld.x - 1);
    const y = Math.round(pointerWorld.y - 1);
    return (
      hasOverlappingEntity(chunks, { x, y }) ||
      wouldBlockConnection(chunks, x, y)
    );
  }, [pointerWorld, chunks]);

  // Get selected entity ID for entity stroke highlighting
  const selectedEntityId = useMemo(() => {
    if (!selectedTileId) return null;
    const pos = parseTileId(selectedTileId);
    return getEntityAtTile(chunks, pos.x, pos.y);
  }, [selectedTileId, chunks]);

  return (
    <svg className="w-full h-full">
      <defs>
        <pattern
          id={patternId}
          width={tileSize}
          height={tileSize}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={tileSize / 2}
            cy={tileSize / 2}
            r={1.5 * scale}
            fill="#ccc"
          />
        </pattern>
      </defs>
      <g
        transform={`translate(${size.width / 2 - scaledCamera.x}, ${size.height / 2 - scaledCamera.y})`}
      >
        <rect
          x={gridX}
          y={gridY}
          width={size.width + tileSize * 2}
          height={size.height + tileSize * 2}
          fill={`url(#${patternId})`}
        />
        {Object.values(entities).map((entity) => (
          <rect
            key={entity.id}
            x={entity.position.x * tileSize}
            y={entity.position.y * tileSize}
            width={entity.width * tileSize}
            height={entity.height * tileSize}
            fill={`hsl(${entity.color.h}, ${entity.color.s}%, ${entity.color.l}%)`}
            stroke={
              selectedEntityId === entity.id
                ? "#0ff"
                : hoverEntityId === entity.id
                  ? "#ff0"
                  : "#000"
            }
            strokeWidth={2 * scale}
          />
        ))}
        {/* Tile-based connections */}
        {connectionPath && (
          <path
            d={connectionPath}
            stroke="#666"
            strokeWidth={0.1}
            fill="none"
            transform={`scale(${tileSize})`}
          />
        )}
        {/* Preview path */}
        {previewPathD && (
          <path
            d={previewPathD}
            stroke="#0ff"
            strokeWidth={0.15}
            strokeDasharray="0.2 0.1"
            fill="none"
            opacity={0.8}
            transform={`scale(${tileSize})`}
          />
        )}
        {/* Selected tile highlight */}
        {selectedTileId && (
          <rect
            x={parseTileId(selectedTileId).x * tileSize}
            y={parseTileId(selectedTileId).y * tileSize}
            width={tileSize}
            height={tileSize}
            fill="none"
            stroke="#0ff"
            strokeWidth={2 * scale}
          />
        )}
        {!hoverEntityId && !previewOverlaps && pointerWorld && (
          <rect
            x={Math.round(pointerWorld.x - 1) * tileSize}
            y={Math.round(pointerWorld.y - 1) * tileSize}
            width={2 * tileSize}
            height={2 * tileSize}
            fill="red"
            opacity={0.5}
          />
        )}
      </g>
    </svg>
  );
}
