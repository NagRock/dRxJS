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
  name: string; // __proto__.constructor for objects/arrays, name for functions
  ref: number;
}

export type Reference
  = ValueReference
  | ObjectReference;

export interface ObjectProperty {
  name: string;
  reference: Reference;
  enumerable: boolean;
}

export interface CreatorDefinitionEvent {
  kind: 'creator-definition';
  definition: number;
  function: ObjectReference;
  args: Reference[];
  position: SourcePosition;
}

export interface OperatorDefinitionEvent {
  kind: 'operator-definition';
  definition: number;
  function: ObjectReference;
  args: Reference[];
  position: SourcePosition;
}

export interface SubscribeDefinitionEvent {
  kind: 'subscribe-definition';
  definition: number;
  next: Reference;
  error: Reference;
  complete: Reference;
  position: SourcePosition;
}

export interface SubjectDefinitionEvent {
  kind: 'subject-definition';
  definition: number;
  constructor: ObjectReference;
  args: Reference[];
  position: SourcePosition;
}

export interface UnknownDefinitionEvent {
  kind: 'unknown-definition';
  definition: number;
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
  definition: number;
  instance: number;
}

export interface SubscribeEvent {
  kind: 'subscribe';
  sender: number;
  receiver: number;
}

export interface UnsubscribeEvent {
  kind: 'unsubscribe';
  sender: number;
  receiver: number;
}

export interface NextNotificationEvent {
  kind: 'next';
  sender: number;
  receiver: number;
  notification: number;
  value: Reference;
}

export interface ErrorNotificationEvent {
  kind: 'error';
  sender: number;
  receiver: number;
  notification: number;
  error: Reference;
}

export interface CompleteNotificationEvent {
  kind: 'complete';
  sender: number;
  receiver: number;
  notification: number;
}

export interface SubjectNextEvent {
  kind: 'subject-next';
  subject: number;
  context: number;
  value: Reference;
}

export interface SubjectErrorEvent {
  kind: 'subject-error';
  subject: number;
  context: number;
  error: Reference;
}

export interface SubjectCompleteEvent {
  kind: 'subject-complete';
  subject: number;
  context: number;
}

export interface ConnectEvent {
  kind: 'connect';
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
  = DefinitionEvent
  | InstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NotificationEvent
  | SubjectEvent
  | ConnectEvent;
