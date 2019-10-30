import {Injectable} from '@angular/core';
import {ReferencePropertiesService} from './reference-properties.service';
import {PropertyLeafNode, PropertyNode, PropertyTreeNode} from '../property-node/property-node';
import {Definition, Event, Instance} from '../state';
import {defer, of} from 'rxjs';
import {ValuePropertiesService} from './value-properties.service';
import {Reference} from '@drxjs/events';

function getEventName(event: Event) {
  return event.kind.replace(/-/g, ' ').replace(/^./, (s) => s.toUpperCase());
}

@Injectable({
  providedIn: 'root',
})
export class StatePropertiesService {

  constructor(
    private readonly valuePropertiesService: ValuePropertiesService,
    private readonly referencePropertiesService: ReferencePropertiesService,
  ) {
  }

  fromEvent(key: string, primary: boolean, event: Event): PropertyTreeNode {
    return {
      lazy: false,
      expandable: true,
      key,
      primary,
      value: getEventName(event),
      suffix: 'id' in event ? ` #${event.id}` : '',
      type: 'decorated',
      children: of(this.getEventChildren(event)),
    };
  }

  fromInstance(key: string, primary: boolean, instance: Instance): PropertyTreeNode {
    return {
      lazy: false,
      expandable: true,
      key,
      primary,
      value: instance.definition.name,
      suffix: ` #${instance.id}`,
      type: 'decorated',
      children: of(this.getInstanceChildren(instance)),
    };
  }

  fromDefinition(key: string, primary: boolean, definition: Definition): PropertyTreeNode {
    return {
      lazy: false,
      expandable: true,
      key,
      primary,
      value: definition.name,
      prefix: `def `,
      suffix: ` #${definition.id}`,
      type: 'decorated',
      children: of(this.getDefinitionChildren(definition)),
    };
  }

  private getEventChildren(event: Event): PropertyNode[] {
    const children: PropertyNode[] = [];

    if ('id' in event) {
      children.push(this.valuePropertiesService.fromValue('id', true, event.id));
    }
    if ('value' in event) {
      children.push(this.referencePropertiesService.fromReference('value', true, event.value));
    }
    if ('error' in event) {
      children.push(this.referencePropertiesService.fromReference('error', true, event.error));
    }
    children.push(this.fromInstance('sender', true, event.sender));
    children.push(this.fromInstance('receiver', true, event.receiver));

    return children;
  }

  private getInstanceChildren(instance: Instance): PropertyNode[] {
    const children: PropertyNode[] = [];

    children.push(this.valuePropertiesService.fromValue('id', true, instance.id));
    children.push(this.fromDefinition('definition', true, instance.definition));
    children.push(this.fromArray('senders', true, instance.senders, (key, value) => this.fromInstance(key, true, value)));
    children.push(this.fromArray('receivers', true, instance.receivers, (key, value) => this.fromInstance(key, true, value)));
    children.push(this.fromArray('contextSenders', true, instance.contextSenders, (key, value) => this.fromInstance(key, true, value)));
    children.push(this.fromArray('contextReceivers', true, instance.contextReceivers, (key, value) => this.fromInstance(key, true, value)));
    children.push(this.fromArray('events', true, instance.events, (key, value) => this.fromEvent(key, true, value)));

    return children;
  }

  private getDefinitionChildren(definition: Definition): PropertyNode[] {
    const children: PropertyNode[] = [];

    children.push(this.valuePropertiesService.fromValue('id', true, definition.id));
    children.push(this.valuePropertiesService.fromValue('name', true, definition.name));
    children.push(this.valuePropertiesService.fromValue('position', true, definition.position)); // todo: add navigation
    if ('function' in definition) {
      children.push(this.referencePropertiesService.fromReference('position', true, definition.function));
    }
    if ('constructor' in definition) {
      children.push(this.referencePropertiesService.fromReference('position', true, definition.constructor as Reference));
    }
    if ('args' in definition) {
      children.push(this.fromArray('position', true, definition.args, (key, value) => this.referencePropertiesService.fromReference(key, true, value)));
    }
    if ('instances' in definition) {
      children.push(this.fromArray('position', true, definition.instances, (key, value) => this.fromInstance(key, true, value)));
    }

    return children;
  }

  private fromArray<T>(key: string, primary: boolean, array: T[], mapper: (key: string, value: T) => PropertyNode): PropertyLeafNode | PropertyTreeNode {
    if (array.length !== 0) {
      return {
        lazy: false,
        expandable: true,
        key,
        primary,
        value: 'Array',
        type: 'array',
        prefix: `(${array.length}) `,
        children: defer(() => of(array.map((value, index) => mapper(`${index}`, value)))),
      };
    } else {
      return {
        lazy: false,
        expandable: false,
        key,
        primary,
        value: 'Array',
        type: 'array',
        prefix: `(${array.length}) `,
      };
    }
  }
}
