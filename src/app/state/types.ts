import * as rx from 'rxjs';

export interface Index<T> {
  [key: number]: T;
}

export interface Operator {
  kind: 'operator';
  id: number;
  func: (...args: any[]) => rx.OperatorFunction<any, any>;
  args: any[];
  instances: OperatorInstance[];
}

export type Observable
  = Operator;

export interface OperatorInstance {
  kind: 'operator-instance';
  id: number;
  operator: Operator;
  receivers: Receiver[];
  senders: Sender[];
  events: Event[];
}

export type ObservableInstance
  = OperatorInstance;


export interface Subscriber {
  kind: 'subscriber';
  id: number;
  next: (value) => void;
  error: (error) => void;
  complete: () => void;
  senders: Sender[];
  events: Event[];
}

export type Sender
  = OperatorInstance;


export type Receiver
  = OperatorInstance
  | Subscriber;

export function isSender(x: Sender | Receiver): x is Sender {
  switch (x.kind) {
    case 'operator-instance':
      return true;
    default:
      return false;
  }
}

export function isReceiver(x: Sender | Receiver): x is Receiver {
  switch (x.kind) {
    case 'operator-instance':
    case 'subscriber':
      return true;
    default:
      return false;
  }
}


export interface Subscribe {
  kind: 'subscribe';
  time: number;
  sender: Sender;
  receiver: Receiver;
}

export interface Unsubscribe {
  kind: 'unsubscribe';
  time: number;
  sender: Sender;
  receiver: Receiver;
}

export interface Cause {
  kind: 'sync' | 'async';
  notification: Notification;
}

export interface NextNotification {
  kind: 'notification:next';
  id: number;
  time: number;
  sender: Sender;
  receiver: Receiver;
  cause: Cause;
  value: any;
}

export interface ErrorNotification {
  kind: 'notification:error';
  id: number;
  time: number;
  sender: Sender;
  receiver: Receiver;
  cause: Cause;
  error: any;
}

export interface CompleteNotification {
  kind: 'notification:complete';
  id: number;
  time: number;
  sender: Sender;
  receiver: Receiver;
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
  observables: Index<Observable>;
  senders: Index<Sender>;
  receivers: Index<Receiver>;
  notifications: Index<Notification>;
}
