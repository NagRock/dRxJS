export interface SourcePosition {
  file: string;
  line: number;
  column: number;
  functionName: string;
}

export type Value
  = null
  | undefined
  | boolean
  | number
  | string
  | symbol
  | bigint;

export interface ValueReference {
  kind: 'value';
  value: Value;
}

export interface ObjectReference {
  kind: 'object';
  type: 'object' | 'array' | 'function';
  name: string; // .constructor.name for objects/arrays, .name for functions
  size?: number; // .length for arrays
  ref: number;
}

export interface LazyReference {
  kind: 'lazy';
  ref: number;
  property: string;
}

export interface ObservableReference {
  kind: 'observable';
  id: number;
}

export interface DeclarationReference {
  kind: 'declaration';
  id: number;
}

export type Reference
  = ValueReference
  | ObjectReference
  | LazyReference
  | ObservableReference
  | DeclarationReference;

export interface Property<R extends Reference = Reference> {
  readonly name: string;
  readonly enumerable: boolean;
  readonly reference: R;
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
  ctor: ObjectReference;
  args: Reference[];
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
  func: ObjectReference;
  args: Reference[];
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
  args: Reference[];
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
  value: Reference;
}

export interface ErrorNotificationEvent {
  kind: 'error';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
  trigger: number;
  error: Reference;
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
  value: Reference;
}

export interface SubjectErrorEvent {
  kind: 'subject-error';
  id: number;
  task: number;
  timestamp: number;
  subject: number;
  context: number;
  trigger: number;
  error: Reference;
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

export type MessageEvent
  = TaskEvent
  | DeclarationEvent
  | ObservableEvent
  | InstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NotificationEvent
  | SubjectEvent
  | ConnectEvent;
