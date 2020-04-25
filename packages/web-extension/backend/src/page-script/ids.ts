let nextDeclarationId = 0;
let nextObservableId = 0;
let nextInstanceId = 0;
let nextEventId = 0;
let nextTaskId = 0;

export function getNextDeclarationId() {
  return nextDeclarationId++;
}

export function getNextObservableId() {
  return nextObservableId++;
}

export function getNextInstanceId() {
  return nextInstanceId++;
}

export function getNextEventId() {
  return nextEventId++;
}

export function getNextTaskId() {
  return nextTaskId++;
}
