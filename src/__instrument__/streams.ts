import {data} from "./data";

let streamDataId = 0;

export interface StreamData {
  id: number;
  location: {
    file: string,
    line: number,
    char: number,
  };
  expression: string;
  subscribers: number[];
  values: number[];
}

export function trackStreamData(expr, file, line, char, subscribers: number[]) {
  const streamData = {
    id: streamDataId++,
    expression: expr,
    location: {file, line, char},
    values: [],
    subscribers,
  };
  data.streams[streamData.id] = streamData;
  return streamData;
}
