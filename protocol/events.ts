export interface SourcePosition {
  file: string;
  line: number;
  column: number;
  functionName: string;
}

export interface CreatorDefinitionEvent {
  kind: 'creator-definition';
  definition: number;
  functionName: string;
  functionRef: number;
  argsRefs: number[];
  position: SourcePosition;
}

export interface OperatorDefinitionEvent {
  kind: 'operator-definition';
  definition: number;
  functionName: string;
  functionRef: number;
  argsRefs: number[];
  position: SourcePosition;
}

export interface SubscribeDefinitionEvent {
  kind: 'subscribe-definition';
  definition: number;
  nextName?: string;
  nextRef?: number;
  errorName?: string;
  errorRef?: number;
  completeName?: string;
  completeRef?: number;
  position: SourcePosition;
}

export interface SubjectDefinitionEvent {
  kind: 'subject-definition';
  definition: number;
  constructorName: string;
  constructorRef: number;
  argsRefs: number[];
  position: SourcePosition;
}

export type DefinitionEvent
  = CreatorDefinitionEvent
  | OperatorDefinitionEvent
  | SubscribeDefinitionEvent
  | SubjectDefinitionEvent

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
  valueRef: number;
}

export interface ErrorNotificationEvent {
  kind: 'error';
  sender: number;
  receiver: number;
  notification: number;
  errorRef: number;
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
  valueRef: number;
  // todo: stacktrace / context;
}

export interface SubjectErrorEvent {
  kind: 'subject-error';
  subject: number;
  errorRef: number;
  // todo: stacktrace / context;
}

export interface SubjectCompleteEvent {
  kind: 'subject-complete';
  subject: number;
  // todo: stacktrace / context;
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

export function isDefinitionEvent(x: Event): x is DefinitionEvent {
  switch (x.kind) {
    case 'creator-definition':
    case 'operator-definition':
    case 'subject-definition':
    case 'subscribe-definition':
      return true;
    default:
      return false;
  }
}
