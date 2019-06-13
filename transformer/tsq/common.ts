import { Node, SyntaxKind } from 'typescript';

/**
 * Returns `node`s direct children. If the child is `SyntaxList`, expands it to it's children (recursively).
 */
export const getChildNodes = (node: Node): Node[] => {
  const children = node.getChildren();

  return children.reduce(
    (acc, child) => [...acc, ...(child.kind === SyntaxKind.SyntaxList
      ? getChildNodes(child)
      : [child])],
    []);
};

/**
 * Returns 'node`s parent. If the parent is `SyntaxList`, returns it's parents (recursively).
 */
export const getParentNode = (node: Node): Node => {
  if (node.parent.kind === SyntaxKind.SyntaxList) {
    return getParentNode(node.parent);
  } else {
    return node.parent;
  }
};

export const getSiblingNodes = (node: Node): Node[] =>
  getChildNodes(getParentNode(node));
