import {LazyReference, Property, ObjectReference, Reference, Value, ValueReference} from '@doctor-rxjs/events';


export class RefsStorage {
  private readonly refs: { [ref: number]: any } = {};
  private nextRef = 0;

  create(value: Value): ValueReference;
  create(object: object): ObjectReference;
  create(value: any): Reference {
    switch (typeof value) {
      case 'undefined':
      case 'boolean':
      case 'number':
      case 'string':
      case 'bigint':
        return {
          kind: 'value',
          value,
        };
      case 'symbol':
        return {
          kind: 'value',
          value: `Symbol(${String(value)})`
        };
      case 'object':
        if (value === null) {
          return {
            kind: 'value',
            value: null,
          };
        } else if (value.__doctor__observable_id !== undefined) {
          return {
            kind: 'observable',
            id: value.__doctor__observable_id,
          };
        } else {
          return {
            kind: 'object',
            type: value instanceof Array ? 'array' : 'object',
            name: value.constructor ? value.constructor.name : undefined,
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

  get(ref: number): Property[] {
    const object = this.load(ref);
    const enumerableProperties: Property[] = [];
    const properties: Property[] = [];
    const accessors: Property[] = [];

    Object.entries(Object.getOwnPropertyDescriptors(object))
      .forEach(([name, descriptor]) => {
        if (descriptor.hasOwnProperty('value')) {
          const {value, enumerable} = descriptor;
          if (enumerable) {
            enumerableProperties.push({name, reference: this.create(value), enumerable: true});
          } else {
            properties.push({name, reference: this.create(value), enumerable: false});
          }
          return enumerableProperties;
        } else {
          const {get, set, enumerable} = descriptor;
          if (get !== undefined) {
            const lazy: LazyReference = {kind: 'lazy', ref, property: name};
            enumerableProperties.push({name, reference: lazy, enumerable});
            accessors.push({name: `get ${name}`, reference: this.create(get), enumerable: false});
          }
          if (set !== undefined) {
            accessors.push({name: `set ${name}`, reference: this.create(set), enumerable: false});
          }
        }
      });

    const proto: Property = {name: '__proto__', reference: this.create(Object.getPrototypeOf(object)), enumerable: false};

    return [...enumerableProperties, ...properties, ...accessors, proto];
  }

  getLazyProperty(ref: number, property: string): Reference {
    return this.create(this.load(ref)[property]);
  }

  private store(value: object): number {
    const ref = this.nextRef++;
    // todo: implement TTL for refs
    this.refs[ref] = value;
    return ref;
  }

  private load(ref: number): object {
    return this.refs[ref];
  }
}

export function createRefsStorage() {
  return new RefsStorage();
}
