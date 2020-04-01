// @ts-ignore
import * as StackFrame from 'stackframe';
import * as StackTraceGPS from 'stacktrace-gps';
import {createRefsStorage, RefsStorage} from './refs-storage';
import * as DispatchedEvents from './track-events';
import * as Events from '@doctor-rxjs/events';

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

  async map(event: DispatchedEvents.TrackEvent): Promise<Events.MessageEvent> {
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
            id: event.id,
            function: this.refsStorage.create(event.function),
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'operator-definition':
          return {
            kind: 'operator-definition',
            id: event.id,
            function: this.refsStorage.create(event.function),
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'subject-definition':
          return {
            kind: 'subject-definition',
            id: event.id,
            constructor: this.refsStorage.create(event.constructor),
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'subscribe-definition':
          return {
            kind: 'subscribe-definition',
            id: event.id,
            args: event.args.map((arg) => this.refsStorage.create(arg)),
            position,
          };
        case 'unknown-definition':
          return {
            kind: 'unknown-definition',
            id: event.id,
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
            error: this.refsStorage.create(event.error),
          };
        case 'task':
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

export function createEventsMapper(refs: RefsStorage) {
  return new EventsMapper(refs, new StackTraceGPS);
}

