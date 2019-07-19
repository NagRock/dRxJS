import * as rx from 'instrumented-rxjs';

export interface Observable {}
export type OperatorFunction = rx.UnaryFunction<Observable, Observable>;

export interface ObserverWithDestination extends rx.Observer<any> {
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

export interface CreatorDefinitionEvent {
  kind: 'creator-definition';
  definition: number;
  func: (...args: any[]) => Observable;
  args: any[];
}

export interface OperatorDefinitionEvent {
  kind: 'operator-definition';
  definition: number;
  func: (...args: any[]) => OperatorFunction;
  args: any[];
}

export interface SubscribeDefinitionEvent {
  kind: 'subscribe-definition';
  definition: number;
  next: (value) => void;
  error: (error) => void;
  complete: () => void;
}

export interface InstanceEvent {
  kind: 'instance';
  definition: number;
  instance: number;
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
  kind: 'next';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
  value: any;
}

export interface ErrorNotificationEvent {
  kind: 'error';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
  error: any;
}

export interface CompleteNotificationEvent {
  kind: 'complete';
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
  = CreatorDefinitionEvent
  | OperatorDefinitionEvent
  | SubscribeDefinitionEvent
  | InstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NotificationEvent;
