import {StreamData} from './streams';
import {EventData} from './events';

export interface Data {
  streams: StreamData[];
  events: EventData[];
}

export const data: Data = (window as any).__data__ = {
  streams: [],
  events: [],
};
