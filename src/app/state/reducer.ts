import {RxInspector} from '../../instrument/rx-inspector';
import * as Event from '../../instrument/types';
import * as State from './types';
import {scan} from 'rxjs/operators';
import {Observable, Observer} from 'rxjs';
import {clock} from './clock';


function fromRxInspector(rxInspector: RxInspector): Observable<Event.Event> {
  return Observable.create((observer: Observer<Event.Event>) => {
    const listener = (event) => observer.next(event);
    rxInspector.addListener(listener);

    return () => rxInspector.removeListener(listener);
  });
}

function handleOperatorDefinition(state: State.State, event: Event.OperatorDefinitionEvent) {
  const operator: State.OperatorDefinition = {
    kind: 'operator-definition',
    id: event.definition,
    func: event.func,
    args: event.args,
    instances: [],
  };

  state.definitions[operator.id] = operator;

  return state;
}

function handleOperatorInstance(state: State.State, event: Event.OperatorInstanceEvent) {
  const definition = state.definitions[event.definition];
  const instance: State.OperatorInstance = {
    kind: 'operator-instance',
    id: event.instance,
    definition,
    receivers: [],
    senders: [],
    events: [],
  };

  state.instances[instance.id] = instance;

  definition.instances.push(instance);

  return state;
}

function handleSubscribeInstance(state: State.State, event: Event.SubscribeInstanceEvent) {
  const instance: State.SubscribeInstance = {
    kind: 'subscribe-instance',
    id: event.instance,
    next: event.next,
    error: event.error,
    complete: event.complete,
    senders: [],
    receivers: [],
    events: [],
  };

  state.instances[instance.id] = instance;

  return state;
}

function handleSubscribe(state: State.State, event: Event.SubscribeEvent) {
  const sender = state.instances[event.sender];
  const receiver = state.instances[event.receiver];
  const subscribe: State.Subscribe = {
    kind: 'subscribe',
    time: clock(),
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
  const sender = state.instances[event.sender];
  const receiver = state.instances[event.receiver];
  const unsubscribe: State.Unsubscribe = {
    kind: 'unsubscribe',
    time: clock(),
    sender,
    receiver,
  };

  sender.events.push(unsubscribe);
  receiver.events.push(unsubscribe);

  return state;
}

function handleNotification(state: State.State, event: Event.NotificationEvent) {
  const sender = state.instances[event.sender];
  const receiver = state.instances[event.receiver];
  const cause: State.Cause = {
    kind: event.cause.kind,
    notification: state.notifications[event.cause.notification],
  };
  const notification: State.Notification = {
    kind: event.kind as any,
    id: event.notification,
    time: clock(),
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

export function getState$(rxInspector: RxInspector) {
  const initialState: State.State = {
    definitions: {},
    instances: {},
    notifications: {},
  };
  return fromRxInspector(rxInspector)
    .pipe(
      scan((state: State.State, event: Event.Event): State.State => {
        switch (event.kind) {
          case 'operator-definition':
            return handleOperatorDefinition(state, event);
          case 'operator-instance':
            return handleOperatorInstance(state, event);
          case 'subscribe-instance':
            return handleSubscribeInstance(state, event);
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
