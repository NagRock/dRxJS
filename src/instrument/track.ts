import {getNextDefinitionId, getNextInstanceId, getNextNotificationId} from './ids';
import {
  Cause,
  CompleteNotificationEvent, CreatorDefinitionEvent,
  ErrorNotificationEvent,
  InstanceEvent,
  NextNotificationEvent,
  OperatorDefinitionEvent, SubscribeDefinitionEvent,
  SubscribeEvent,
  UnsubscribeEvent
} from './types';
import {rxInspector} from './rx-inspector';

export function trackCreatorDefinition(func: (...args: any[]) => any, args: any[]): number {
  const definition = getNextDefinitionId();

  const event: CreatorDefinitionEvent = {
    kind: 'creator-definition',
    definition,
    func,
    args,
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
  };

  rxInspector.dispatch(event);

  return definition;
}

export function trackSubscribeDefinition(next, error, complete) {
  const definition = getNextDefinitionId();

  const event: SubscribeDefinitionEvent = {
    kind: 'subscribe-definition',
    definition,
    next,
    error,
    complete
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

export function trackNextNotification(sender: number, receiver: number, value: any, cause: Cause) {
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

export function trackErrorNotification(sender: number, receiver: number, error: any, cause: Cause) {
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

export function trackCompleteNotification(sender: number, receiver: number, cause: Cause) {
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
