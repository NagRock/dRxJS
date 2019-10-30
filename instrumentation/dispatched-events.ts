export type Observable = any;

export type OperatorFunction = (source: Observable) => Observable;

export interface SourcePosition {
  file: string;
  line: number;
  column: number;
}

export interface Cause {
  kind: 'sync' | 'async';
  notification: number;
}

export interface CreatorDefinitionEvent {
  kind: 'creator-definition';
  definition: number;
  func: (...args: any[]) => Observable;
  args: any[];
  position: SourcePosition;
}

export interface OperatorDefinitionEvent {
  kind: 'operator-definition';
  definition: number;
  func: (...args: any[]) => OperatorFunction;
  args: any[];
  position: SourcePosition;
}

export interface SubscribeDefinitionEvent {
  kind: 'subscribe-definition';
  definition: number;
  args: any[],
  position: SourcePosition;
}

export interface SubjectDefinitionEvent {
  kind: 'subject-definition';
  definition: number;
  constructor: new (...args: any) => void;
  args: any[];
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
  cause: Cause;
  value: any;
}

export interface ErrorNotificationEvent {
  kind: 'error';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
  error: any;
}

export interface CompleteNotificationEvent {
  kind: 'complete';
  sender: number;
  receiver: number;
  notification: number;
  cause: Cause;
}

export interface SubjectNextEvent {
  kind: 'subject-next';
  subject: number;
  context: number;
  value: any;
}

export interface SubjectErrorEvent {
  kind: 'subject-error';
  subject: number;
  context: number;
  error: any;
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

export type DispatchedEvent
  = DefinitionEvent
  | InstanceEvent
  | SubscribeEvent
  | UnsubscribeEvent
  | NotificationEvent
  | SubjectEvent
  | ConnectEvent;

export function isDefinitionEvent(x: DispatchedEvent): x is DefinitionEvent {
  switch (x.kind) {
    case 'creator-definition':
    case 'operator-definition':
    case 'subject-definition':
    case 'subscribe-definition':
    case 'unknown-definition':
      return true;
    default:
      return false;
  }
}
