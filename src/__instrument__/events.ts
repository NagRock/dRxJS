import {data} from './data';

let eventDataId = 0;

export interface ValueEventData {
  kind: 'value';
  id: number;
  timestamp: number;
  value: unknown;
  source: number;
  destination: number;
}

export interface SubscribeEventData {
  kind: 'subscribe';
  id: number;
  timestamp: number;
  source: number;
  destination: number;
}

export interface UnsubscribeEventData {
  kind: 'unsubscribe';
  id: number;
  timestamp: number;
  source: number;
  destination: number;
}

export type EventData = ValueEventData | SubscribeEventData | UnsubscribeEventData;


export function trackValueEventData(value, source, destination) {
  const eventData: ValueEventData = {
    kind: 'value',
    id: eventDataId++,
    timestamp: Date.now(),
    value,
    source,
    destination,
  };
  data.events[eventData.id] = eventData;
  return eventData;
}

export function trackSubscribeEventData(source, destination) {
  const eventData: SubscribeEventData = {
    kind: 'subscribe',
    id: eventDataId++,
    timestamp: Date.now(),
    source,
    destination,
  };
  data.events[eventData.id] = eventData;
  return eventData;
}

export function trackUnsubscribeEventData(source, destination) {
  const eventData: UnsubscribeEventData = {
    kind: 'unsubscribe',
    id: eventDataId++,
    timestamp: Date.now(),
    source,
    destination,
  };
  data.events[eventData.id] = eventData;
  return eventData;
}
