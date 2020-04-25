import {getNextDeclarationId, getNextInstanceId, getNextEventId, getNextTaskId, getNextObservableId} from './ids';
import {
  CompleteNotificationEvent,
  ConnectEvent,
  TrackEvent,
  ErrorNotificationEvent,
  InstanceEvent,
  NextNotificationEvent,
  SourcePosition,
  SubjectCompleteEvent,
  SubjectErrorEvent,
  SubjectNextEvent,
  SubscribeEvent,
  TaskEvent,
  UnsubscribeEvent,
  ConstructorDeclarationEvent,
  OperatorDeclarationEvent,
  ObservableFromConstructorEvent,
  ObservableFromOperatorEvent,
  SubscribeDeclarationEvent, ObservableFromSubscribeEvent
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
// TODO: bottleneck: new Error().stack
  const stackFrame = StackTrace.getSync({offline: true})[stackTraceOffset + 1];

  return {
    file: stackFrame.fileName,
    line: stackFrame.lineNumber,
    column: stackFrame.columnNumber,
  };
}

let lastTask: any;
let lastTaskId: number;

export function getTask() {
  if (lastTask === (window as any).Zone.currentTask) {
    return lastTaskId;
  } else {
    lastTask = (window as any).Zone.currentTask;
    lastTaskId = trackTask(lastTask);
    return lastTaskId;
  }
}

export function trackTask(task): number {
  const id = getNextTaskId();

  const event: TaskEvent = {
    kind: 'task',
    id,
    type: task ? task.type : 'unknown',
    source: task ? task.source : 'unknown',
  };

  trackEvents.next(event);

  return id;
}

export function trackConstructorDeclaration(ctor: any, args: any[]): number {
  const id = getNextDeclarationId();

  const event: ConstructorDeclarationEvent = {
    kind: 'constructor-declaration',
    id,
    ctor,
    args,
    position: getSourcePosition(2),
  };

  trackEvents.next(event);

  return id;
}

export function trackObservableFromConstructor(constructor: number): number {
  const id = getNextObservableId();

  const event: ObservableFromConstructorEvent = {
    kind: 'observable-from-constructor',
    id,
    constructor,
  };

  trackEvents.next(event);

  return id;
}

export function trackOperatorDeclaration(func: (...args: any[]) => any, args: any[]): number {
  const id = getNextDeclarationId();

  const event: OperatorDeclarationEvent = {
    kind: 'operator-declaration',
    id,
    func,
    args,
    position: getSourcePosition(2),
  };

  trackEvents.next(event);

  return id;
}

export function trackObservableFromOperator(operator: number, source: number): number {
  const id = getNextObservableId();

  const event: ObservableFromOperatorEvent = {
    kind: 'observable-from-operator',
    id,
    operator,
    source,
  };

  trackEvents.next(event);

  return id;
}

export function trackSubscribeDeclaration(args: any[]) {
  const id = getNextDeclarationId();

  const event: SubscribeDeclarationEvent = {
    kind: 'subscribe-declaration',
    id,
    args,
    position: getSourcePosition(3),
  };

  trackEvents.next(event);

  return id;
}

export function trackObservableFromSubscribe(subscribe: number, source: number) {
  const id = getNextObservableId();

  const event: ObservableFromSubscribeEvent = {
    kind: 'observable-from-subscribe',
    id,
    subscribe,
    source,
  };

  trackEvents.next(event);

  return id;
}

export function trackInstance(observable: number): number {
  const id = getNextInstanceId();

  const event: InstanceEvent = {
    kind: 'instance',
    observable,
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
