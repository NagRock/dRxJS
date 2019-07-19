import {Event, Instance} from './types';

export function getIncomingEvents(instance: Instance): Event[] {
  return [].concat(instance.events, ...instance.senders.map(getIncomingEvents)).sort((a, b) => a.time - b.time);
}

export function getOutgoingEvents(instance: Instance): Event[] {
  return [].concat(instance.events, ...instance.receivers.map(getOutgoingEvents)).sort((a, b) => a.time - b.time);
}

export function getEvents(instance: Instance): Event[] {
  return [...getIncomingEvents(instance), ...getOutgoingEvents(instance)].sort((a, b) => a.time - b.time);
}
