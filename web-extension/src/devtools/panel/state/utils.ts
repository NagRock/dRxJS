import {Event, Instance} from './types';
import * as R from 'ramda';

const concatEvents = R.pipe(
  R.reduce<Event[], Event[]>(R.concat, []),
  R.sortBy((x: Event) => x.vtimestamp),
  R.uniqBy((x: Event) => x.vtimestamp),
);

export function getIncomingEvents(instance: Instance, showContextConnections: boolean): Event[] {
  const senders = showContextConnections
    ? [...instance.senders, ...instance.contextSenders]
    : instance.senders;

  return concatEvents([
    instance.events.filter((event) => event.receiver === instance && senders.includes(event.sender)),
    ...senders.map((x) => getIncomingEvents(x, showContextConnections)),
  ]);
}

export function getOutgoingEvents(instance: Instance, showContextConnections: boolean): Event[] {
  const receivers = showContextConnections
  ? [...instance.receivers, ...instance.contextReceivers]
    : instance.receivers;

  return concatEvents([
    instance.events.filter((event) => event.sender === instance && receivers.includes(event.receiver)),
    ...receivers.map((x) => getOutgoingEvents(x, showContextConnections)),
  ]);
}

export function getEvents(instance: Instance, showContextConnections: boolean): Event[] {
  return concatEvents([getIncomingEvents(instance, showContextConnections), getOutgoingEvents(instance, showContextConnections)]);
}
