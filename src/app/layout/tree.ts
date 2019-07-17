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
    node.x = height - 1 - y;
    node.y = width - 1 - x;
  });

  return layout;
}

export function changeDirection<T>(layout: TreeLayout<T>, direction: Direction): TreeLayout<T> {
  switch (direction) {
    case 'up':
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
  const layoutResult = tree<T>()
    .size([width - 0, height - 1])
    .separation(() => 1)
    (nodes);

  return {
    nodes: layoutResult.descendants(),
    links: layoutResult.links(),
    width,
    height,
  };
}

const getTreeDimensions = (root: HierarchyNode<any>) => {
  const height = root.height + 1;
  const width = Math.max(
    ...root.descendants()
      .reduce((widths, node) => {
        widths[node.height] = widths[node.height] + 1 || (widths[node.height] = 1);
        return widths;
      }, []),
  );
  return {height, width};
};
