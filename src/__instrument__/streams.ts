import {data} from './data';

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
  subscriptions: number[];
  events: number[];
}

export function trackStreamData(expr, file, line, char) {
  const streamData: StreamData = {
    id: streamDataId++,
    expression: expr,
    location: {file, line, char},
    events: [],
    subscribers: [],
    subscriptions: [],
  };
  data.streams[streamData.id] = streamData;
  return streamData;
}
