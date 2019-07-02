import {EventModel, StreamModel} from './model';

export function getIncomingEvents(stream: StreamModel): EventModel[] {
  return [
    ...stream.events,
    ...stream.subscriptions.map((s) => getIncomingEvents(s)).reduce((result, x) => result.concat(...x), [])
  ];
}

export function getOutgoingEvents(stream: StreamModel): EventModel[] {
  return [
    ...stream.events,
    ...stream.subscribers.map((s) => getOutgoingEvents(s)).reduce((result, x) => result.concat(...x), [])
  ];
}

export function getEvents(stream: StreamModel): EventModel[] {
  if (stream === undefined) {
    return [];
  } else {
    const events: EventModel[] = [...getIncomingEvents(stream), ...getOutgoingEvents(stream)];
    return events
      .sort((a, b) => a.id - b.id)
      .filter((item, i, arr) => !i || item.id !== arr[i - 1].id);
  }
}
