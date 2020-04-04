import * as Event from '@doctor-rxjs/events';
import * as Model from '../model/model';
import {InstanceSnapshot} from '../model/model';
import {Set} from 'immutable';

function handleTask(model: Model.Model, event: Event.TaskEvent) {
  const task: Model.Task = {
    ...event,
    events: [],
  };

  model.tasks[task.id] = task;
  model.currentTask = task;

  return model;
}

function handleCreatorDefinition(model: Model.Model, event: Event.CreatorDefinitionEvent) {
  const definition: Model.CreatorDefinition = {
    kind: 'creator-definition',
    name: event.function.name,
    id: event.id,
    function: event.function,
    args: event.args,
    position: event.position,
    instances: [],
  };

  model.definitions[definition.id] = definition;

  return model;
}

function handleOperatorDefinition(model: Model.Model, event: Event.OperatorDefinitionEvent) {
  const definition: Model.OperatorDefinition = {
    kind: 'operator-definition',
    name: event.function.name,
    id: event.id,
    function: event.function,
    args: event.args,
    position: event.position,
    instances: [],
  };

  model.definitions[definition.id] = definition;

  return model;
}

function handleSubscribeDefinition(model: Model.Model, event: Event.SubscribeDefinitionEvent) {
  const definition: Model.SubscribeDefinition = {
    kind: 'subscribe-definition',
    name: 'subscribe',
    id: event.id,
    args: event.args,
    position: event.position,
    instances: [],
  };

  model.definitions[definition.id] = definition;

  return model;
}


function handleSubjectDefinition(model: Model.Model, event: Event.SubjectDefinitionEvent) {
  const definition: Model.SubjectDefinition = {
    kind: 'subject-definition',
    name: event.constructor.name,
    id: event.id,
    constructor: event.constructor,
    args: event.args,
    position: event.position,
    instances: [],
  };

  model.definitions[definition.id] = definition;

  return model;
}

function handleUnknownDefinition(model: Model.Model, event: Event.UnknownDefinitionEvent) {
  const definition: Model.UnknownDefinition = {
    kind: 'unknown-definition',
    name: 'unknown',
    id: event.id,
    position: event.position,
    instances: [],
  };

  model.definitions[definition.id] = definition;

  return model;
}

function handleInstance(model: Model.Model, event: Event.InstanceEvent) {
  const definition = model.definitions[event.definition];
  const instance: Model.Instance = {
    kind: 'instance',
    id: event.id,
    definition,
    snapshots: [],
    events: [],
  };

  model.instances[instance.id] = instance;

  definition.instances.push(instance);

  return model;
}

const emptyInstanceSnapshot: InstanceSnapshot = {
  vtimestamp: 0,
  receivers: Set(),
  senders: Set(),
  contextReceivers: Set(),
  contextSenders: Set(),
};

function getLastInstanceSnapshot(instance: Model.Instance): InstanceSnapshot {
  if (instance.snapshots.length === 0) {
    return emptyInstanceSnapshot;
  } else {
    return instance.snapshots[instance.snapshots.length - 1];
  }
}

function handleSubscribe(model: Model.Model, event: Event.SubscribeEvent) {
  const sender = model.instances[event.sender];
  const receiver = model.instances[event.receiver];
  const subscribe: Model.Subscribe = {
    kind: 'subscribe',
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender,
    receiver,
  };

  model.currentTask.events.push(subscribe);

  sender.events.push(subscribe);
  receiver.events.push(subscribe);

  const senderLastSnapshot: InstanceSnapshot = getLastInstanceSnapshot(sender);
  const senderSnapshot: InstanceSnapshot = {
    ...senderLastSnapshot,
    vtimestamp: event.id,
    receivers: senderLastSnapshot.receivers.add(receiver),
  };
  sender.snapshots.push(senderSnapshot);

  const receiverLastSnapshot: InstanceSnapshot = getLastInstanceSnapshot(receiver);
  const receiverSnapshot: InstanceSnapshot = {
    ...senderLastSnapshot,
    vtimestamp: event.id,
    senders: receiverLastSnapshot.senders.add(sender),
  };
  receiver.snapshots.push(receiverSnapshot);

  model.events[subscribe.id] = subscribe;

  return model;
}

