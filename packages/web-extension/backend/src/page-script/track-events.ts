export interface SourcePosition {
  file: string;
  line: number;
  column: number;
}

export interface TaskEvent {
  kind: 'task';
  id: number;
  type: 'macroTask' | 'microTask' | 'eventTask';
  source: string;
}

export interface ConstructorDeclarationEvent {
  kind: 'constructor-declaration';
  id: number;
  ctor: (...args: any[]) => any;
  args: any[];
  position: SourcePosition;
}

export interface ObservableFromConstructorEvent {
  kind: 'observable-from-constructor';
  id: number;
  constructor: number;
}

export interface OperatorDeclarationEvent {
  kind: 'operator-declaration';
  id: number;
  func: (...args: any[]) => any;
  args: any[];
  position: SourcePosition;
}

export interface ObservableFromOperatorEvent {
  kind: 'observable-from-operator';
  id: number;
  source: number;
  operator: number;
}

export interface SubscribeDeclarationEvent {
  kind: 'subscribe-declaration';
  id: number;
  args: any[];
  position: SourcePosition;
}

export interface ObservableFromSubscribeEvent {
  kind: 'observable-from-subscribe';
  id: number;
  source: number;
  subscribe: number;
}

export type DeclarationEvent
  = ConstructorDeclarationEvent
  | OperatorDeclarationEvent
  | SubscribeDeclarationEvent;

export type ObservableEvent
  = ObservableFromConstructorEvent
  | ObservableFromOperatorEvent
  | ObservableFromSubscribeEvent;

export interface InstanceEvent {
  kind: 'instance';
  id: number;
  observable: number;
}

export interface SubscribeEvent {
  kind: 'subscribe';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
  trigger: number;
}

export interface UnsubscribeEvent {
  kind: 'unsubscribe';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
  trigger: number;
}

export interface NextNotificationEvent {
  kind: 'next';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
  trigger: number;
  value: any;
}

export interface ErrorNotificationEvent {
  kind: 'error';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
  trigger: number;
  error: any;
}

export interface CompleteNotificationEvent {
  kind: 'complete';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
  trigger: number;
}

export interface SubjectNextEvent {
  kind: 'subject-next';
  id: number;
  task: number;
  timestamp: number;
  subject: number;
  context: number;
  trigger: number;
  value: any;
}

export interface SubjectErrorEvent {
  kind: 'subject-error';
  id: number;
  task: number;
  timestamp: number;
  subject: number;
  context: number;
  trigger: number;
  error: any;
}

export interface SubjectCompleteEvent {
  kind: 'subject-complete';
  id: number;
  task: number;
  timestamp: number;
  subject: number;
  context: number;
  trigger: number;
}

export interface ConnectEvent {
  kind: 'connect';
  id: number;
  task: number;
  timestamp: number;
  connectable: number;
  trigger: number;
}

export type NotificationEvent
  = NextNotificationEvent
  | ErrorNotificationEvent
  | CompleteNotificationEvent;

export type SubjectEvent
  = SubjectNextEvent
  | SubjectErrorEvent
  | SubjectCompleteEvent;

export type TrackEvent
  = TaskEvent
  | DeclarationEvent
  | ObservableEvent
  | InstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NotificationEvent
  | SubjectEvent
  | ConnectEvent;

export function isDeclarationEvent(x: TrackEvent): x is DeclarationEvent {
  switch (x.kind) {
    case 'constructor-declaration':
    case 'operator-declaration':
    case 'subscribe-declaration':
      return true;
    default:
      return false;
  }
}
