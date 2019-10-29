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
  | ['decorated', {prefix: string, suffix: string}];

export interface PropertiesTreeNode {
  isLazy(): boolean;

  getKey(): string;

  getValue(): string;

  getType(): PropertyType;

  isPrimary(): boolean;

  isExpandable(): boolean;

  getChildren(): Observable<PropertiesTreeNode[]>;

  eval(): Observable<void>;
}
