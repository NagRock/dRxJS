import {RxInspector} from '../../instrument/rx-inspector';
import {rxOperators} from '../../instrument/rx';
import * as rx from 'rxjs';
import {
  Event as InspectorEvent, NotificationEvent,
  OperatorEvent,
  OperatorInstanceEvent,
  SubscribeEvent,
  SubscriberEvent,
  UnsubscribeEvent
} from '../../instrument/types';

interface Index<T> {
  [key: number]: T;
}

interface Operator {
  kind: 'operator';
  id: number;
  func: (...args: any[]) => rx.OperatorFunction<any, any>;
  args: any[];
  instances: OperatorInstance[];
}

type Observable
  = Operator;

interface OperatorInstance {
  kind: 'operator-instance';
  id: number;
  operator: Operator;
  receivers: Receiver[];
  senders: Sender[];
  events: Event[];
}

interface Subscriber {
  kind: 'subscriber';
  id: number;
  next: (value) => void;
  error: (error) => void;
  complete: () => void;
  senders: Sender[];
  events: Event[];
}

type Sender
  = OperatorInstance;

type Receiver
  = OperatorInstance
  | Subscriber;


interface Subscribe {
  kind: 'subscribe';
  sender: Sender;
  receiver: Receiver;
}

interface Unsubscribe {
  kind: 'unsubscribe';
  sender: Sender;
  receiver: Receiver;
}

interface Cause {
  kind: 'sync' | 'async';
  notification: Notification;
}

interface NextNotification {
  kind: 'notification:next';
  id: number;
  sender: Sender;
  receiver: Receiver;
  cause: Cause;
  value: any;
}

interface ErrorNotification {
  kind: 'notification:error';
  id: number;
  sender: Sender;
  receiver: Receiver;
  cause: Cause;
  error: any;
}

interface CompleteNotification {
  kind: 'notification:complete';
  id: number;
  sender: Sender;
  receiver: Receiver;
  cause: Cause;
}

type Notification
  = NextNotification
  | ErrorNotification
  | CompleteNotification;

type Event
  = Notification
  | Subscribe
  | Unsubscribe;

interface State {
  observables: Index<Observable>;
  senders: Index<Sender>;
  receivers: Index<Receiver>;
  notifications: Index<Notification>;
}

function fromRxInspector(rxInspector: RxInspector): rx.Observable<InspectorEvent> {
  return rx.Observable.create((observer: rx.Observer<InspectorEvent>) => {
    const listener = (event) => observer.next(event);
    rxInspector.addListener(listener);

    return () => rxInspector.removeListener(listener);
  });
}


function handleOperator(state: State, event: OperatorEvent) {
  const operator: Operator = {
    kind: 'operator',
    id: event.operator,
    func: event.func,
    args: event.args,
    instances: [],
  };

  state.observables[operator.id] = operator;

  return state;
}

function handleOperatorInstance(state: State, event: OperatorInstanceEvent) {
  const operator = state.observables[event.operator];
  const operatorInstance: OperatorInstance = {
    kind: 'operator-instance',
    id: event.operatorInstance,
    operator,
    receivers: [],
    senders: [],
    events: [],
  };

  state.senders[operatorInstance.id] = operatorInstance;
  state.receivers[operatorInstance.id] = operatorInstance;

  operator.instances.push(operatorInstance);

  return state;
}

function handleSubscriber(state: State, event: SubscriberEvent) {
  const subscriber: Subscriber = {
    kind: 'subscriber',
    id: event.subscriber,
    next: event.next,
    error: event.error,
    complete: event.complete,
    senders: [],
    events: [],
  };

  state.receivers[subscriber.id] = subscriber;

  return state;
}

function handleSubscribe(state: State, event: SubscribeEvent) {
  const sender = state.senders[event.sender];
  const receiver = state.receivers[event.receiver];
  const subscribe: Subscribe = {
    kind: 'subscribe',
    sender,
    receiver,
  };

  sender.events.push(subscribe);
  receiver.events.push(subscribe);

  sender.receivers.push(receiver);
  receiver.senders.push(sender);

  return state;
}

function handleUnsubscribe(state: State, event: UnsubscribeEvent) {
  const sender = state.senders[event.sender];
  const receiver = state.receivers[event.receiver];
  const unsubscribe: Unsubscribe = {
    kind: 'unsubscribe',
    sender,
    receiver,
  };

  sender.events.push(unsubscribe);
  receiver.events.push(unsubscribe);

  return state;
}

function handleNotification(state: State, event: NotificationEvent) {
  const sender = state.senders[event.sender];
  const receiver = state.receivers[event.receiver];
  const cause: Cause = {
    kind: event.cause.kind,
    notification: state.notifications[event.cause.notification],
  };
  const notification: Notification = {
    kind: event.kind as any,
    id: event.notification,
    sender,
    receiver,
    cause,
    ...event.kind === 'notification:next' ? {value: event.value} : {},
    ...event.kind === 'notification:error' ? {error: event.error} : {},
  };

  sender.events.push(notification);
  receiver.events.push(notification);

  state.notifications[notification.id] = notification;

  return state;
}

export function state$(rxInspector: RxInspector) {
  const initialState: State = {
    observables: {},
    senders: {},
    receivers: {},
    notifications: {},
  };
  return fromRxInspector(rxInspector)
    .pipe(
      rxOperators.scan((state: State, event: InspectorEvent): State => {
        switch (event.kind) {
          case 'operator':
            return handleOperator(state, event);
          case 'operator-instance':
            return handleOperatorInstance(state, event);
          case 'subscriber':
            return handleSubscriber(state, event);
          case 'subscribe':
            return handleSubscribe(state, event);
          case 'unsubscribe':
            return handleUnsubscribe(state, event);
          case 'notification:next':
          case 'notification:error':
          case 'notification:complete':
            return handleNotification(state, event);
          default:
            return state;
        }
      }, initialState)
    );
}
