import { Node } from 'typescript';
import { getChildNodes } from './common';
import { matchAll, NodeMatcher } from './matchers/nodes';
import { Selector } from './types';

export const select = (...matchers: Selector[]): Selector =>
  (node: Node): ReadonlyArray<Node> => {
    let result: Node[] = [node];
    for (const matcher of matchers) {
      if (result.length === 0) {
        return [];
      } else {
        result = result.reduce((acc, n) => [...acc, ...matcher(n)], []);
      }
    }

    return result;
  };

export const children = (...matchers: NodeMatcher[]): Selector =>
  (node: Node): ReadonlyArray<Node> =>
    matchAll(getChildNodes(node), matchers);
