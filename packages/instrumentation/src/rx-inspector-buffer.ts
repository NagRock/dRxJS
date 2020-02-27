import {rxInspector, RxInspector} from './rx-inspector';
import {createEventsMapper, EventsMapper} from './events-mapper';
import {Event} from '@doctor-rxjs/events';
import {DispatchedEvent} from './dispatched-events';

class RxInspectorBuffer {
  private eventsToMap: DispatchedEvent[] = [];
  private currentMappingEvents: DispatchedEvent[] = [];
  private mappedEvents: Array<Event> = [];
  private readonly listener: (event: any) => void;

  constructor(private rxInspectorInst: RxInspector, private eventsMapper: EventsMapper) {
    this.listener = (event: any) => {
      this.eventsToMap.push(event);
      this.tryToMapNextEvents();
    };

    this.rxInspectorInst.addListener(this.listener);
  }

  flush(): Array<Event> {
    const returnVal = this.mappedEvents.slice();
    this.mappedEvents = [];
    // console.log('flush', returnVal);
    return returnVal;
  }

  dispose(): void {
    // TODO: cancel current running mappings promises
    this.mappedEvents = [];
    this.eventsToMap = [];
    this.rxInspectorInst.removeListener(this.listener);
  }

  private tryToMapNextEvents() {
    if (this.currentMappingEvents.length > 0 || this.eventsToMap.length === 0) {
      return;
    }

    const maxElementsToProcessAtOnce = 10;
    let elementsCount = 0;
    while (elementsCount < maxElementsToProcessAtOnce && this.eventsToMap.length > 0) {
      this.currentMappingEvents.push(this.eventsToMap.shift());
      elementsCount++;
    }

    const mapPromises = [];

    for (const toMap of this.currentMappingEvents) {
      mapPromises.push(this.eventsMapper.map(toMap));
    }

    Promise.all(mapPromises).then(results => {
      this.mappedEvents = [...this.mappedEvents, ...results];
      this.currentMappingEvents = [];
      this.tryToMapNextEvents();
    });
  }
}


export function createRxInspectorBuffer(rxInspectorInst: RxInspector): RxInspectorBuffer {
  return new RxInspectorBuffer(rxInspectorInst, createEventsMapper());
}

const rxInspectorBuffer = createRxInspectorBuffer(rxInspector);

(window as any).___dRxJS_flushBuffer = () => rxInspectorBuffer.flush();

