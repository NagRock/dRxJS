import {RxInspector} from '../../instrument/rx-inspector';
import * as Event from '../../instrument/types';
import * as State from './types';
import {scan} from 'rxjs/operators';
import {Observable, Observer} from 'rxjs';


function fromRxInspector(rxInspector: RxInspector): Observable<Event.Event> {
  return Observable.create((observer: Observer<Event.Event>) => {
    const listener = (event) => observer.next(event);
    rxInspector.addListener(listener);

    return () => rxInspector.removeListener(listener);
  });
}


function handleOperator(state: State.State, event: Event.OperatorEvent) {
  const operator: State.Operator = {
    kind: 'operator',
    id: event.operator,
    func: event.func,
    args: event.args,
    instances: [],
  };

  state.observables[operator.id] = operator;

  return state;
}

function handleOperatorInstance(state: State.State, event: Event.OperatorInstanceEvent) {
  const operator = state.observables[event.operator];
  const operatorInstance: State.OperatorInstance = {
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

function handleSubscriber(state: State.State, event: Event.SubscriberEvent) {
  const subscriber: State.Subscriber = {
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

function handleSubscribe(state: State.State, event: Event.SubscribeEvent) {
  const sender = state.senders[event.sender];
  const receiver = state.receivers[event.receiver];
  const subscribe: State.Subscribe = {
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

function handleUnsubscribe(state: State.State, event: Event.UnsubscribeEvent) {
  const sender = state.senders[event.sender];
  const receiver = state.receivers[event.receiver];
  const unsubscribe: State.Unsubscribe = {
    kind: 'unsubscribe',
    sender,
    receiver,
  };

  sender.events.push(unsubscribe);
  receiver.events.push(unsubscribe);

  return state;
}

function handleNotification(state: State.State, event: Event.NotificationEvent) {
  const sender = state.senders[event.sender];
  const receiver = state.receivers[event.receiver];
  const cause: State.Cause = {
    kind: event.cause.kind,
    notification: state.notifications[event.cause.notification],
  };
  const notification: State.Notification = {
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
  const initialState: State.State = {
    observables: {},
    senders: {},
    receivers: {},
    notifications: {},
  };
  return fromRxInspector(rxInspector)
    .pipe(
      scan((state: State.State, event: Event.Event): State.State => {
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
