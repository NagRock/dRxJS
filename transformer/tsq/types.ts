import { Node } from 'typescript';

export type Selector = (node: Node) => ReadonlyArray<Node>;

export type Matcher<T> = (target: T) => boolean;
