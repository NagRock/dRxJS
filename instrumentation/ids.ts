let nextDefinitionId = 0;
let nextInstanceId = 0;
let nextEventId = 0;
let nextTaskId = 0;

export function getNextDefinitionId() {
  return nextDefinitionId++;
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
