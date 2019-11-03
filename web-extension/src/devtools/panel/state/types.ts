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

export interface Task {
  kind: 'task';
  id: number;
  type: 'macroTask' | 'microTask' | 'eventTask';
  source: string;
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
  args: Reference[],
  position: SourcePosition;
  instances: Instance[];
}

export interface SubjectDefinition {
  kind: 'subject-definition';
  name: string;
  id: number;
  constructor: ObjectReference;
  args: Reference[],
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
  vtimestamp: number;
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
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
}

export interface Unsubscribe {
  kind: 'unsubscribe';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
}

export interface NextNotification {
  kind: 'next';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
  value: Reference;
}

export interface ErrorNotification {
  kind: 'error';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
  error: Reference;
}

export interface CompleteNotification {
  kind: 'complete';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
}

export type Notification
  = NextNotification
  | ErrorNotification
  | CompleteNotification;

export interface SubjectNextCall {
  kind: 'subject-next';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
  value: Reference;
}

export interface SubjectErrorCall {
  kind: 'subject-error';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
  error: Reference;
}

export interface SubjectCompleteCall {
  kind: 'subject-complete';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
}

export type SubjectCall
  = SubjectNextCall
  | SubjectErrorCall
  | SubjectCompleteCall;

export interface ConnectCall {
  kind: 'connect';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
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
  events: Index<Event>;
  lastTask: Task;
}
