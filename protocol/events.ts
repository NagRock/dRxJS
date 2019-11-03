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

export type Reference
  = ValueReference
  | ObjectReference
  | LazyReference;

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

export interface CreatorDefinitionEvent {
  kind: 'creator-definition';
  id: number;
  function: ObjectReference;
  args: Reference[];
  position: SourcePosition;
}

export interface OperatorDefinitionEvent {
  kind: 'operator-definition';
  id: number;
  function: ObjectReference;
  args: Reference[];
  position: SourcePosition;
}

export interface SubscribeDefinitionEvent {
  kind: 'subscribe-definition';
  id: number;
  args: Reference[],
  position: SourcePosition;
}

export interface SubjectDefinitionEvent {
  kind: 'subject-definition';
  id: number;
  constructor: ObjectReference;
  args: Reference[];
  position: SourcePosition;
}

export interface UnknownDefinitionEvent {
  kind: 'unknown-definition';
  id: number;
  position: SourcePosition;
}

export type DefinitionEvent
  = CreatorDefinitionEvent
  | OperatorDefinitionEvent
  | SubscribeDefinitionEvent
  | SubjectDefinitionEvent
  | UnknownDefinitionEvent;

export interface InstanceEvent {
  kind: 'instance';
  id: number;
  definition: number;
}

export interface SubscribeEvent {
  kind: 'subscribe';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
}

export interface UnsubscribeEvent {
  kind: 'unsubscribe';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
}

export interface NextNotificationEvent {
  kind: 'next';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
  value: Reference;
}

export interface ErrorNotificationEvent {
  kind: 'error';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
  error: Reference;
}

export interface CompleteNotificationEvent {
  kind: 'complete';
  id: number;
  task: number;
  timestamp: number;
  sender: number;
  receiver: number;
}

export interface SubjectNextEvent {
  kind: 'subject-next';
  id: number;
  task: number;
  timestamp: number;
  subject: number;
  context: number;
  value: Reference;
}

export interface SubjectErrorEvent {
  kind: 'subject-error';
  id: number;
  task: number;
  timestamp: number;
  subject: number;
  context: number;
  error: Reference;
}

export interface SubjectCompleteEvent {
  kind: 'subject-complete';
  id: number;
  task: number;
  timestamp: number;
  subject: number;
  context: number;
}

export interface ConnectEvent {
  kind: 'connect';
  id: number;
  task: number;
  timestamp: number;
  connectable: number;
}

export type NotificationEvent
  = NextNotificationEvent
  | ErrorNotificationEvent
  | CompleteNotificationEvent;

export type SubjectEvent
  = SubjectNextEvent
  | SubjectErrorEvent
  | SubjectCompleteEvent;

export type Event
  = TaskEvent
  | DefinitionEvent
  | InstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NotificationEvent
  | SubjectEvent
  | ConnectEvent;
