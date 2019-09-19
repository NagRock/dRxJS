import * as rx from 'instrumented-rxjs';

export interface Observable {
}

export type OperatorFunction = rx.UnaryFunction<Observable, Observable>;

export interface ObserverWithDestination extends rx.Observer<any> {
  destination: ObserverWithDestination;
}

export interface SourcePosition {
  file: string;
  line: number;
  column: number;
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
  position: SourcePosition;
}

export interface OperatorDefinitionEvent {
  kind: 'operator-definition';
  definition: number;
  func: (...args: any[]) => OperatorFunction;
  args: any[];
  position: SourcePosition;
}

export interface SubscribeDefinitionEvent {
  kind: 'subscribe-definition';
  definition: number;
  next: (value) => void;
  error: (error) => void;
  complete: () => void;
  position: SourcePosition;
}

export interface SubjectDefinitionEvent {
  kind: 'subject-definition';
  definition: number;
  constructor: any;
  args: any[];
  position: SourcePosition;
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

export interface SubjectNextEvent {
  kind: 'subject-next';
  subject: number;
  value: any;
  // todo: stacktrace / context;
}

export interface SubjectErrorEvent {
  kind: 'subject-error';
  subject: number;
  error: any;
  // todo: stacktrace / context;
}

export interface SubjectCompleteEvent {
  kind: 'subject-complete';
  subject: number;
  // todo: stacktrace / context;
}

export type NotificationEvent
  = NextNotificationEvent
  | ErrorNotificationEvent
  | CompleteNotificationEvent;

export type SubjectEvent
  = SubjectNextEvent
  | SubjectErrorEvent
  | SubjectCompleteEvent;

export type Event
  = CreatorDefinitionEvent
  | OperatorDefinitionEvent
  | SubscribeDefinitionEvent
  | SubjectDefinitionEvent
  | InstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NotificationEvent
  | SubjectEvent;
