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

function addDeclaration(model: Model.Model, declaration: Model.Declaration) {
  model.declarations[declaration.id] = declaration;

  const {file: url, line, column} = declaration.position;
  let file: Model.SourceFile = model.files[url];
  if (file === undefined) {
    file = {
      url,
      markers: [],
    };
    model.files[url] = file;
  }
  let marker: Model.SourceFileMarker = file.markers.find((m) => m.line === line && m.column === column);
  if (marker === undefined) {
    marker = {
      name: declaration.name,
      line,
      column,
      declarations: [],
    };
  }
  marker.declarations.push(declaration);
}

function handleConstructorDeclaration(model: Model.Model, event: Event.ConstructorDeclarationEvent) {
  const declaration: Model.ConstructorDeclaration = {
    kind: 'constructor-declaration',
    name: event.ctor.name,
    id: event.id,
    ctor: event.ctor,
    args: event.args,
    position: event.position,
    observable: undefined,
  };

  addDeclaration(model, declaration);

  return model;
}

function handleObservableFromConstructor(model: Model.Model, event: Event.ObservableFromConstructorEvent) {
  const constructor = model.declarations[event.constructor] as Model.ConstructorDeclaration;

  const observable: Model.ObservableFromConstructor = {
    kind: 'observable-from-constructor',
    id: event.id,
    constructor,
    instances: [],
  };

  constructor.observable = observable;

  model.observables.push(observable);

  return model;
}

function handleOperatorDeclaration(model: Model.Model, event: Event.OperatorDeclarationEvent) {
  const declaration: Model.OperatorDeclaration = {
    kind: 'operator-declaration',
    name: event.func.name,
    id: event.id,
    func: event.func,
    args: event.args,
    position: event.position,
    observables: [],
  };

  addDeclaration(model, declaration);

  return model;
}

function handleObservableFromOperator(model: Model.Model, event: Event.ObservableFromOperatorEvent) {
  const source = model.observables[event.source];
  const operator = model.declarations[event.operator] as Model.OperatorDeclaration;

  const observable: Model.ObservableFromOperator = {
    kind: 'observable-from-constructor',
    id: event.id,
    source,
    operator,
    instances: [],
  };

  operator.observables.push(observable);

  model.observables.push(observable);

  return model;
}

function handleSubscribeDeclaration(model: Model.Model, event: Event.SubscribeDeclarationEvent) {
  const declaration: Model.SubscribeDeclaration = {
    kind: 'subscribe-declaration',
    name: 'subscribe',
    id: event.id,
    args: event.args,
    position: event.position,
    observable: undefined,
  };

  addDeclaration(model, declaration);

  return model;
}

function handleObservableFromSubscribe(model: Model.Model, event: Event.ObservableFromSubscribeEvent) {
  const source = model.observables[event.source];
  const subscribe = model.declarations[event.subscribe] as Model.SubscribeDeclaration;

  const observable: Model.ObservableFromSubscribe = {
    kind: 'observable-from-subscribe',
    id: event.id,
    source,
    subscribe,
    instances: [],
  };

  subscribe.observable = observable;

  model.observables.push(observable);

  return model;
}

function handleInstance(model: Model.Model, event: Event.InstanceEvent) {
  const observable = model.observables[event.observable];
  const instance: Model.Instance = {
    kind: 'instance',
    id: event.id,
    observable,
    snapshots: [],
    events: [],
  };

  model.instances[instance.id] = instance;

  observable.instances.push(instance);

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
  const trigger = model.events[event.trigger];
  const subscribe: Model.Subscribe = {
    kind: 'subscribe',
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender,
    receiver,
    trigger,
    triggered: [],
  };
  if (trigger) {
    trigger.triggered.push(subscribe);
  }

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
  const trigger = model.events[event.trigger];
  const unsubscribe: Model.Unsubscribe = {
    kind: 'unsubscribe',
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender,
    receiver,
    trigger,
    triggered: [],
  };
  if (trigger) {
    trigger.triggered.push(unsubscribe);
  }

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
  const trigger = model.events[event.trigger];

  const notification: Model.Notification = {
    kind: event.kind as any,
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender,
    receiver,
    trigger,
    triggered: [],
    ...event.kind === 'next' ? {value: event.value} : {},
    ...event.kind === 'error' ? {error: event.error} : {},
  };
  if (trigger) {
    trigger.triggered.push(notification);
  }

  model.currentTask.events.push(notification);

  sender.events.push(notification);
  receiver.events.push(notification);

  model.events[notification.id] = notification;

  return model;
}


function handleSubjectCall(model: Model.Model, event: Event.SubjectEvent) {
  const subject = model.instances[event.subject];
  const context: Model.Instance = model.instances[event.context];
  const trigger = model.events[event.trigger];

  const call: Model.SubjectCall = {
    kind: event.kind as any,
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender: context,
    receiver: subject,
    trigger,
    triggered: [],
    ...event.kind === 'subject-next' ? {value: event.value} : {},
    ...event.kind === 'subject-error' ? {error: event.error} : {},
  };
  if (trigger) {
    trigger.triggered.push(call);
  }
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
  const trigger = model.events[event.trigger];

  const call: Model.SubjectCall = {
    kind: event.kind as any,
    id: event.id,
    timestamp: event.timestamp,
    vtimestamp: event.id,
    task: model.currentTask,
    sender: undefined,
    receiver: connectable,
    trigger,
    triggered: [],
  };
  if (trigger) {
    trigger.triggered.push(call);
  }
  model.currentTask.events.push(call);

  connectable.events.push(call);

  model.events[call.id] = call;

  return model;
}

export const handleEvent = (model: Model.Model, event: Event.MessageEvent): Model.Model => {
  switch (event.kind) {
    case 'task':
      return handleTask(model, event);
    case 'constructor-declaration':
      return handleConstructorDeclaration(model, event);
    case 'observable-from-constructor':
      return handleObservableFromConstructor(model, event);
    case 'operator-declaration':
      return handleOperatorDeclaration(model, event);
    case 'observable-from-operator':
      return handleObservableFromOperator(model, event);
    case 'subscribe-declaration':
      return handleSubscribeDeclaration(model, event);
    case 'observable-from-subscribe':
      return handleObservableFromSubscribe(model, event);
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



