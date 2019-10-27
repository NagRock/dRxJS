import {ObjectProperty, ObjectReference, Reference, Value, ValueReference} from '@drxjs/events';


export class RefsStorage {
  private readonly refs: { [ref: number]: any } = {};
  private nextRef = 0;

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

  get(ref: number): ObjectProperty[] {
    const object = this.load(ref);
    const enumerableProperties: ObjectProperty[] = [];
    const properties: ObjectProperty[] = [];
    const accessors: ObjectProperty[] = [];

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
            enumerableProperties.push({name, reference: this.create(object[name]), enumerable}); // todo: lazy eval
            accessors.push({name: `get ${name}`, reference: this.create(get), enumerable: false});
          }
          if (set !== undefined) {
            accessors.push({name: `set ${name}`, reference: this.create(set), enumerable: false});
          }
        }
      });

    const proto: ObjectProperty = {name: '__proto__', reference: this.create(Object.getPrototypeOf(object)), enumerable: false};

    return [...enumerableProperties, ...properties, ...accessors, proto];
  }

  private store(value: Object): number {
    const ref = this.nextRef++;
    this.refs[ref] = value;
    return ref;
  }

  private load(ref: number): Object {
    return this.refs[ref];
  }
}

export function createRefsStorage() {
  if (!(window as any).__doctor__refs) {
    (window as any).__doctor__refs = new RefsStorage();
  }

  return (window as any).__doctor__refs;
}
