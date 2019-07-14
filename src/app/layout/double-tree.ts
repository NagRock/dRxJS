import {Link, Node, treeLayout} from './tree';

export interface DoubleTreeLayout<T> {
  nodes: Node<T>[];
  links: Link<T>[];
  width: number;
  height: number;
}

export function doubleTreeLayout<T>(
  rootNode: T,
  getIncomingChildren: (node: T) => T[],
  getOutgoingChildren: (node: T) => T[],
  // direction: 'right'
): DoubleTreeLayout<T> {
  if (rootNode === undefined) {
    return {nodes: [], links: [], width: 0, height: 0};
  } else {
    const incoming = treeLayout(rootNode, getIncomingChildren);
    const outgoing = treeLayout(rootNode, getOutgoingChildren);
    const width = Math.max(incoming.width, outgoing.width);
    const height = incoming.height + outgoing.height;
    incoming.links.forEach((l) => {
      const {source, target} = l;
      l.source = target;
      l.target = source;
    });
    const incomingNodeOffset = incoming.nodes[0].x - width / 2;
    incoming.nodes.forEach((n) => {
      const {x, y} = n;
      n.x = width === 0 ? 0 : x / width - incomingNodeOffset;
      n.y = height === 0 ? 0 : (incoming.height - y) / height;
    });
    const outgoingNodeOffset = outgoing.nodes[0].x - width / 2;
    outgoing.nodes.forEach((n) => {
      const {x, y} = n;
      n.x = width === 0 ? 0 : x / width - outgoingNodeOffset;
      n.y = height === 0 ? 0 : 1 - (outgoing.height - y) / height;
    });

    const root = incoming.nodes[0];
    const duplicateRoot = outgoing.nodes[0];
    outgoing.links.forEach((l) => {
      if (l.source === duplicateRoot) {
        l.source = root;
      }
    });

    const nodes = [...incoming.nodes, ...outgoing.nodes.slice(1)];
    const links = [...incoming.links, ...outgoing.links];

    return {nodes, links, height, width};
  }
}
