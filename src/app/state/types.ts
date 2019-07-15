import * as rx from 'rxjs';

export interface Index<T> {
  [key: number]: T;
}

export interface OperatorDefinition {
  kind: 'operator-definition';
  id: number;
  func: (...args: any[]) => rx.OperatorFunction<any, any>;
  args: any[];
  instances: OperatorInstance[];
}

export interface OperatorInstance {
  kind: 'operator-instance';
  id: number;
  definition: OperatorDefinition;
  receivers: Instance[];
  senders: Instance[];
  events: Event[];
}

export interface SubscribeInstance {
  kind: 'subscribe-instance';
  id: number;
  next: (value) => void;
  error: (error) => void;
  complete: () => void;
  senders: Instance[];
  receivers: Instance[];
  events: Event[];
}

export type Definition
  = OperatorDefinition;

export type Instance
  = OperatorInstance
  | SubscribeInstance;

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
  kind: 'notification:next';
  id: number;
  time: number;
  sender: Instance;
  receiver: Instance;
  cause: Cause;
  value: any;
}

export interface ErrorNotification {
  kind: 'notification:error';
  id: number;
  time: number;
  sender: Instance;
  receiver: Instance;
  cause: Cause;
  error: any;
}

export interface CompleteNotification {
  kind: 'notification:complete';
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
