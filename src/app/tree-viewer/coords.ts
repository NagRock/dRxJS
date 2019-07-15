const distanceBetweenNodes = 320;
const distanceBetweenNodeAndEdge = distanceBetweenNodes / 2;

export function getX(x: number) {
  return distanceBetweenNodeAndEdge + x * distanceBetweenNodes;
}

export function getY(y: number) {
  return distanceBetweenNodeAndEdge + y * distanceBetweenNodes;
}

export function getWidth(width: number) {
  return 2 * distanceBetweenNodeAndEdge + Math.max(width - 1, 0) * distanceBetweenNodes;
}

export function getHeight(height: number) {
  return 2 * distanceBetweenNodeAndEdge + Math.max(height - 1, 0) * distanceBetweenNodes;
}
