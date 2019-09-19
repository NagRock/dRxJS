import {RxInspector} from './rx-inspector';
// @ts-ignore
import * as StackFrame from 'stackframe';
import * as StackTraceGPS from 'stacktrace-gps';

export interface RxSourceMappedInspectorEvent {
  originalEvent: OriginalEvent;
  position: {
    file: string;
    column: number;
    line: number;
    functionName: string;
  };
}

export interface RxInstanceInspectorEvent {
  originalEvent: OriginalEvent;
}

type OriginalEvent = any;

const notMappableEvents = [
  'instance',
  'subscribe',
  'next',
  'complete',
  'unsubscribe',
];

class RxInspectorBuffer {
  private eventsToMap: OriginalEvent[] = [];
  private currentMappingEvents: OriginalEvent[] = [];
  private mappedEvents: Array<RxSourceMappedInspectorEvent | RxInstanceInspectorEvent> = [];
  private readonly listener: (event: any) => void;
  private readonly gps: StackTraceGPS = new StackTraceGPS();

  constructor(private rxInspector: RxInspector) {
    this.listener = (event: any) => {
      this.eventsToMap.push(event);
      this.tryToMapNextEvents();
    };

    this.rxInspector.addListener(this.listener);
  }

  flush(): Array<RxSourceMappedInspectorEvent | RxInstanceInspectorEvent> {
    const returnVal = this.mappedEvents.slice();
    this.mappedEvents = [];
    return returnVal;
  }

  dispose(): void {
    // TODO: cancel current running mappings promises
    this.mappedEvents = [];
    this.eventsToMap = [];
    this.rxInspector.removeListener(this.listener);
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
      if (notMappableEvents.indexOf(toMap.kind) > -1) {
        mapPromises.push(Promise.resolve({originalEvent: toMap}));
      } else {
        const fileName = toMap.position.file;
        const lineNumber = toMap.position.line;
        const columnNumber = toMap.position.column;
        const sourceStackFrame = new (StackFrame as any)({fileName, lineNumber, columnNumber});

        mapPromises.push(
          new Promise((resolve, reject) => {
            this.gps.pinpoint(sourceStackFrame).then(stackFrame => {
              resolve({
                originalEvent: toMap,
                position: {
                  file: stackFrame.fileName,
                  column: stackFrame.columnNumber,
                  line: stackFrame.lineNumber,
                  functionName: stackFrame.functionName,
                }
              });
            });
          })
        );
      }
    }

    Promise.all(mapPromises).then(results => {
      this.mappedEvents = [...this.mappedEvents, ...results];
      this.currentMappingEvents = [];
      this.tryToMapNextEvents();
    });
  }
}

export function createRxInspectorBuffer(rxInspector: RxInspector): RxInspectorBuffer {
  return new RxInspectorBuffer(rxInspector);
}


