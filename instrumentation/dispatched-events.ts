export type Observable = any;

export type OperatorFunction = (source: Observable) => Observable;

export interface SourcePosition {
  file: string;
  line: number;
  column: number;
}

export interface CreatorDefinitionEvent {
  kind: 'creator-definition';
  id: number;
  function: (...args: any[]) => Observable;
  args: any[];
  position: SourcePosition;
}

export interface OperatorDefinitionEvent {
  kind: 'operator-definition';
  id: number;
  function: (...args: any[]) => OperatorFunction;
  args: any[];
  position: SourcePosition;
}

export interface SubscribeDefinitionEvent {
  kind: 'subscribe-definition';
  id: number;
  args: any[],
  position: SourcePosition;
}

export interface SubjectDefinitionEvent {
  kind: 'subject-definition';
  id: number;
  constructor: new (...args: any) => void;
  args: any[];
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
  sender: number;
  receiver: number;
}

export interface UnsubscribeEvent {
  kind: 'unsubscribe';
  id: number;
  sender: number;
  receiver: number;
}

export interface NextNotificationEvent {
  kind: 'next';
  id: number;
  sender: number;
  receiver: number;
  value: any;
}

export interface ErrorNotificationEvent {
  kind: 'error';
  id: number;
  sender: number;
  receiver: number;
  error: any;
}

export interface CompleteNotificationEvent {
  kind: 'complete';
  id: number;
  sender: number;
  receiver: number;
}

export interface SubjectNextEvent {
  kind: 'subject-next';
  id: number;
  subject: number;
  context: number;
  value: any;
}

export interface SubjectErrorEvent {
  kind: 'subject-error';
  id: number;
  subject: number;
  context: number;
  error: any;
}

export interface SubjectCompleteEvent {
  kind: 'subject-complete';
  id: number;
  subject: number;
  context: number;
}

export interface ConnectEvent {
  kind: 'connect';
  id: number;
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
