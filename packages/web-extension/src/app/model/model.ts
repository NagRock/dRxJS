import {ObjectReference, Reference} from '@doctor-rxjs/events';
import {Set} from 'immutable';

export interface SourceFilePosition {
  file: string;
  line: number;
  column: number;
  functionName: string;
}

export interface SourceFileMarker {
  name: string;
  line: number;
  column: number;
  declarations: Declaration[];
}

export interface SourceFile {
  url: string;
  markers: SourceFileMarker[];
}

export interface Task {
  kind: 'task';
  id: number;
  type: 'macroTask' | 'microTask' | 'eventTask';
  source: string;
  events: Event[];
}

export interface ConstructorDeclaration {
  kind: 'constructor-declaration';
  name: string;
  id: number;
  ctor: ObjectReference;
  args: Reference[];
  position: SourceFilePosition;
  observable: ObservableFromConstructor;
}

export interface ObservableFromConstructor {
  kind: 'observable-from-constructor';
  id: number;
  constructor: ConstructorDeclaration;
  instances: Instance[];
}

export interface OperatorDeclaration {
  kind: 'operator-declaration';
  name: string;
  id: number;
  func: ObjectReference;
  args: Reference[];
  position: SourceFilePosition;
  observables: ObservableFromOperator[];
}

export interface ObservableFromOperator {
  kind: 'observable-from-constructor';
  id: number;
  source: Observable;
  operator: OperatorDeclaration;
  instances: Instance[];
}

export interface SubscribeDeclaration {
  kind: 'subscribe-declaration';
  name: string;
  id: number;
  args: Reference[];
  position: SourceFilePosition;
  observable: ObservableFromSubscribe;
}

export interface ObservableFromSubscribe {
  kind: 'observable-from-subscribe';
  id: number;
  source: Observable;
  subscribe: SubscribeDeclaration;
  instances: Instance[];
}

export type Declaration
  = ConstructorDeclaration
  | OperatorDeclaration
  | SubscribeDeclaration;

export type Observable
  = ObservableFromConstructor
  | ObservableFromOperator
  | ObservableFromSubscribe;

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
  observable: Observable;
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
  files: {
    [url: string]: SourceFile;
  };
  declarations: Declaration[];
  observables: Observable[];
  instances: Instance[];
  events: Event[];
  tasks: Task[];
  currentTask: Task | undefined;
}
