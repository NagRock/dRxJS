import {RxInspector} from '../../instrument/rx-inspector';
import * as Event from '../../instrument/types';
import {CreatorDefinitionEvent} from '../../instrument/types';
import * as State from './types';
import {scan, shareReplay} from 'rxjs/operators';
import {Observable, Observer} from 'rxjs';
import {clock} from './clock';
import {Instance} from './types';


function fromRxInspector(rxInspector: RxInspector): Observable<Event.Event> {
  return Observable.create((observer: Observer<Event.Event>) => {
    const listener = (event) => observer.next(event);
    rxInspector.addListener(listener);

    return () => rxInspector.removeListener(listener);
  });
}

function handleCreatorDefinition(state: State.State, event: CreatorDefinitionEvent) {
  const definition: State.CreatorDefinition = {
    kind: 'creator-definition',
    id: event.definition,
    func: event.func,
    args: event.args,
    instances: [],
  };

  state.definitions[definition.id] = definition;

  return state;
}

function handleOperatorDefinition(state: State.State, event: Event.OperatorDefinitionEvent) {
  const definition: State.OperatorDefinition = {
    kind: 'operator-definition',
    id: event.definition,
    func: event.func,
    args: event.args,
    instances: [],
  };

  state.definitions[definition.id] = definition;

  return state;
}

function handleSubscribeDefinition(state: State.State, event: Event.SubscribeDefinitionEvent) {
  const definition: State.SubscribeDefinition = {
    kind: 'subscribe-definition',
    id: event.definition,
    next: event.next,
    error: event.error,
    complete: event.complete,
    instances: [],
  };

  state.definitions[definition.id] = definition;

  return state;
}

function snapshot(instance: Instance, time: number, propertyKey: string, propertyValue: any) {
  if (instance.snapshots.length === 0) {
    const properties = {[propertyKey]: propertyValue};
    instance.snapshots.push({time, properties});
  } else {
    const properties = {...instance.snapshots[instance.snapshots.length - 1].properties, [propertyKey]: propertyValue};
    instance.snapshots.push({time, properties});
  }
}

function handleInstance(state: State.State, event: Event.InstanceEvent) {
  const definition = state.definitions[event.definition];
  const instance: State.Instance = {
    kind: 'instance',
    id: event.instance,
    definition,
    receivers: [],
    senders: [],
    events: [],
    snapshots: [],
  };

  state.instances[instance.id] = instance;

  definition.instances.push(instance);

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

  snapshot(sender, subscribe.time, 'subscribed', true);

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

  snapshot(sender, unsubscribe.time, 'subscribed', false);

  sender.events.push(unsubscribe);
  receiver.events.push(unsubscribe);

  return state;
}

function handleNotification(state: State.State, event: Event.NotificationEvent) {
  const sender = state.instances[event.sender];
  const receiver = state.instances[event.receiver];
  const cause: State.Cause = event.cause === undefined
    ? undefined
    : {
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
    ...event.kind === 'next' ? {value: event.value} : {},
    ...event.kind === 'error' ? {error: event.error} : {},
  };

  sender.events.push(notification);
  receiver.events.push(notification);

  state.notifications[notification.id] = notification;

  return state;
}

export function getState$(rxInspector: RxInspector) {
  return fromRxInspector(rxInspector)
    .pipe(
      scan((state: State.State, event: Event.Event): State.State => {
        switch (event.kind) {
          case 'creator-definition':
            return handleCreatorDefinition(state, event);
          case 'operator-definition':
            return handleOperatorDefinition(state, event);
          case 'subscribe-definition':
            return handleSubscribeDefinition(state, event);
          case 'instance':
            return handleInstance(state, event);
          case 'subscribe':
            return handleSubscribe(state, event);
          case 'unsubscribe':
            return handleUnsubscribe(state, event);
          case 'next':
          case 'error':
          case 'complete':
            return handleNotification(state, event);
          default:
            return state;
        }
      }, {
        definitions: {},
        instances: {},
        notifications: {},
      }),
      shareReplay(1),
    );
}
