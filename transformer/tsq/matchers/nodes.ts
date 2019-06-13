import { Node, SyntaxKind } from 'typescript';
import { getSiblingNodes } from '../common';
import { Matcher, Selector } from '../types';
import { matchesAll } from './core';

export type NodeMatcher = Matcher<Node> | SyntaxKind;

const normalizeMatcher = (matcher: NodeMatcher): Matcher<Node> =>
  SyntaxKind[matcher as SyntaxKind]
    ? (node: Node) => node.kind === matcher as SyntaxKind
    : matcher as Matcher<Node>;

const normalizeMatchers = (matchers: NodeMatcher[]): ReadonlyArray<Matcher<Node>> =>
  matchers.map(normalizeMatcher);

export const match = (nodes: ReadonlyArray<Node>, matcher: NodeMatcher): ReadonlyArray<Node> =>
  nodes.filter(normalizeMatcher(matcher));

export const matchAll = (nodes: ReadonlyArray<Node>, matchers: NodeMatcher[]): ReadonlyArray<Node> =>
  nodes.filter(matchesAll(...normalizeMatchers(matchers)));

export const has = (selector: Selector): Matcher<Node> =>
  (node: Node) => selector(node).length !== 0;

export const nthLastChild = (n: number = 0, ...matchers: NodeMatcher[]): Matcher<Node> =>
  (node: Node) => {
    const siblingNodes = matchAll(getSiblingNodes(node), matchers);

    return siblingNodes.length !== 0 && siblingNodes.indexOf(node) === siblingNodes.length - n - 1;
  };

export const lastChild = (...matchers: NodeMatcher[]): Matcher<Node> =>
  nthLastChild(0, ...matchers);
