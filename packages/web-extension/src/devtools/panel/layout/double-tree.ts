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
  if (!rootNode) {
    return {nodes: [], links: [], width: 0, height: 0};
  } else {
    const incoming = treeLayout(rootNode, getIncomingChildren);
    const outgoing = treeLayout(rootNode, getOutgoingChildren);
    const {width: incomingWidth, height: incomingHeight} = incoming;
    const {width: outgoingWidth, height: outgoingHeight} = outgoing;

    const width = Math.max(incomingWidth, outgoingWidth);
    const height = incomingHeight + outgoingHeight - 1;
    incoming.links.forEach((l) => {
      const {source, target} = l;
      l.source = target;
      l.target = source;
    });
    const incomingNodeOffset = (incoming.nodes[0].x) - (width - 1) / 2;
    incoming.nodes.forEach((n) => {
      const {x, y} = n;
      n.x = (x - incomingNodeOffset);
      n.y = y + outgoingHeight - 1;
    });
    const outgoingNodeOffset = (outgoing.nodes[0].x) - (width - 1) / 2;
    outgoing.nodes.forEach((n) => {
      const {x, y} = n;
      n.x = (x - outgoingNodeOffset);
      n.y = outgoingHeight - 1 - y;
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
