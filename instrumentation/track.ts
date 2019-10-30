import {getNextDefinitionId, getNextInstanceId, getNextNotificationId} from './ids';
import {
  Cause,
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
  SubscribeEvent, UnknownDefinitionEvent,
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

export function trackCreatorDefinition(func: (...args: any[]) => any, args: any[]): number {
  const definition = getNextDefinitionId();

  const event: CreatorDefinitionEvent = {
    kind: 'creator-definition',
    definition,
    func,
    args,
    position: getSourcePosition(2),
  };

  rxInspector.dispatch(event);

  return definition;
}

export function trackOperatorDefinition(func: (...args: any[]) => any, args: any[]): number {
  const definition = getNextDefinitionId();

  const event: OperatorDefinitionEvent = {
    kind: 'operator-definition',
    definition,
    func,
    args,
    position: getSourcePosition(2),
  };

  rxInspector.dispatch(event);

  return definition;
}

export function trackSubscribeDefinition(args: any[]) {
  const definition = getNextDefinitionId();

  const event: SubscribeDefinitionEvent = {
    kind: 'subscribe-definition',
    definition,
    args,
    position: getSourcePosition(3),
  };

  rxInspector.dispatch(event);

  return definition;
}

export function trackSubjectDefinition(constructor: any, args: any[]) {
  const definition = getNextDefinitionId();

  const event: SubjectDefinitionEvent = {
    kind: 'subject-definition',
    constructor,
    args,
    definition,
    position: getSourcePosition(2),
  };

  rxInspector.dispatch(event);

  return definition;
}

export function trackUnknownDefinition() {
  const definition = getNextDefinitionId();

  const event: UnknownDefinitionEvent = {
    kind: 'unknown-definition',
    definition,
    position: unknownSourcePosition,
  };

  rxInspector.dispatch(event);

  return definition;
}

export function trackInstance(definition: number): number {
  const instance = getNextInstanceId();

  const event: InstanceEvent = {
    kind: 'instance',
    definition,
    instance,
  };

  rxInspector.dispatch(event);

  return instance;
}

export function trackSubscribe(sender: number, receiver: number): void {
  const event: SubscribeEvent = {
    kind: 'subscribe',
    sender,
    receiver,
  };

  rxInspector.dispatch(event);
}

export function trackUnsubscribe(sender: number, receiver: number): void {
  const event: UnsubscribeEvent = {
    kind: 'unsubscribe',
    sender,
    receiver,
  };

  rxInspector.dispatch(event);
}

export function trackNextNotification(sender: number, receiver: number, value: any, cause?: Cause) {
  const notification = getNextNotificationId();

  const event: NextNotificationEvent = {
    kind: 'next',
    sender,
    receiver,
    notification,
    cause,
    value,
  };

  rxInspector.dispatch(event);

  return notification;
}

export function trackErrorNotification(sender: number, receiver: number, error: any, cause?: Cause) {
  const notification = getNextNotificationId();

  const event: ErrorNotificationEvent = {
    kind: 'error',
    sender,
    receiver,
    notification,
    cause,
    error,
  };

  rxInspector.dispatch(event);

  return notification;
}

export function trackCompleteNotification(sender: number, receiver: number, cause?: Cause) {
  const notification = getNextNotificationId();

  const event: CompleteNotificationEvent = {
    kind: 'complete',
    sender,
    receiver,
    notification,
    cause,
  };

  rxInspector.dispatch(event);

  return notification;
}

export function getCause(notification: number, kind: 'sync' | 'async' = 'sync'): Cause {
  return {
    kind,
    notification,
  };
}

export function trackSubjectNext(subject: number, context: number, value: any) {
  const event: SubjectNextEvent = {
    kind: 'subject-next',
    subject,
    context,
    value,
  };

  rxInspector.dispatch(event);
}

export function trackSubjectError(subject: number, context: number, error: any) {
  const event: SubjectErrorEvent = {
    kind: 'subject-error',
    subject,
    context,
    error,
  };

  rxInspector.dispatch(event);
}

export function trackSubjectComplete(subject: number, context: number) {
  const event: SubjectCompleteEvent = {
    kind: 'subject-complete',
    subject,
    context,
  };

  rxInspector.dispatch(event);
}

export function trackConnect(connectable: number) {
  const event: ConnectEvent = {
    kind: 'connect',
    connectable,
  };

  rxInspector.dispatch(event);
}
