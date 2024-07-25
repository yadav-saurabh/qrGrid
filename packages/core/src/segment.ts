/**
 * This module contains function to divide input sting to suitable segments for qr.
 * @module
 */
import { getBitsLength } from "./utils";
import { CHARACTER_COUNT_INDICATOR, MODE_INDICATOR_BITS } from "./constants";
import { dijkstra, getPath } from "./dijkstra";
import { Mode } from "./enums";
import { regexString } from "./utils";

const GRAPH_START_NODE = "start";
const GRAPH_END_NODE = "end";

/**
 * Qr Code Segment Type
 */
export type Segments = Array<{ value: string; mode: Mode }>;

/**
 * split the string into basic Mode
 * @example
 * getBasicInputSegments("Hello")
 * // output
 * [{value: 'H', mode: 'AlphaNumeric' }, {value: 'ello', mode: 'Byte' }]
 */
export function getBasicInputSegments(data: string): Segments {
  const regStr = [
    `(${regexString[Mode.AlphaNumeric]})`,
    `(${regexString[Mode.Numeric]})`,
    `(${regexString[Mode.Byte]})`,
  ];
  const regex = new RegExp(regStr.join("|"), "g");
  let match: RegExpExecArray | null;
  const inputType: Segments = [];

  // split the input string to specific mode
  while ((match = regex.exec(data)) !== null) {
    if (match[1]) {
      inputType.push({ value: match[1], mode: Mode.AlphaNumeric });
    } else if (match[2]) {
      inputType.push({ value: match[2], mode: Mode.Numeric });
    } else if (match[3]) {
      inputType.push({ value: match[3], mode: Mode.Byte });
    }
  }

  return inputType;
}

/**
 * optimize the segment using dijkstra
 * @example
 * getOptimizedSegments([{value: 'H', mode: 'AlphaNumeric' }, {value: 'ello', mode: 'Byte' }])
 * // output
 * [{value: 'Hello', mode: 'Byte' }]
 */
export function getOptimizedSegments(
  segments: Segments,
  ccIndex: number
): Segments {
  let graph: Record<string, Record<string, number>> = {
    [GRAPH_START_NODE]: {},
  };
  let nodes: Record<string, Segments[0]> = {};
  let keys: string[] = [GRAPH_START_NODE];

  // generate a graph of all possible mode as nodes and bits as their weight
  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
    const element = segments[segmentIndex];
    let connects: Segments = [element];
    let currentKeys: string[] = [];

    // add other possible mode types
    if (element.mode === Mode.Numeric) {
      connects.push(
        { value: element.value, mode: Mode.AlphaNumeric },
        { value: element.value, mode: Mode.Byte }
      );
    }
    if (element.mode === Mode.AlphaNumeric) {
      connects.push({ value: element.value, mode: Mode.Byte });
    }

    // loop through connect(possible mode) and add them in graph with weight as the byte
    for (let connectIndex = 0; connectIndex < connects.length; connectIndex++) {
      const connectElement = connects[connectIndex];
      const key = `${segmentIndex}${connectIndex}`;
      nodes[key] = connectElement;
      currentKeys.push(key);

      // calculate byte and add to the previous nodes
      for (let i = 0; i < keys.length; i++) {
        const graphKey = keys[i];

        // if previous node is same as current then no mode indicator and character count indicator bits
        if (nodes[graphKey] && nodes[graphKey].mode === connectElement.mode) {
          const segmentSum = {
            value: nodes[graphKey].value + connectElement.value,
            mode: connectElement.mode,
          };
          graph[graphKey][key] =
            getBitsLength(segmentSum) - getBitsLength(nodes[graphKey]);
        } else {
          graph[graphKey][key] =
            getBitsLength(connectElement) +
            MODE_INDICATOR_BITS +
            CHARACTER_COUNT_INDICATOR[connectElement.mode][ccIndex];
        }
      }
      // if graph ends add end node
      graph[key] =
        segmentIndex === segments.length - 1 ? { [GRAPH_END_NODE]: 0 } : {};
    }
    keys = currentKeys;
  }

  const result = dijkstra({ ...graph, end: {} }, GRAPH_START_NODE);
  const path = getPath(result.previous, GRAPH_START_NODE, GRAPH_END_NODE);
  let data: Segments = [];

  // filter and merge similar modes
  for (let i = 0; i < path.length; i++) {
    const element = nodes[path[i]];
    const prevElement = nodes[path[i - 1]];
    if (prevElement && prevElement?.mode === element?.mode) {
      data[data.length - 1] = {
        value: data[data.length - 1].value + element.value,
        mode: element.mode,
      };
    } else if (element) {
      data.push(element);
    }
  }

  return data;
}
