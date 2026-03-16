/**
 * Input segmentation and Dijkstra-based optimization for QR encoding.
 * @module
 */
import { getBitsLength } from "./utils.js";
import { CHARACTER_COUNT_INDICATOR, MODE_INDICATOR_BITS } from "./constants.js";
import { dijkstra, getPath } from "./dijkstra.js";
import { Mode, ModeType } from "./enums.js";
import { regexString } from "./utils.js";

/** Sentinel node keys for the optimization graph. */
const GRAPH_START_NODE = "start";
const GRAPH_END_NODE = "end";

/** A single QR encoding segment: a string value and its encoding mode. */
export interface Segment {
  value: string;
  mode: ModeType;
}

/** An ordered array of QR encoding segments. */
export type Segments = Segment[];

/**
 * Splits an input string into segments based on basic regex-based mode detection.
 *
 * Characters are classified into Numeric, AlphaNumeric, or Byte mode
 * using greedy regex matching.
 *
 * @param data - The input string to segment.
 * @returns Array of segments with their detected encoding modes.
 *
 * @example
 * getBasicInputSegments("Hello123");
 * // [
 * //   { value: "H", mode: "AlphaNumeric" },
 * //   { value: "ello", mode: "Byte" },
 * //   { value: "123", mode: "Numeric" },
 * // ]
 */
export function getBasicInputSegments(data: string): Segments {
  const regStr = [
    `(${regexString[Mode.AlphaNumeric]})`,
    `(${regexString[Mode.Numeric]})`,
    `(${regexString[Mode.Byte]})`,
  ];
  const regex = new RegExp(regStr.join("|"), "g");
  const segments: Segments = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(data)) !== null) {
    if (match[1]) {
      segments.push({ value: match[1], mode: Mode.AlphaNumeric });
    } else if (match[2]) {
      segments.push({ value: match[2], mode: Mode.Numeric });
    } else if (match[3]) {
      segments.push({ value: match[3], mode: Mode.Byte });
    }
  }

  return segments;
}

/**
 * Optimizes segments using Dijkstra's algorithm to minimize total bit usage.
 *
 * Builds a weighted graph where each segment can be encoded in multiple
 * compatible modes (e.g., Numeric data can also be encoded as AlphaNumeric
 * or Byte). Edge weights represent the bit cost of encoding transitions.
 * The shortest path through this graph yields the optimal mode assignment.
 *
 * @param segments - Basic segments from {@link getBasicInputSegments}.
 * @param ccIndex - Character count indicator index (0 for v1-9, 1 for v10-26, 2 for v27-40).
 * @returns Optimized segments with merged adjacent same-mode segments.
 *
 * @example
 * const basic = [{ value: "H", mode: "AlphaNumeric" }, { value: "ello", mode: "Byte" }];
 * getOptimizedSegments(basic, 0);
 * // [{ value: "Hello", mode: "Byte" }]
 */
export function getOptimizedSegments(
  segments: Segments,
  ccIndex: number,
): Segments {
  const graph: Record<string, Record<string, number>> = {
    [GRAPH_START_NODE]: {},
  };
  const nodes: Record<string, Segment> = {};
  let previousKeys: string[] = [GRAPH_START_NODE];

  // Build a graph with all possible mode encodings as nodes and bit costs as weights
  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
    const element = segments[segmentIndex];
    const connects: Segment[] = [element];
    const currentKeys: string[] = [];

    // Add compatible higher-capacity modes
    if (element.mode === Mode.Numeric) {
      connects.push(
        { value: element.value, mode: Mode.AlphaNumeric },
        { value: element.value, mode: Mode.Byte },
      );
    }
    if (element.mode === Mode.AlphaNumeric) {
      connects.push({ value: element.value, mode: Mode.Byte });
    }

    // Add edges from all previous nodes to each compatible mode
    for (let connectIndex = 0; connectIndex < connects.length; connectIndex++) {
      const connectElement = connects[connectIndex];
      const key = `${segmentIndex}${connectIndex}`;
      nodes[key] = connectElement;
      currentKeys.push(key);

      for (let i = 0; i < previousKeys.length; i++) {
        const graphKey = previousKeys[i];

        // If previous node uses the same mode, calculate incremental bit cost (no new header)
        if (nodes[graphKey] && nodes[graphKey].mode === connectElement.mode) {
          const combined: Segment = {
            value: nodes[graphKey].value + connectElement.value,
            mode: connectElement.mode,
          };
          graph[graphKey][key] =
            getBitsLength(combined) - getBitsLength(nodes[graphKey]);
        } else {
          // Different mode: include mode indicator + character count indicator overhead
          graph[graphKey][key] =
            getBitsLength(connectElement) +
            MODE_INDICATOR_BITS +
            CHARACTER_COUNT_INDICATOR[connectElement.mode][ccIndex];
        }
      }

      // Terminal segments connect to the end node with zero cost
      graph[key] =
        segmentIndex === segments.length - 1 ? { [GRAPH_END_NODE]: 0 } : {};
    }

    previousKeys = currentKeys;
  }

  const result = dijkstra({ ...graph, end: {} }, GRAPH_START_NODE);
  const path = getPath(result.previous, GRAPH_START_NODE, GRAPH_END_NODE);
  const optimized: Segments = [];

  // Merge adjacent segments with the same mode
  for (let i = 0; i < path.length; i++) {
    const element = nodes[path[i]];
    const prevElement = nodes[path[i - 1]];

    if (prevElement && prevElement.mode === element?.mode) {
      optimized[optimized.length - 1] = {
        value: optimized[optimized.length - 1].value + element.value,
        mode: element.mode,
      };
    } else if (element) {
      optimized.push(element);
    }
  }

  return optimized;
}
