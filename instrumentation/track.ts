import {getNextDefinitionId, getNextInstanceId, getNextEventId, getNextTaskId} from './ids';
import {
  CompleteNotificationEvent,
  ConnectEvent,
  CreatorDefinitionEvent,
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
} from './dispatched-events';
import {rxInspector} from './rx-inspector';
import * as StackTrace from 'stacktrace-js';
import {createRxInspectorBuffer} from './rx-inspector-buffer';

// TODO: find better place for this init
const buffer = createRxInspectorBuffer(rxInspector);

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

  rxInspector.dispatch(event);

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

  rxInspector.dispatch(event);

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

  rxInspector.dispatch(event);

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

  rxInspector.dispatch(event);

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

  rxInspector.dispatch(event);

  return id;
}

export function trackUnknownDefinition() {
  const id = getNextDefinitionId();

  const event: UnknownDefinitionEvent = {
    kind: 'unknown-definition',
    id,
    position: unknownSourcePosition,
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackInstance(definition: number): number {
  const id = getNextInstanceId();

  const event: InstanceEvent = {
    kind: 'instance',
    definition,
    id,
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackSubscribe(sender: number, receiver: number) {
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
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackUnsubscribe(sender: number, receiver: number) {
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
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackNextNotification(sender: number, receiver: number, value: any) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: NextNotificationEvent = {
    kind: 'next',
    task,
    timestamp,
    sender,
    receiver,
    id,
    value,
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackErrorNotification(sender: number, receiver: number, error: any) {
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
    error,
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackCompleteNotification(sender: number, receiver: number) {
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
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackSubjectNext(subject: number, context: number, value: any) {
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
    value,
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackSubjectError(subject: number, context: number, error: any) {
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
    error,
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackSubjectComplete(subject: number, context: number) {
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
  };

  rxInspector.dispatch(event);

  return id;
}

export function trackConnect(connectable: number) {
  const id = getNextEventId();
  const task = getTask();
  const timestamp = Date.now();

  const event: ConnectEvent = {
    kind: 'connect',
    id,
    task,
    timestamp,
    connectable,
  };

  rxInspector.dispatch(event);

  return id;
}