function handleUnsubscribe(model: Model.Model, event: Event.UnsubscribeEvent) {
  const sender = model.instances[event.sender];
  const receiver = model.instances[event.receiver];
  const unsubscribe: Model.Unsubscribe = {
    kind: 'unsubscribe',
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender,
    receiver,
  };

  model.currentTask.events.push(unsubscribe);

  sender.events.push(unsubscribe);
  receiver.events.push(unsubscribe);

  const senderLastSnapshot: InstanceSnapshot = getLastInstanceSnapshot(sender);
  const senderSnapshot: InstanceSnapshot = {
    ...senderLastSnapshot,
    vtimestamp: event.id,
    receivers: senderLastSnapshot.receivers.remove(receiver),
  };
  sender.snapshots.push(senderSnapshot);

  const receiverLastSnapshot: InstanceSnapshot = getLastInstanceSnapshot(receiver);
  const receiverSnapshot: InstanceSnapshot = {
    ...senderLastSnapshot,
    vtimestamp: event.id,
    senders: receiverLastSnapshot.senders.remove(sender),
  };
  receiver.snapshots.push(receiverSnapshot);

  model.events[unsubscribe.id] = unsubscribe;

  return model;
}

function handleNotification(model: Model.Model, event: Event.NotificationEvent) {
  const sender = model.instances[event.sender];
  const receiver = model.instances[event.receiver];

  const notification: Model.Notification = {
    kind: event.kind as any,
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender,
    receiver,
    ...event.kind === 'next' ? {value: event.value} : {},
    ...event.kind === 'error' ? {error: event.error} : {},
  };

  model.currentTask.events.push(notification);

  sender.events.push(notification);
  receiver.events.push(notification);

  model.events[notification.id] = notification;

  return model;
}


function handleSubjectCall(model: Model.Model, event: Event.SubjectEvent) {
  const subject = model.instances[event.subject];
  const context: Model.Instance = model.instances[event.context];
  const call: Model.SubjectCall = {
    kind: event.kind as any,
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender: context,
    receiver: subject,
    ...event.kind === 'subject-next' ? {value: event.value} : {},
    ...event.kind === 'subject-error' ? {error: event.error} : {},
  };
  model.currentTask.events.push(call);

  subject.events.push(call);

  // TODO: ???
  // if (event.context !== event.subject) {
  //   if (context.contextReceivers.indexOf(subject) === -1) {
  //     context.contextReceivers.push(subject);
  //     subject.contextSenders.push(context);
  //   }
  //
  //   context.events.push(call);
  // }

  model.events[call.id] = call;

  return model;
}

function handleConnectCall(model: Model.Model, event: Event.ConnectEvent) {
  const connectable = model.instances[event.connectable];
  const call: Model.SubjectCall = {
    kind: event.kind as any,
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender: undefined,
    receiver: connectable,
  };
  model.currentTask.events.push(call);

  connectable.events.push(call);

  model.events[call.id] = call;

  return model;
}

export const handleEvent = (model: Model.Model, event: Event.MessageEvent): Model.Model => {
  switch (event.kind) {
    case 'task':
      return handleTask(model, event);
    case 'creator-definition':
      return handleCreatorDefinition(model, event);
    case 'operator-definition':
      return handleOperatorDefinition(model, event);
    case 'subscribe-definition':
      return handleSubscribeDefinition(model, event);
    case 'subject-definition':
      return handleSubjectDefinition(model, event);
    case 'unknown-definition':
      return handleUnknownDefinition(model, event);
    case 'instance':
      return handleInstance(model, event);
    case 'subscribe':
      return handleSubscribe(model, event);
    case 'unsubscribe':
      return handleUnsubscribe(model, event);
    case 'next':
    case 'error':
    case 'complete':
      return handleNotification(model, event);
    case 'subject-next':
    case 'subject-error':
    case 'subject-complete':
      return handleSubjectCall(model, event);
    case 'connect':
      return handleConnectCall(model, event);
    default:
      return model;
  }
};



