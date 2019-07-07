import {RxInspector} from '../../instrument/rx-inspector';
import {Observable, Observer} from 'rxjs';
import {
  CompleteNotificationEvent,
  ErrorNotificationEvent,
  Event,
  NextNotificationEvent,
  ObservableOperatorEvent,
  RxOperator,
  SubscribeEvent,
  SubscriptionEvent,
  UnsubscribeEvent
} from '../../instrument/operators/instrument-operator';
import {rxOperators} from '../../instrument/rx';

interface ObservableState {
  id: number;
  operator: RxOperator;
  args: any[];
  subscriptions: SubscriptionState[];
}

interface SubscriptionState {
  id: number;
  observable: ObservableState;
  subscribers: SubscriptionState[];
  subscriptions: SubscriptionState[];
  events: EventState[];
}

interface SubscribeState {
  kind: 'subscribe';
  source: SubscriptionState;
  destination: SubscriptionState;
}

interface UnsubscribeState {
  kind: 'unsubscribe';
  source: SubscriptionState;
  destination: SubscriptionState;
}

interface NextNotificationState {
  kind: 'notification:next';
  id: number;
  source: SubscriptionState;
  destination: SubscriptionState;
  value: any;
  cause: CauseState;
}

interface ErrorNotificationState {
  kind: 'notification:error';
  id: number;
  source: SubscriptionState;
  destination: SubscriptionState;
  error: any;
  cause: CauseState;
}

interface CompleteNotificationState {
  kind: 'notification:complete';
  id: number;
  source: SubscriptionState;
  destination: SubscriptionState;
  cause: CauseState;
}

type NotificationState
  = NextNotificationState
  | ErrorNotificationState
  | CompleteNotificationState;

type EventState
  = SubscribeState
  | UnsubscribeState
  | NotificationState;

interface CauseState {
  kind: 'sync' | 'async';
  notification: NotificationState;
}

interface State {
  observables: { [id: number]: ObservableState };
  subscriptions: { [id: number]: SubscriptionState };
  notifications: { [id: number]: NotificationState };
}

function fromRxInspector(rxInspector: RxInspector): Observable<Event> {
  return Observable.create((observer: Observer<Event>) => {
    const listener = (event) => observer.next(event);
    rxInspector.addListener(listener);

    return () => rxInspector.removeListener(listener);
  });
}

function handleObservableOperator(state: State, event: ObservableOperatorEvent): State {
  state.observables[event.observable] = {
    id: event.observable,
    operator: event.operator,
    args: event.args,
    subscriptions: [],
  };
  return state;
}

function handleSubscription(state: State, event: SubscriptionEvent) {
  const observable = state.observables[event.observable];
  const subscription: SubscriptionState = {
    id: event.subscription,
    observable,
    subscribers: [],
    subscriptions: [],
    events: [],
  };
  observable.subscriptions.push(subscription);
  state.subscriptions[event.subscription] = subscription;

  return state;
}

function handleSubscribe(state: State, event: SubscribeEvent) {
  const source = state.subscriptions[event.source];
  const destination = state.subscriptions[event.destination];
  const subscribe: SubscribeState = {
    kind: 'subscribe',
    source,
    destination,
  };

  source.events.push(subscribe);
  source.subscribers.push(destination);

  if (destination) {
    destination.events.push(subscribe);
    destination.subscriptions.push(source);
  }

  return state;
}

function handleUnsubscribe(state: State, event: UnsubscribeEvent) {
  const source = state.subscriptions[event.source];
  const destination = state.subscriptions[event.destination];
  const subscribe: UnsubscribeState = {
    kind: 'unsubscribe',
    source,
    destination,
  };

  source.events.push(subscribe);
  if (destination) {
    destination.events.push(subscribe);
  }

  return state;
}

function handleNotification(state: State, event: NextNotificationEvent | ErrorNotificationEvent | CompleteNotificationEvent) {
  const source = state.subscriptions[event.source];
  const destination = state.subscriptions[event.destination];
  const cause: CauseState = event.cause
    ? {
      kind: event.cause.kind,
      notification: state.notifications[event.cause.notification]
    }
    : undefined;

  let notification: NextNotificationState | ErrorNotificationState | CompleteNotificationState;
  switch (event.kind) {
    case 'notification:next':
      notification = {
        kind: 'notification:next',
        id: event.notification,
        source,
        destination,
        value: event.value,
        cause,
      };
      break;
    case 'notification:error':
      notification = {
        kind: 'notification:error',
        id: event.notification,
        source,
        destination,
        error: event.error,
        cause,
      };
      break;
    case 'notification:complete':
      notification = {
        kind: 'notification:complete',
        id: event.notification,
        source,
        destination,
        cause,
      };
      break;
  }

  source.events.push(notification);
  if (destination) {
    destination.events.push(notification);
  }

  state.notifications[event.notification] = notification;

  return state;
}

export function state$(rxInspector: RxInspector) {
  const initialState: State = {
    observables: {},
    subscriptions: {},
    notifications: {},
  };
  return fromRxInspector(rxInspector)
    .pipe(
      rxOperators.scan((state: State, event: Event): State => {
        switch (event.kind) {
          case 'observable:operator':
            return handleObservableOperator(state, event);
          case 'subscription':
            return handleSubscription(state, event);
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
