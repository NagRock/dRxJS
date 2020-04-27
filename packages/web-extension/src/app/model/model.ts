import {Set} from 'immutable';

export class ValueRef {
  constructor(
    readonly value: any,
  ) {
  }
}

export class ObjectRef {
  constructor(
    readonly type: 'object' | 'array' | 'function',
    readonly name: string,
    readonly size: number | undefined,
    readonly ref: number,
  ) {
  }
}

export class LazyRef {
  constructor(
    readonly ref: number,
    readonly property: string,
  ) {
  }
}

export class ObservableRef {
  constructor(
    readonly id: number,
  ) {
  }
}

export type Ref
  = ValueRef
  | ObjectRef
  | LazyRef
  | ObservableRef;

export class SourceFilePosition {
  constructor(
    readonly file: string,
    readonly line: number,
    readonly column: number,
    readonly functionName: string,
  ) {
  }
}

export class SourceFileMarker {
  constructor(
    readonly name: string,
    readonly line: number,
    readonly column: number,
    readonly declarations: Declaration[],
  ) {
  }
}

export class SourceFile {
  constructor(
    readonly url: string,
    readonly markers: SourceFileMarker[],
  ) {
  }
}

export class Task {
  constructor(
    readonly id: number,
    readonly type: 'macroTask' | 'microTask' | 'eventTask',
    readonly source: string,
    readonly events: Event[],
  ) {
  }
}

export class ConstructorDeclaration {
  constructor(
    readonly name: string,
    readonly id: number,
    readonly ctor: Ref,
    readonly args: Ref[],
    readonly position: SourceFilePosition,
    public observable: ObservableFromConstructor,
  ) {
  }
}

export class ObservableFromConstructor {
  constructor(
    readonly id: number,
    readonly constructor: ConstructorDeclaration,
    readonly instances: Instance[],
  ) {
  }
}

export class OperatorDeclaration {
  constructor(
    readonly name: string,
    readonly id: number,
    readonly func: Ref,
    readonly args: Ref[],
    readonly position: SourceFilePosition,
    readonly observables: ObservableFromOperator[],
  ) {
  }
}

export class ObservableFromOperator {
  constructor(
    readonly id: number,
    readonly source: Observable,
    readonly operator: OperatorDeclaration,
    readonly instances: Instance[],
  ) {
  }
}

export class SubscribeDeclaration {
  constructor(
    readonly name: string,
    readonly id: number,
    readonly args: Ref[],
    readonly position: SourceFilePosition,
    public observable: ObservableFromSubscribe,
  ) {
  }
}

export class ObservableFromSubscribe {
  constructor(
    readonly id: number,
    readonly source: Observable,
    readonly subscribe: SubscribeDeclaration,
    readonly instances: Instance[],
  ) {
  }
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

export class Instance {
  constructor(
    readonly id: number,
    readonly observable: Observable,
    readonly events: Event[],
    readonly snapshots: InstanceSnapshot[],
  ) {
  }
}

export class Subscribe {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: Instance,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
  ) {
  }
}

export class Unsubscribe {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: Instance,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
  ) {
  }
}

export class NextNotification {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: Instance,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
    readonly value: Ref,
  ) {
  }
}

export class ErrorNotification {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: Instance,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
    readonly error: Ref,
  ) {
  }
}

export class CompleteNotification {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: Instance,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
  ) {
  }
}

export type Notification
  = NextNotification
  | ErrorNotification
  | CompleteNotification;

export class SubjectNextCall {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: Instance,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
    readonly value: Ref,
  ) {
  }
}

export class SubjectErrorCall {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: Instance,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
    readonly error: Ref,
  ) {
  }
}

export class SubjectCompleteCall {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: Instance,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
  ) {
  }
}

export type SubjectCall
  = SubjectNextCall
  | SubjectErrorCall
  | SubjectCompleteCall;

export class ConnectCall {
  constructor(
    readonly id: number,
    readonly timestamp: number,
    readonly vtimestamp: number,
    readonly task: Task,
    readonly sender: undefined,
    readonly receiver: Instance,
    readonly trigger: Event | undefined,
    readonly triggered: Event[],
  ) {
  }
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
