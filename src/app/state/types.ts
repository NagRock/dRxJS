import * as rx from 'rxjs';

export interface Index<T> {
  [key: number]: T;
}

export interface Observable {}
export type OperatorFunction = rx.UnaryFunction<Observable, Observable>;

export interface CreatorDefinition {
  kind: 'creator-definition';
  id: number;
  func: (...args: any[]) => Observable;
  args: any[];
  instances: Instance[];
}

export interface OperatorDefinition {
  kind: 'operator-definition';
  id: number;
  func: (...args: any[]) => OperatorFunction;
  args: any[];
  instances: Instance[];
}

export interface SubscribeDefinition {
  kind: 'subscribe-definition';
  id: number;
  next: (value) => void;
  error: (error) => void;
  complete: () => void;
  instances: Instance[];
}

export type Definition
  = CreatorDefinition
  | OperatorDefinition
  | SubscribeDefinition;

export interface InstanceSnapshot {
  time: number;
  properties: {[property: string]: any};
}

export interface Instance {
  kind: 'instance';
  id: number;
  definition: Definition;
  receivers: Instance[];
  senders: Instance[];
  events: Event[];
  snapshots: InstanceSnapshot[];
}

export interface Subscribe {
  kind: 'subscribe';
  time: number;
  sender: Instance;
  receiver: Instance;
}

export interface Unsubscribe {
  kind: 'unsubscribe';
  time: number;
  sender: Instance;
  receiver: Instance;
}

export interface Cause {
  kind: 'sync' | 'async';
  notification: Notification;
}

export interface NextNotification {
  kind: 'next';
  id: number;
  time: number;
  sender: Instance;
  receiver: Instance;
  cause: Cause;
  value: any;
}

export interface ErrorNotification {
  kind: 'error';
  id: number;
  time: number;
  sender: Instance;
  receiver: Instance;
  cause: Cause;
  error: any;
}

export interface CompleteNotification {
  kind: 'complete';
  id: number;
  time: number;
  sender: Instance;
  receiver: Instance;
  cause: Cause;
}

export type Notification
  = NextNotification
  | ErrorNotification
  | CompleteNotification;

export type Event
  = Notification
  | Subscribe
  | Unsubscribe;

export interface State {
  definitions: Index<Definition>;
  instances: Index<Instance>;
  notifications: Index<Notification>;
}
