import {Observer, OperatorFunction} from 'instrumented-rxjs';

export interface ObserverWithDestination extends Observer<any> {
  destination: ObserverWithDestination;
}

export interface Receiver extends ObserverWithDestination {
  __receiver_id__: number;

  __set_last_received_notification_id__(notificationId: number): void;
}

export interface Sender extends ObserverWithDestination {
  __sender_id__: number;
}

export interface Cause {
  kind: 'sync' | 'async';
  notification: number;
}

export interface OperatorDefinitionEvent {
  kind: 'operator-definition';
  definition: number;
  func: (...args: any[]) => OperatorFunction<any, any>;
  args: any[];
}

export interface OperatorInstanceEvent {
  kind: 'operator-instance';
  definition: number;
  instance: number;
}

export interface SubscribeInstanceEvent {
  kind: 'subscribe-instance';
  instance: number;
  // todo: extract definition?
  next: (value) => void;
  error: (error) => void;
  complete: () => void;
}


export interface SubscribeEvent {
  kind: 'subscribe';
  sender: number;
  receiver: number;
}

export interface UnsubscribeEvent {
  kind: 'unsubscribe';
  sender: number;
  receiver: number;
}

export interface NextNotificationEvent {
  kind: 'notification:next';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
  value: any;
}

export interface ErrorNotificationEvent {
  kind: 'notification:error';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
  error: any;
}

export interface CompleteNotificationEvent {
  kind: 'notification:complete';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
}

export type NotificationEvent
  = NextNotificationEvent
  | ErrorNotificationEvent
  | CompleteNotificationEvent;

export type Event
  = OperatorDefinitionEvent
  | OperatorInstanceEvent
  | SubscribeInstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NotificationEvent;
