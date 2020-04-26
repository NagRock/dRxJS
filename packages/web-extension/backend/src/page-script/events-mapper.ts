// @ts-ignore
import * as StackFrame from 'stackframe';
import * as StackTraceGPS from 'stacktrace-gps';
import {RefsStorage} from './refs-storage';
import * as DispatchedEvents from './track-events';
import * as Events from '@doctor-rxjs/events';

const unknownPosition = {
  functionName: 'unknown',
  file: 'unknown',
  line: 0,
  column: 0,
};

export class EventsMapper {


  private readonly cache = new Map<string, any>();

  constructor(
    private readonly refsStorage: RefsStorage,
    private readonly gps: StackTraceGPS,
  ) {
  }

  async map(event: DispatchedEvents.TrackEvent): Promise<Events.MessageEvent> {
    if (DispatchedEvents.isDeclarationEvent(event)) {
      const {file: fileName, line: lineNumber, column: columnNumber} = event.position;
      const cacheKey = `${fileName}:${lineNumber}:${columnNumber}`;

      let position: Events.SourcePosition;
      if (this.cache.has(cacheKey)) {
        position = this.cache.get(cacheKey);
      } else {
        try {
          const sourceStackFrame = new (StackFrame as any)({fileName, lineNumber, columnNumber});
          const stackFrame = await this.gps.pinpoint(sourceStackFrame);
          const {fileName: file, lineNumber: line, columnNumber: column, functionName} = stackFrame;
          position = {file, line, column, functionName};
        } catch (e) {
          position = unknownPosition;
        }
        this.cache.set(cacheKey, position);
      }
      switch (event.kind) {
        case 'constructor-declaration':
          return {
            kind: 'constructor-declaration',
            id: event.id,
            ctor: this.refsStorage.create(event.ctor),
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'operator-declaration':
          return {
            kind: 'operator-declaration',
            id: event.id,
            func: this.refsStorage.create(event.func),
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'subscribe-declaration':
          return {
            kind: 'subscribe-declaration',
            id: event.id,
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
      }
    } else {
      switch (event.kind) {
        case 'next':
          return {
            kind: 'next',
            id: event.id,
            task: event.task,
            timestamp: event.timestamp,
            sender: event.sender,
            receiver: event.receiver,
            trigger: event.trigger,
            value: this.refsStorage.create(event.value),
          };
        case 'error':
          return {
            kind: 'error',
            id: event.id,
            task: event.task,
            timestamp: event.timestamp,
            sender: event.sender,
            receiver: event.receiver,
            trigger: event.trigger,
            error: this.refsStorage.create(event.error),
          };
        case 'subject-next':
          return {
            kind: 'subject-next',
            id: event.id,
            task: event.task,
            timestamp: event.timestamp,
            subject: event.subject,
            context: event.context,
            trigger: event.trigger,
            value: this.refsStorage.create(event.value),
          };
        case 'subject-error':
          return {
            kind: 'subject-error',
            id: event.id,
            task: event.task,
            timestamp: event.timestamp,
            subject: event.subject,
            context: event.context,
            trigger: event.trigger,
            error: this.refsStorage.create(event.error),
          };
        default:
          return event;
      }
    }
  }
}

export function createEventsMapper(refs: RefsStorage) {
  return new EventsMapper(refs, new StackTraceGPS);
}

