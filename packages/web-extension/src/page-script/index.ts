import {createRefsStorage} from './refs-storage';
import {createEventsMapper} from './events-mapper';
import {MessageEvent} from '@doctor-rxjs/events';
import {trackEvents} from './track';
import {asyncMap, runInRootZone} from './simple-observables';
import {instrument} from './instrument';

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

(window as any).__doctor_rxjs__ = {
  instrument: (rxjs, rxjsOperators) => {
    instrument(rxjs, rxjsOperators);
    document.dispatchEvent(new Event('doctor-rxjs:instrumented'));
  },
  getEvents: () => {
    const ret = messageEvents;
    messageEvents = [];
    return ret;
  },
  getRef: (ref: number) => {
    return refs.get(ref);
  },
  getRefLazyProperty: (ref: number, property: string) => {
    return refs.getLazyProperty(ref, property);
  },
};
