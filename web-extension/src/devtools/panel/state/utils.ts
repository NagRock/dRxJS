import {Event, Instance} from './types';
import * as R from 'ramda';

const concatEvents = R.pipe(
  R.reduce<Event[], Event[]>(R.concat, []),
  R.sortBy((x: Event) => x.time),
  R.uniqBy((x: Event) => x.time),
);

export function getIncomingEvents(instance: Instance): Event[] {
  console.log('getIncomingEvents', instance);
  return concatEvents([
    instance.events.filter((event) => event.receiver === instance),
    ...instance.senders.map(getIncomingEvents),
  ]);
}

export function getOutgoingEvents(instance: Instance): Event[] {
  return concatEvents([
    instance.events.filter((event) => event.sender === instance),
    ...instance.receivers.map(getOutgoingEvents),
  ]);
}

export function getEvents(instance: Instance): Event[] {
  return concatEvents([getIncomingEvents(instance), getOutgoingEvents(instance)]);
}
