import * as Event from '@drxjs/events';
import * as State from './types';
import {Instance, Properties} from './types';
import {scan} from 'rxjs/operators';
import {clock} from './clock';

function handleCreatorDefinition(state: State.State, event: Event.CreatorDefinitionEvent) {
  const definition: State.CreatorDefinition = {
    kind: 'creator-definition',
    name: event.functionName,
    id: event.definition,
    functionRef: event.functionRef,
    argsRefs: event.argsRefs,
    position: event.position,
    instances: [],
  };

  state.definitions[definition.id] = definition;

  return state;
}

function handleOperatorDefinition(state: State.State, event: Event.OperatorDefinitionEvent) {
  const definition: State.OperatorDefinition = {
    kind: 'operator-definition',
    name: event.functionName,
    id: event.definition,
    functionRef: event.functionRef,
    argsRefs: event.argsRefs,
    position: event.position,
    instances: [],
  };

  state.definitions[definition.id] = definition;

  return state;
}

function handleSubscribeDefinition(state: State.State, event: Event.SubscribeDefinitionEvent) {
  const definition: State.SubscribeDefinition = {
    kind: 'subscribe-definition',
    name: 'subscribe',
    id: event.definition,
    nextRef: event.nextRef,
    errorRef: event.errorRef,
    completeRef: event.completeRef,
    position: event.position,
    instances: [],
  };

  state.definitions[definition.id] = definition;

  return state;
}


function handleSubjectDefinition(state: State.State, event: Event.SubjectDefinitionEvent) {
  const definition: State.SubjectDefinition = {
    kind: 'subject-definition',
    name: event.constructorName,
    id: event.definition,
    constructorRef: event.constructorRef,
    position: event.position,
    instances: [],
  };

  state.definitions[definition.id] = definition;

  return state;
}

function snapshot<P extends Properties = Properties, K extends keyof P = never>(
  instance: Instance, time: number, propertyKey: K, propertyValue: P[K],
) {
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

  snapshot(sender, subscribe.time, 'active', true);
  if (receiver.definition.kind === 'subscribe-definition') {
    snapshot(receiver, subscribe.time, 'active', true);
  }

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

  snapshot(sender, unsubscribe.time, 'active', false);
  if (receiver.definition.kind === 'subscribe-definition') {
    snapshot(receiver, unsubscribe.time, 'active', false);
  }

  sender.events.push(unsubscribe);
  receiver.events.push(unsubscribe);

  return state;
}

function handleNotification(state: State.State, event: Event.NotificationEvent) {
  const sender = state.instances[event.sender];
  const receiver = state.instances[event.receiver];

  const notification: State.Notification = {
    kind: event.kind as any,
    id: event.notification,
    time: clock(),
    sender,
    receiver,
    ...event.kind === 'next' ? {valueRef: event.valueRef} : {},
    ...event.kind === 'error' ? {errorRef: event.errorRef} : {},
  };

  sender.events.push(notification);
  receiver.events.push(notification);

  state.notifications[notification.id] = notification;

  return state;
}


function handleSubjectCall(state: State.State, event: Event.SubjectEvent) {
  const subject = state.instances[event.subject];
  const call: State.SubjectCall = {
    kind: event.kind as any,
    time: clock(),
    sender: undefined,
    receiver: subject,
    ...event.kind === 'subject-next' ? {valueRef: event.valueRef} : {},
    ...event.kind === 'subject-error' ? {errorRef: event.errorRef} : {},
  };

  subject.events.push(call);

  return state;
}

function handleConnectCall(state: State.State, event: Event.ConnectEvent) {
  const connectable = state.instances[event.connectable];
  const call: State.SubjectCall = {
    kind: event.kind as any,
    time: clock(),
    sender: undefined,
    receiver: connectable,
  };

  connectable.events.push(call);

  return state;
}

export const state = () => scan((state: State.State, event: Event.Event): State.State => {
  switch (event.kind) {
    case 'creator-definition':
      return handleCreatorDefinition(state, event);
    case 'operator-definition':
      return handleOperatorDefinition(state, event);
    case 'subscribe-definition':
      return handleSubscribeDefinition(state, event);
    case 'subject-definition':
      return handleSubjectDefinition(state, event);
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
    case 'subject-next':
    case 'subject-error':
    case 'subject-complete':
      return handleSubjectCall(state, event);
    case 'connect':
      return handleConnectCall(state, event);
    default:
      return state;
  }
}, {
  definitions: {},
  instances: {},
  notifications: {},
});
