import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {PropertyComponentClass, PROPERTY_VALUE} from '../property';

class LazyProperty {
  constructor(
    readonly target: object,
    readonly property: string,
  ) {
  }
}

interface Prop {
  name: string;
  value: any;
  enumerable: boolean;
}

@PropertyComponentClass()
@Component({
  selector: 'dr-default-property',
  templateUrl: './default-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultPropertyComponent {

  static readonly TEST = () => 0;

  type: 'value' | 'object' | 'array' | 'function';
  properties?: Prop[];

  constructor(
    @Inject(PROPERTY_VALUE) readonly value: any,
  ) {
    this.type = this.getType();
    this.properties = this.type !== 'value' ? this.getProperties() : undefined;
  }

  private getType(): 'value' | 'object' | 'array' | 'function' {
    switch (typeof this.value) {
      case 'undefined':
      case 'boolean':
      case 'number':
      case 'string':
      case 'symbol':
      case 'bigint':
        return 'value';
      case 'object':
        if (this.value === null) {
          return 'value';
        } else if (Array.isArray(this.value)) {
          return 'array';
        } else {
          return 'object';
        }
      case 'function':
        return 'function';
    }
  }

  private getProperties(): Prop[] {
    const object = this.value;
    const enumerableProperties: Prop[] = [];
    const properties: Prop[] = [];
    const accessors: Prop[] = [];

    Object.entries(Object.getOwnPropertyDescriptors(object))
      .forEach(([name, descriptor]) => {
        if (descriptor.hasOwnProperty('value')) {
          const {value, enumerable} = descriptor;
          if (enumerable) {
            enumerableProperties.push({name, value, enumerable: true});
          } else {
            properties.push({name, value, enumerable: false});
          }
          return enumerableProperties;
        } else {
          const {get, set, enumerable} = descriptor;
          if (get !== undefined) {
            const lazy = new LazyProperty(object, name);
            enumerableProperties.push({name, value: lazy, enumerable});
            accessors.push({name: `get ${name}`, value: get, enumerable: false});
          }
          if (set !== undefined) {
            accessors.push({name: `set ${name}`, value: set, enumerable: false});
          }
        }
      });

    const proto: Prop = {name: '__proto__', value: Object.getPrototypeOf(object), enumerable: false};

    return [...enumerableProperties, ...properties, ...accessors, proto];
  }

}
