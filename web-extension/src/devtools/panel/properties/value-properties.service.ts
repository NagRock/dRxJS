import {Injectable} from '@angular/core';
import {PropertyLeafNode, PropertyNode, PropertyTreeNode, PropertyType} from '../property-node/property-node';
import {of} from 'rxjs';

function getValue(value: any) {
  return typeof value === 'symbol' ? value.toString() : `${value}`;
}

function getValueType(value: any): PropertyType {
  if (value === null) {
    return 'null';
  } else {
    return typeof value;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ValuePropertiesService {

  fromValue(key: string, primary: boolean, value: any): PropertyLeafNode {
    return {
      lazy: false,
      expandable: false,
      key,
      primary,
      value: getValue(value),
      type: getValueType(value),
    };
  }
}
