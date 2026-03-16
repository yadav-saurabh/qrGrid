/**
 * Dijkstra's shortest path algorithm for optimizing QR segment encoding.
 * @module
 */

/** Weighted directed graph represented as adjacency list with numeric weights. */
export interface Graph {
  [node: string]: { [neighbor: string]: number };
}

/** Result of running Dijkstra's algorithm. */
export interface DijkstraResult {
  /** Shortest distance from the start node to each reachable node. */
  distances: { [node: string]: number };
  /** Previous node in the shortest path tree (null for the start node). */
  previous: { [node: string]: string | null };
}

/**
 * A simple array-backed priority queue.
 *
 * Sufficient for the small graphs produced during QR segment optimization
 * (typically < 20 nodes).
 */
class PriorityQueue<T> {
  private readonly items: { node: T; priority: number }[] = [];

  /** Inserts a node with the given priority. */
  enqueue(node: T, priority: number): void {
    this.items.push({ node, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  /** Removes and returns the node with the lowest priority, or `undefined` if empty. */
  dequeue(): T | undefined {
    return this.items.shift()?.node;
  }

  /** Returns `true` when the queue contains no items. */
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

/**
 * Computes shortest paths from `start` to all reachable nodes using Dijkstra's algorithm.
 *
 * @param graph - Weighted directed graph (adjacency list).
 * @param start - Starting node key.
 * @returns Shortest distances and the previous-node map for path reconstruction.
 */
export function dijkstra(graph: Graph, start: string): DijkstraResult {
  const distances: DijkstraResult["distances"] = {};
  const previous: DijkstraResult["previous"] = {};
  const pq = new PriorityQueue<string>();
  const visited = new Set<string>();

  // Initialize distances with infinity
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const currentNode = pq.dequeue()!;

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

/**
 * Reconstructs the shortest path from `start` to `target` using the previous-node map.
 *
 * @param previous - Previous-node map produced by {@link dijkstra}.
 * @param start - Starting node key.
 * @param target - Target node key.
 * @returns Ordered array of node keys from `start` to `target`, or an empty array if no path exists.
 */
export function getPath(
  previous: DijkstraResult["previous"],
  start: string,
  target: string,
): string[] {
  const path: string[] = [];
  let currentNode: string | null = target;

  while (currentNode) {
    path.push(currentNode);
    currentNode = previous[currentNode];
  }

  // If the start node is not at the end of the reversed path, no path exists
  if (path[path.length - 1] !== start) {
    return [];
  }

  return path.reverse();
}
