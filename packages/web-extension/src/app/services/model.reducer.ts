import * as Event from '@doctor-rxjs/events';
import * as Model from '../model/model';
import {InstanceSnapshot, SourceFilePosition} from '../model/model';
import {Set} from 'immutable';
import {createRef, createRefs} from './reference.service';

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
    file.markers.push(marker);
  }
  marker.declarations.push(declaration);
}

function handleConstructorDeclaration(model: Model.Model, event: Event.ConstructorDeclarationEvent) {
  const declaration = new Model.ConstructorDeclaration(
    event.ctor.name,
    event.id,
    createRef(event.ctor),
    createRefs(event.args),
    new SourceFilePosition(event.position.file, event.position.line, event.position.column, event.position.functionName),
    undefined,
  );

  addDeclaration(model, declaration);

  return model;
}

function handleObservableFromConstructor(model: Model.Model, event: Event.ObservableFromConstructorEvent) {
  const constructor = model.declarations[event.constructor] as Model.ConstructorDeclaration;

  const observable = new Model.ObservableFromConstructor(
    event.id,
    constructor,
    [],
  );

  constructor.observable = observable;

  model.observables.push(observable);

  return model;
}

function handleOperatorDeclaration(model: Model.Model, event: Event.OperatorDeclarationEvent) {
  const declaration = new Model.OperatorDeclaration(
    event.func.name,
    event.id,
    createRef(event.func),
    createRefs(event.args),
    new SourceFilePosition(event.position.file, event.position.line, event.position.column, event.position.functionName),
    [],
  );

  addDeclaration(model, declaration);

  return model;
}

function handleObservableFromOperator(model: Model.Model, event: Event.ObservableFromOperatorEvent) {
  const source = model.observables[event.source];
  const operator = model.declarations[event.operator] as Model.OperatorDeclaration;

  const observable = new Model.ObservableFromOperator(
    event.id,
    source,
    operator,
    [],
  );

  operator.observables.push(observable);

  model.observables.push(observable);

  return model;
}

function createSourceFilePosition(position: Event.SourcePosition) {
  return new SourceFilePosition(position.file, position.line, position.column, position.functionName);
}

function handleSubscribeDeclaration(model: Model.Model, event: Event.SubscribeDeclarationEvent) {
  const declaration = new Model.SubscribeDeclaration(
    'subscribe',
    event.id,
    createRefs(event.args),
    createSourceFilePosition(event.position),
    undefined,
  );

  addDeclaration(model, declaration);

  return model;
}

function handleObservableFromSubscribe(model: Model.Model, event: Event.ObservableFromSubscribeEvent) {
  const source = model.observables[event.source];
  const subscribe = model.declarations[event.subscribe] as Model.SubscribeDeclaration;

  const observable = new Model.ObservableFromSubscribe(
    event.id,
    source,
    subscribe,
    [],
  );

  subscribe.observable = observable;

  model.observables.push(observable);

  return model;
}

function handleInstance(model: Model.Model, event: Event.InstanceEvent) {
  const observable = model.observables[event.observable];
  const instance = new Model.Instance(
    event.id,
    observable,
    [],
    [],
  );

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
  const subscribe = new Model.Subscribe(
    event.id,
    event.timestamp,
    event.id,
    model.currentTask,
    sender,
    receiver,
    trigger,
    [],
  );
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
  const unsubscribe = new Model.Unsubscribe(
    event.id,
    event.timestamp,
    event.id,
    model.currentTask,
    sender,
    receiver,
    trigger,
    [],
  );
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

function createNotification(
  event: Event.NotificationEvent, model: Model.Model, sender: Model.Instance, receiver: Model.Instance, trigger: Model.Event) {
  switch (event.kind) {
    case 'next':
      return new Model.NextNotification(
        event.id,
        event.timestamp,
        event.id,
        model.currentTask,
        sender,
        receiver,
        trigger,
        [],
        createRef(event.value),
      );
    case 'error':
      return new Model.ErrorNotification(
        event.id,
        event.timestamp,
        event.id,
        model.currentTask,
        sender,
        receiver,
        trigger,
        [],
        createRef(event.error),
      );
    case 'complete':
      return new Model.CompleteNotification(
        event.id,
        event.timestamp,
        event.id,
        model.currentTask,
        sender,
        receiver,
        trigger,
        [],
      );
  }
}

function handleNotification(model: Model.Model, event: Event.NotificationEvent) {
  const sender = model.instances[event.sender];
  const receiver = model.instances[event.receiver];
  const trigger = model.events[event.trigger];

  const notification = createNotification(event, model, sender, receiver, trigger);
  if (trigger) {
    trigger.triggered.push(notification);
  }

  model.currentTask.events.push(notification);

  sender.events.push(notification);
  receiver.events.push(notification);

  model.events[notification.id] = notification;

  return model;
}


function createSubjectCall(
  event: Event.SubjectEvent, task: Model.Task, context: Model.Instance, subject: Model.Instance, trigger: Model.Event) {
  switch (event.kind) {
    case 'subject-next':
      return new Model.SubjectNextCall(
        event.id,
        event.timestamp,
        event.id,
        task,
        context,
        subject,
        trigger,
        [],
        createRef(event.value),
      );
    case 'subject-error':
      return new Model.SubjectErrorCall(
        event.id,
        event.timestamp,
        event.id,
        task,
        context,
        subject,
        trigger,
        [],
        createRef(event.error),
      );
    case 'subject-complete':
      return new Model.SubjectCompleteCall(
        event.id,
        event.timestamp,
        event.id,
        task,
        context,
        subject,
        trigger,
        [],
      );
  }
}

function handleSubjectCall(model: Model.Model, event: Event.SubjectEvent) {
  const subject = model.instances[event.subject];
  const context: Model.Instance = model.instances[event.context];
  const trigger = model.events[event.trigger];

  const call = createSubjectCall(event, model.currentTask, context, subject, trigger);
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

  const call = new Model.ConnectCall(
    event.id,
    event.timestamp,
    event.id,
    model.currentTask,
    undefined,
    connectable,
    trigger,
    [],
  );
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



