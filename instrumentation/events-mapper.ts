import * as StackFrame from 'stackframe';
// @ts-ignore
import * as StackTraceGPS from 'stacktrace-gps';
import {createRefsStorage, RefsStorage} from './refs-storage';
import * as DispatchedEvents from './dispatched-events';
import * as Events from '@drxjs/events';

export class EventsMapper {

  constructor(
    private readonly refsStorage: RefsStorage,
    private readonly gps: StackTraceGPS,
  ) {
  }

  async map(event: DispatchedEvents.DispatchedEvent): Promise<Events.Event> {
    if (DispatchedEvents.isDefinitionEvent(event)) {
      const {file: fileName, line: lineNumber, column: columnNumber} = event.position;
      const sourceStackFrame = new (StackFrame as any)({fileName, lineNumber, columnNumber});
      const stackFrame = await this.gps.pinpoint(sourceStackFrame);
      const {fileName: file, lineNumber: line, columnNumber: column, functionName} = stackFrame;
      const position: Events.SourcePosition = {file, line, column, functionName};
      switch (event.kind) {
        case 'creator-definition':
          return {
            kind: 'creator-definition',
            definition: event.definition,
            functionName: (event.func as any).name,
            functionRef: this.refsStorage.store(event.func),
            argsRefs: event.args.map((arg) => this.refsStorage.store(arg)),
            position,
          };
        case 'operator-definition':
          return {
            kind: 'operator-definition',
            definition: event.definition,
            functionName: (event.func as any).name,
            functionRef: this.refsStorage.store(event.func),
            argsRefs: event.args.map((arg) => this.refsStorage.store(arg)),
            position,
          };
        case 'subject-definition':
          return {
            kind: 'subject-definition',
            definition: event.definition,
            constructorName: (event.constructor as any).name,
            constructorRef: this.refsStorage.store(event.constructor),
            argsRefs: event.args.map((arg) => this.refsStorage.store(arg)),
            position,
          };
        case 'subscribe-definition':
          return {
            kind: 'subscribe-definition',
            definition: event.definition,
            nextName: event.next ? (event.next as any).name : undefined,
            nextRef: event.next ? this.refsStorage.store(event.next) : undefined,
            errorName: event.error ? (event.error as any).name : undefined,
            errorRef: event.error ? this.refsStorage.store(event.error) : undefined,
            completeName: event.complete ? (event.complete as any).name : undefined,
            completeRef: event.complete ? this.refsStorage.store(event.complete) : undefined,
            position,
          };
      }
    } else {
      switch (event.kind) {
        case 'next':
          return {
            kind: 'next',
            sender: event.sender,
            receiver: event.receiver,
            notification: event.notification,
            valueRef: this.refsStorage.store(event.value),
          };
        case 'error':
          return {
            kind: 'error',
            sender: event.sender,
            receiver: event.receiver,
            notification: event.notification,
            errorRef: this.refsStorage.store(event.error),
          };
        case 'subject-next':
          return {
            kind: 'subject-next',
            subject: event.subject,
            valueRef: this.refsStorage.store(event.value),
          };
        case 'subject-error':
          return {
            kind: 'subject-error',
            subject: event.subject,
            errorRef: this.refsStorage.store(event.error),
          };
        case 'connect':
        case 'instance':
        case 'subscribe':
        case 'unsubscribe':
        case 'complete':
        case 'subject-complete':
          return event;
      }
    }
  }
}

export function createEventsMapper() {
  return new EventsMapper(createRefsStorage(), new StackTraceGPS);
}

