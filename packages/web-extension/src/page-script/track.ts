import {getNextDefinitionId, getNextInstanceId, getNextEventId, getNextTaskId} from './ids';
import {
  CompleteNotificationEvent,
  ConnectEvent,
  CreatorDefinitionEvent, TrackEvent,
  ErrorNotificationEvent,
  InstanceEvent,
  NextNotificationEvent,
  OperatorDefinitionEvent,
  SourcePosition,
  SubjectCompleteEvent,
  SubjectDefinitionEvent,
  SubjectErrorEvent,
  SubjectNextEvent,
  SubscribeDefinitionEvent,
  SubscribeEvent, TaskEvent, UnknownDefinitionEvent,
  UnsubscribeEvent
} from './track-events';
import * as StackTrace from 'stacktrace-js';
import {SimpleSubject} from './simple-observables';

export const trackEvents = new SimpleSubject<TrackEvent>();

const unknownSourcePosition: SourcePosition = {
  file: 'unknown',
  line: 0,
  column: 0,
};

export function getSourcePosition(stackTraceOffset: number): SourcePosition {
  const stackFrame = StackTrace.getSync({offline: true})[stackTraceOffset + 1];

  return {
    file: stackFrame.fileName,
    line: stackFrame.lineNumber,
    column: stackFrame.columnNumber,
  };
}

const Zone = (window as any).Zone as any;

let lastTask: any;
let lastTaskId: number;

export function getTask() {
  if (lastTask === Zone.currentTask) {
    return lastTaskId;
  } else {
    lastTask = Zone.currentTask;
    lastTaskId = trackTask(lastTask);
    return lastTaskId;
  }
}

export function trackTask(task): number {
  const id = getNextTaskId();

  const event: TaskEvent = {
    kind: 'task',
    id,
    type: task.type,
    source: task.source,
  };

  trackEvents.next(event);

  return id;
}

export function trackCreatorDefinition(func: (...args: any[]) => any, args: any[]): number {
  const id = getNextDefinitionId();

  const event: CreatorDefinitionEvent = {
    kind: 'creator-definition',
    id,
    function: func,
    args,
    position: getSourcePosition(2),
  };

  trackEvents.next(event);

  return id;
}

export function trackOperatorDefinition(func: (...args: any[]) => any, args: any[]): number {
  const id = getNextDefinitionId();

  const event: OperatorDefinitionEvent = {
    kind: 'operator-definition',
    id,
    function: func,
    args,
    position: getSourcePosition(2),
  };

  trackEvents.next(event);

  return id;
}

export function trackSubscribeDefinition(args: any[]) {
  const id = getNextDefinitionId();

  const event: SubscribeDefinitionEvent = {
    kind: 'subscribe-definition',
    id,
    args,
    position: getSourcePosition(3),
  };

  trackEvents.next(event);

  return id;
}

export function trackSubjectDefinition(constructor: any, args: any[]) {
  const id = getNextDefinitionId();

  const event: SubjectDefinitionEvent = {
    kind: 'subject-definition',
    constructor,
    args,
    id,
    position: getSourcePosition(2),
  };

  trackEvents.next(event);

  return id;
}

export function trackUnknownDefinition() {
  const id = getNextDefinitionId();

  const event: UnknownDefinitionEvent = {
    kind: 'unknown-definition',
    id,
    position: unknownSourcePosition,
  };

  trackEvents.next(event);

  return id;
}

export function trackInstance(definition: number): number {
  const id = getNextInstanceId();

  const event: InstanceEvent = {
    kind: 'instance',
    definition,
    id,
  };

  trackEvents.next(event);

  return id;
}

export function trackSubscribe(sender: number, receiver: number, trigger: number | undefined) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: SubscribeEvent = {
    kind: 'subscribe',
    id,
    task,
    timestamp,
    sender,
    receiver,
    trigger,
  };

  trackEvents.next(event);

  return id;
}

export function trackUnsubscribe(sender: number, receiver: number, trigger: number | undefined) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: UnsubscribeEvent = {
    kind: 'unsubscribe',
    id,
    task,
    timestamp,
    sender,
    receiver,
    trigger,
  };

  trackEvents.next(event);

  return id;
}

export function trackNextNotification(sender: number, receiver: number, trigger: number | undefined, value: any) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: NextNotificationEvent = {
    kind: 'next',
    task,
    timestamp,
    sender,
    receiver,
    trigger,
    id,
    value,
  };

  trackEvents.next(event);

  return id;
}

export function trackErrorNotification(sender: number, receiver: number, trigger: number | undefined, error: any) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: ErrorNotificationEvent = {
    kind: 'error',
    id,
    task,
    timestamp,
    sender,
    receiver,
    trigger,
    error,
  };

  trackEvents.next(event);

  return id;
}

export function trackCompleteNotification(sender: number, receiver: number, trigger: number | undefined) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: CompleteNotificationEvent = {
    kind: 'complete',
    id,
    task,
    timestamp,
    sender,
    receiver,
    trigger,
  };

  trackEvents.next(event);

  return id;
}

export function trackSubjectNext(subject: number, context: number, trigger: number | undefined, value: any) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: SubjectNextEvent = {
    kind: 'subject-next',
    id,
    task,
    timestamp,
    subject,
    context,
    trigger,
    value,
  };

  trackEvents.next(event);

  return id;
}

export function trackSubjectError(subject: number, context: number, trigger: number | undefined, error: any) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: SubjectErrorEvent = {
    kind: 'subject-error',
    id,
    task,
    timestamp,
    subject,
    context,
    trigger,
    error,
  };

  trackEvents.next(event);

  return id;
}

export function trackSubjectComplete(subject: number, context: number, trigger: number | undefined) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: SubjectCompleteEvent = {
    kind: 'subject-complete',
    id,
    task,
    timestamp,
    subject,
    context,
    trigger,
  };

  trackEvents.next(event);

  return id;
}

export function trackConnect(connectable: number, trigger: number | undefined) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: ConnectEvent = {
    kind: 'connect',
    id,
    task,
    timestamp,
    connectable,
    trigger,
  };

  trackEvents.next(event);

  return id;
}
