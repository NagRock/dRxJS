import {Observable} from 'rxjs';

export type PropertyType
  = 'null'
  | 'undefined'
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'bigint'
  | 'object'
  | 'array'
  | 'function'
  | 'decorated';

export interface PropertyLazyNode {
  lazy: true;
  key: string;
  primary: boolean;

  eval(): Observable<PropertyNode>;
}

export interface PropertyLeafNode {
  lazy: false;
  expandable: false;
  key: string;
  primary: boolean;
  value: string;
  type: PropertyType;
  prefix?: string;
  suffix?: string;
}

export interface PropertyTreeNode {
  lazy: false;
  expandable: true;
  key: string;
  primary: boolean;
  value: string;
  type: PropertyType;
  prefix?: string;
  suffix?: string;
  children: Observable<PropertyNode[]>;
}

export type PropertyNode
  = PropertyLazyNode
  | PropertyLeafNode
  | PropertyTreeNode;
