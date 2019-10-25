import {ObjectReference, Reference} from '@drxjs/events';

export interface Index<T> {
  [key: number]: T;
}

export interface SourcePosition {
  file: string;
  line: number;
  column: number;
  functionName: string;
}

export interface CreatorDefinition {
  kind: 'creator-definition';
  name: string;
  id: number;
  function: ObjectReference;
  args: Reference[];
  position: SourcePosition;
  instances: Instance[];
}

export interface OperatorDefinition {
  kind: 'operator-definition';
  name: string;
  id: number;
  function: ObjectReference;
  args: Reference[];
  position: SourcePosition;
  instances: Instance[];
}

export interface SubscribeDefinition {
  kind: 'subscribe-definition';
  name: string;
  id: number;
  next: Reference;
  error: Reference;
  complete: Reference;
  position: SourcePosition;
  instances: Instance[];
}

export interface SubjectDefinition {
  kind: 'subject-definition';
  name: string;
  id: number;
  constructor: ObjectReference;
  position: SourcePosition;
  instances: Instance[];
}

export interface UnknownDefinition {
  kind: 'unknown-definition';
  name: string;
  id: number;
  position: SourcePosition;
  instances: Instance[];
}

export type Definition
  = CreatorDefinition
  | OperatorDefinition
  | SubscribeDefinition
  | SubjectDefinition
  | UnknownDefinition;

export interface Properties {
  active?: boolean;
}

export interface InstanceSnapshot<P extends Properties = Properties> {
  time: number;
  properties: P;
}

export interface Instance<P extends Properties = Properties> {
  kind: 'instance';
  id: number;
  definition: Definition;
  receivers: Instance[];
  senders: Instance[];
  contextReceivers: Instance[];
  contextSenders: Instance[];
  events: Event[];
  snapshots: InstanceSnapshot<P>[];
}

export interface Subscribe {
  kind: 'subscribe';
  time: number;
  sender: Instance;
  receiver: Instance;
}

export interface Unsubscribe {
  kind: 'unsubscribe';
  time: number;
  sender: Instance;
  receiver: Instance;
}

export interface NextNotification {
  kind: 'next';
  id: number;
  time: number;
  sender: Instance;
  receiver: Instance;
  value: Reference;
}

export interface ErrorNotification {
  kind: 'error';
  id: number;
  time: number;
  sender: Instance;
  receiver: Instance;
  error: Reference;
}

export interface CompleteNotification {
  kind: 'complete';
  id: number;
  time: number;
  sender: Instance;
  receiver: Instance;
}

export type Notification
  = NextNotification
  | ErrorNotification
  | CompleteNotification;

export interface SubjectNextCall {
  kind: 'subject-next';
  time: number;
  sender: Instance;
  receiver: Instance;
  value: Reference;
}

export interface SubjectErrorCall {
  kind: 'subject-error';
  time: number;
  sender: Instance;
  receiver: Instance;
  error: Reference;
}

export interface SubjectCompleteCall {
  kind: 'subject-complete';
  time: number;
  sender: Instance;
  receiver: Instance;
}

export type SubjectCall
  = SubjectNextCall
  | SubjectErrorCall
  | SubjectCompleteCall;

export interface ConnectCall {
  kind: 'connect';
  time: number;
  sender: undefined;
  receiver: Instance;
}

export type Call
  = SubjectCall
  | ConnectCall;

export type Event
  = Notification
  | Subscribe
  | Unsubscribe
  | Call;

export interface State {
  definitions: Index<Definition>;
  instances: Index<Instance>;
  notifications: Index<Notification>;
}
