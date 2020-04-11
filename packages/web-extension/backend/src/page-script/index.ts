import {createRefsStorage} from './refs-storage';
import {createEventsMapper} from './events-mapper';
import {MessageEvent} from '@doctor-rxjs/events';
import {trackEvents} from './track';
import {asyncMap, runInRootZone} from './simple-observables';
import {instrumentRxJS} from './instrument';

const refs = createRefsStorage();
const mapper = createEventsMapper(refs);
let messageEvents: MessageEvent[] = [];

trackEvents
  .pipe(runInRootZone())
  .pipe(asyncMap((trackEvent) => mapper.map(trackEvent)))
  .subscribe((messageEvent) => {
    messageEvents.push(messageEvent);
    // document.dispatchEvent(new Event('doctor-rxjs:new-message')); // todo: look out for NgZone
  });


export const instrument = (rxjs, rxjsOperators) => {
  instrumentRxJS(rxjs, rxjsOperators);
  document.dispatchEvent(new Event('doctor-rxjs:instrumented'));
};

export const getEvents = () => {
  const ret = messageEvents;
  messageEvents = [];
  return ret;
};

export const getRef = (ref: number) => {
  return refs.get(ref);
};

export const getRefLazyProperty = (ref: number, property: string) => {
  return refs.getLazyProperty(ref, property);
};
