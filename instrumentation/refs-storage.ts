import {ObjectReference, Reference, Value, ValueReference} from '@drxjs/events';

export class RefsStorage {
  private nextRef = 0;

  constructor(
    private readonly refs: { [ref: number]: any },
  ) {
  }

  create(value: Value): ValueReference;
  create(object: Object): ObjectReference;
  create(value: any): Reference {
    switch (typeof value) {
      case 'undefined':
      case 'boolean':
      case 'number':
      case 'string':
      case 'symbol':
      case 'bigint':
        return {
          kind: 'value',
          value: value,
        };

      case 'object':
        if (value === null) {
          return {
            kind: 'value',
            value: null,
          };
        } else {
          return {
            kind: 'object',
            type: value instanceof Array ? 'array' : 'object',
            name: value.__proto__ ? value.__proto__.name : undefined,
            ref: this.store(value),
          };
        }
      case 'function':
        return {
          kind: 'object',
          type: 'function',
          name: value.name,
          ref: this.store(value),
        };
    }
  }

  private store(value: Object): number {
    const ref = this.nextRef++;
    this.refs[ref] = value;
    return ref;
  }
}

export function createRefsStorage() {
  const refs = (window as any).___dRxJS_refs = {};
  return new RefsStorage(refs);
}
