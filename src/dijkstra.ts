/**
 * a simple priority queue implementation
 */
class PriorityQueue<T> {
  private data: { node: T; priority: number }[] = [];

  enqueue(node: T, priority: number) {
    this.data.push({ node, priority });
    this.data.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.data.shift()?.node;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }
}

type Graph = { [key: string]: { [key: string]: number } };
type DijkstraReturn = {
  distances: { [key: string]: number };
  previous: { [key: string]: string | null };
};

/**
 * dijkstra implementation
 */
export function dijkstra(graph: Graph, start: string): DijkstraReturn {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const pq = new PriorityQueue<string>();
  const visited = new Set<string>();

  // Initialize distances with infinity
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  // Start with the starting node
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const currentNode = pq.dequeue() as string;

    if (visited.has(currentNode)) {
      continue;
    }
    visited.add(currentNode);

    const neighbors = graph[currentNode];
    for (const neighbor in neighbors) {
      const newDist = distances[currentNode] + neighbors[neighbor];

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = currentNode;
        pq.enqueue(neighbor, newDist);
      }
    }
  }

  return { distances, previous };
}

export function getPath(
  previous: { [key: string]: string | null },
  start: string,
  target: string
): string[] {
  const path: string[] = [];
  let currentNode: string | null = target;

  while (currentNode) {
    path.push(currentNode);
    currentNode = previous[currentNode];
  }

  // If the start node is not in the path, it means there is no path to the target
  if (path[path.length - 1] !== start) {
    return []; // No path found
  }

  return path.reverse();
}
