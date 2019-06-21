import {Data} from '../__instrument__/data';

export interface ValueEventModel {
  kind: 'value';
  id: number;
  timestamp: number;
  value: unknown;
  source: StreamModel;
  destination: StreamModel;
}

export interface SubscribeEventModel {
  kind: 'subscribe';
  id: number;
  timestamp: number;
  source: StreamModel;
  destination: StreamModel;
}

export interface UnsubscribeEventModel {
  kind: 'unsubscribe';
  id: number;
  timestamp: number;
  source: StreamModel;
  destination: StreamModel;
}

export type EventModel = ValueEventModel | SubscribeEventModel | UnsubscribeEventModel;

export interface StreamModel {
  id: number;
  location: {
    file: string,
    line: number,
    char: number,
  };
  expression: string;
  subscribers: StreamModel[];
  subscriptions: StreamModel[];
  events: EventModel[];
}

export interface Model {
  streams: StreamModel[];
  events: EventModel[];
}

export const getModel = (data: Data): Model => {
  let events: EventModel[];
  let streams: StreamModel[];
  events = data.events.map((e): EventModel => {
    let cachedSource: StreamModel;
    let cachedDestination: StreamModel;
    return Object.defineProperties({...e}, {
      source: {
        get: () => cachedSource ? cachedSource : cachedSource = streams[e.source]
      },
      destination: {
        get: () => cachedDestination ? cachedDestination : cachedDestination = streams[e.destination]
      },
    });
  });
  streams = data.streams.map((s): StreamModel => {
    let cachedSubscribers;
    let cachedSubscriptions;
    let cachedEvents;

    return Object.defineProperties({...s}, {
      subscribers: {
        get: () => cachedSubscribers ? cachedSubscribers : cachedSubscribers = s.subscribers.map((x) => streams[x])
      },
      subscriptions: {
        get: () => cachedSubscriptions ? cachedSubscriptions : cachedSubscriptions = s.subscriptions.map((x) => streams[x])
      },
      events: {
        get: () => cachedEvents ? cachedEvents : cachedEvents = s.events.map((x) => events[x])
      }
    });
  });
  return {streams, events};
};
