import {ObjectReference, Reference} from '@doctor-rxjs/events';
import {Set} from 'immutable';

export interface Index<T> {
  [index: number]: T;
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
  events: Event[];
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
  args: Reference[];
  position: SourcePosition;
  instances: Instance[];
}

export interface SubjectDefinition {
  kind: 'subject-definition';
  name: string;
  id: number;
  constructor: ObjectReference;
  args: Reference[];
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

export interface InstanceSnapshot {
  readonly vtimestamp: number;
  readonly receivers: Set<Instance>;
  readonly senders: Set<Instance>;
  readonly contextReceivers: Set<Instance>;
  readonly contextSenders: Set<Instance>;
}

export interface Instance {
  kind: 'instance';
  id: number;
  definition: Definition;
  events: Event[];
  snapshots: InstanceSnapshot[];
}

export interface Subscribe {
  kind: 'subscribe';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
  trigger: Event | undefined;
  triggered: Event[];
}

export interface Unsubscribe {
  kind: 'unsubscribe';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
  trigger: Event | undefined;
  triggered: Event[];
}

export interface NextNotification {
  kind: 'next';
  id: number;
  timestamp: number;
  vtimestamp: number;
  task: Task;
  sender: Instance;
  receiver: Instance;
  trigger: Event | undefined;
  triggered: Event[];
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
  trigger: Event | undefined;
  triggered: Event[];
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
  trigger: Event | undefined;
  triggered: Event[];
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
  trigger: Event | undefined;
  triggered: Event[];
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
  trigger: Event | undefined;
  triggered: Event[];
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
  trigger: Event | undefined;
  triggered: Event[];
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
  trigger: Event | undefined;
  triggered: Event[];
}

export type Call
  = SubjectCall
  | ConnectCall;

export type Event
  = Notification
  | Subscribe
  | Unsubscribe
  | Call;

export interface Model {
  definitions: Array<Definition>;
  instances: Array<Instance>;
  events: Array<Event>;
  tasks: Array<Task>;
  currentTask: Task | undefined;
}
