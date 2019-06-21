import {data} from './data';
import {StreamData} from './streams';

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


export function trackValueEventData(value, source: StreamData, destination: StreamData) {
  const eventData: ValueEventData = {
    kind: 'value',
    id: eventDataId++,
    timestamp: Date.now(),
    value,
    source: source.id,
    destination: destination.id,
  };
  data.events[eventData.id] = eventData;
  source.events.push(eventData.id);
  return eventData;
}

export function trackSubscribeEventData(source: StreamData, destination: StreamData) {
  const eventData: SubscribeEventData = {
    kind: 'subscribe',
    id: eventDataId++,
    timestamp: Date.now(),
    source: source.id,
    destination: destination.id,
  };
  data.events[eventData.id] = eventData;
  source.subscribers.push(destination.id);
  destination.subscriptions.push(source.id);
  return eventData;
}

export function trackUnsubscribeEventData(source: StreamData, destination: StreamData) {
  const eventData: UnsubscribeEventData = {
    kind: 'unsubscribe',
    id: eventDataId++,
    timestamp: Date.now(),
    source: source.id,
    destination: destination.id,
  };
  data.events[eventData.id] = eventData;
  source.events.push(eventData.id);
  return eventData;
}
