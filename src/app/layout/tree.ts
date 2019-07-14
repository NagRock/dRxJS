import {hierarchy, HierarchyNode, tree} from 'd3-hierarchy';

export interface Node<T> {
  x: number;
  y: number;
  data: T;
}

export interface Link<T> {
  source: Node<T>;
  target: Node<T>;
}

export interface TreeLayout<T> {
  nodes: Node<T>[];
  links: Link<T>[];
  width: number;
  height: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export function isVerticalDirection(direction: Direction): boolean {
  switch (direction) {
    case 'up':
    case 'down':
      return true;
    default:
      return false;
  }
}

export function isHorizontalDirection(direction: Direction): boolean {
  switch (direction) {
    case 'left':
    case 'right':
      return true;
    default:
      return false;
  }
}

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
}

export function treeLayout<T>(
  rootNode: T,
  getChildren: (node: T) => T[],
  // direction: 'left' | 'right'
): TreeLayout<T> {
  const nodes = hierarchy<T>(rootNode, getChildren);
  const {width, height} = getTreeDimensions(nodes);
  const layoutResult = tree<T>().size([width, height])(nodes);
  return {
    nodes: layoutResult.descendants(),
    links: layoutResult.links(),
    width,
    height,
  };
}

const getTreeDimensions = (root: HierarchyNode<any>) => {
  const height = root.height;
  const width = Math.max(
    ...root.descendants()
      .reduce((widths, node) => {
        widths[node.height] = widths[node.height] + 1 || (widths[node.height] = 1);
        return widths;
      }, []),
  ) - 1;
  return {height, width};
};
