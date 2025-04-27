
type Node = {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  parent: Node | null;
  isWall: boolean;
};

type Position = {
  x: number;
  y: number;
};

export const createNode = (x: number, y: number): Node => ({
  x,
  y,
  f: 0,
  g: 0,
  h: 0,
  parent: null,
  isWall: false,
});

const heuristic = (pos0: Position, pos1: Position): number => {
  const dx = Math.abs(pos1.x - pos0.x);
  const dy = Math.abs(pos1.y - pos0.y);
  return dx + dy;
};

const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const neighbors: Node[] = [];
  const { x, y } = node;

  // Check all adjacent squares
  if (x > 0) neighbors.push(grid[y][x - 1]); // Left
  if (x < grid[0].length - 1) neighbors.push(grid[y][x + 1]); // Right
  if (y > 0) neighbors.push(grid[y - 1][x]); // Up
  if (y < grid.length - 1) neighbors.push(grid[y + 1][x]); // Down

  return neighbors.filter(neighbor => !neighbor.isWall);
};

export const findPath = (
  startPos: Position,
  endPos: Position,
  grid: Node[][]
): Node[] => {
  const openSet: Node[] = [];
  const closedSet: Set<string> = new Set();
  const start = grid[startPos.y][startPos.x];
  const end = grid[endPos.y][endPos.x];

  openSet.push(start);

  while (openSet.length > 0) {
    let current = openSet[0];
    let currentIndex = 0;

    // Find node with lowest f score
    openSet.forEach((node, index) => {
      if (node.f < current.f) {
        current = node;
        currentIndex = index;
      }
    });

    // If we reached the end, construct and return the path
    if (current.x === end.x && current.y === end.y) {
      const path: Node[] = [];
      let temp: Node | null = current;
      while (temp !== null) {
        path.push(temp);
        temp = temp.parent;
      }
      return path.reverse();
    }

    // Remove current from openSet and add to closedSet
    openSet.splice(currentIndex, 1);
    closedSet.add(`${current.x},${current.y}`);

    // Check all neighbors
    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

      const tentativeG = current.g + 1;

      const isNewPath = !openSet.includes(neighbor);
      if (isNewPath) {
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
        openSet.push(neighbor);
      } else if (tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  return []; // No path found
};
