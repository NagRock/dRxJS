// @ts-ignore
import * as StackFrame from 'stackframe';
import * as StackTraceGPS from 'stacktrace-gps';
import {createRefsStorage, RefsStorage} from './refs-storage';
import * as DispatchedEvents from './dispatched-events';
import * as Events from '@drxjs/events';

const unknownPosition = {
  functionName: 'unknown',
  file: 'unknown',
  line: 0,
  column: 0,
};

export class EventsMapper {

  constructor(
    private readonly refsStorage: RefsStorage,
    private readonly gps: StackTraceGPS,
  ) {
  }

  async map(event: DispatchedEvents.DispatchedEvent): Promise<Events.Event> {
    if (DispatchedEvents.isDefinitionEvent(event)) {
      const {file: fileName, line: lineNumber, column: columnNumber} = event.position;
      let position: Events.SourcePosition;
      if (fileName === 'unknown') {
        position = unknownPosition;
      } else {
        try {
          const sourceStackFrame = new (StackFrame as any)({fileName, lineNumber, columnNumber});
          const stackFrame = await this.gps.pinpoint(sourceStackFrame);
          const {fileName: file, lineNumber: line, columnNumber: column, functionName} = stackFrame;
          position = {file, line, column, functionName};
        } catch (e) {
          position = unknownPosition;
        }
      }
      switch (event.kind) {
        case 'creator-definition':
          return {
            kind: 'creator-definition',
            definition: event.definition,
            function: this.refsStorage.create(event.func),
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'operator-definition':
          return {
            kind: 'operator-definition',
            definition: event.definition,
            function: this.refsStorage.create(event.func),
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'subject-definition':
          return {
            kind: 'subject-definition',
            definition: event.definition,
            constructor: this.refsStorage.create(event.constructor),
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'subscribe-definition':
          return {
            kind: 'subscribe-definition',
            definition: event.definition,
            next: this.refsStorage.create(event.next),
            error: this.refsStorage.create(event.error),
            complete: this.refsStorage.create(event.complete),
            position,
          };
        case 'unknown-definition':
          return {
            kind: 'unknown-definition',
            definition: event.definition,
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
            value: this.refsStorage.create(event.value),
          };
        case 'error':
          return {
            kind: 'error',
            sender: event.sender,
            receiver: event.receiver,
            notification: event.notification,
            error: this.refsStorage.create(event.error),
          };
        case 'subject-next':
          return {
            kind: 'subject-next',
            subject: event.subject,
            context: event.context,
            value: this.refsStorage.create(event.value),
          };
        case 'subject-error':
          return {
            kind: 'subject-error',
            subject: event.subject,
            context: event.context,
            error: this.refsStorage.create(event.error),
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

