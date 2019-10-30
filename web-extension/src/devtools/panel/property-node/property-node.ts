import {Observable} from 'rxjs';

export type PropertyType
  = { tag: 'null' }
  | { tag: 'undefined' }
  | { tag: 'boolean' }
  | { tag: 'number' }
  | { tag: 'string' }
  | { tag: 'symbol' }
  | { tag: 'bigint' }
  | { tag: 'object' }
  | { tag: 'array' }
  | { tag: 'function' }
  | { tag: 'decorated', prefix: string, suffix: string };

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
  value: string;
  type: PropertyType;
  primary: boolean;
}

export interface PropertyTreeNode {
  lazy: false;
  expandable: true;
  key: string;
  value: string;
  type: PropertyType;
  primary: boolean;
  children: Observable<PropertyNode[]>;
}

export type PropertyNode
  = PropertyLazyNode
  | PropertyLeafNode
  | PropertyTreeNode;
