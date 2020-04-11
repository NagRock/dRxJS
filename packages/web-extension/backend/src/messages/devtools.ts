export const enum DevtoolsMessageType {
  READY = 'devtools:ready',
}

export interface DevtoolsReady {
  message: DevtoolsMessageType.READY;
}

export type DevtoolsMessage
  = DevtoolsReady;
