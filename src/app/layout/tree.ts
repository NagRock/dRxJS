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

function changeDirectionToRight<T>(layout: TreeLayout<T>): TreeLayout<T> {
  const {width, height} = layout;
  layout.width = height;
  layout.height = width;

  layout.nodes.forEach((node) => {
    const {x, y} = node;
    node.x = y;
    node.y = x;
  });

  return layout;
}

export function changeDirection<T>(layout: TreeLayout<T>, direction: Direction): TreeLayout<T> {
  switch (direction) {
    case 'down':
      return layout;
    case 'right':
      return changeDirectionToRight(layout);
    default:
      throw new Error(`Direction not supported: '${direction}'`);
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

  layoutResult.descendants().forEach((node) => {
    node.x = node.x * width;
    node.y = node.y * height;
  });

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
