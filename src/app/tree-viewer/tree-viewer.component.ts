import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {StreamData} from '../../__instrument__/streams';
import {hierarchy, HierarchyNode, HierarchyPointLink, HierarchyPointNode, tree} from 'd3';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

interface FlowToNode {
  stream: StreamData;
  inputs: FlowToNode[];
  output: number;
}

interface FlowFromNode {
  stream: StreamData;
  input: number;
  outputs: FlowFromNode[];
}

interface FlowLayout {
  nodes: HierarchyPointNode<any>[];
  links: HierarchyPointLink<any>[];
  width: number;
  height: number;
}

function flowToNode(stream: StreamData, output: number, streams: StreamData[]): FlowToNode {
  const inputs = streams
    .filter((s) => s.subscribers.includes(stream.id))
    .map((s) => flowToNode(s, stream.id, streams));
  return {
    stream,
    inputs,
    output,
  };
}

function flowFromNode(stream: StreamData, input: number, streams: StreamData[]): FlowFromNode {
  const outputs = stream.subscribers
    .map((s) => flowFromNode(streams[s], stream.id, streams));
  return {
    stream,
    input,
    outputs,
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

const margin = 100;
const distance = 2 * margin;

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeViewerComponent {
  private readonly originSubject = new BehaviorSubject<number>(0);
  private readonly streamsSubject = new BehaviorSubject<StreamData[]>([]);
  private readonly layout = tree();

  readonly layout$: Observable<FlowLayout> = combineLatest(
    this.originSubject,
    this.streamsSubject,
  ).pipe(
    map(([origin, streams]) => {
      if (streams[origin] === undefined) {
        return {nodes: [], links: [], width: 0, height: 0};
      } else {
        const incoming = this.layoutFlowToNode(streams, origin);
        const outgoing = this.layoutFlowFromNode(streams, origin);
        const width = Math.max(incoming.width, outgoing.width);
        const height = incoming.height + outgoing.height;
        const incomingNodeOffset = incoming.nodes[0].x - width / 2;
        incoming.nodes.forEach((n) => {
          const {x, y} = n;
          n.x = height === 0 ? 0 : (incoming.height - y) / height;
          n.y = width === 0 ? 0 : x / width - incomingNodeOffset;
        });
        const outgoingNodeOffset = outgoing.nodes[0].x - width / 2;
        outgoing.nodes.forEach((n) => {
          const {x, y} = n;
          n.x = height === 0 ? 0 : 1 - (outgoing.height - y) / height;
          n.y = width === 0 ? 0 : x / width - outgoingNodeOffset;
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

        return {nodes, links, height: width, width: height};
      }
    }),
  );

  @Output()
  readonly originChange = new EventEmitter<number>();

  @Input()
  width = 800;

  @Input()
  height = 600;

  @Input()
  set origin(origin: number) {
    this.originSubject.next(origin);
  }

  get origin(): number {
    return this.originSubject.getValue();
  }

  @Input()
  set streams(streams: StreamData[]) {
    this.streamsSubject.next(streams);
  }

  getX(node: HierarchyPointNode<any>, width: number): number {
    return margin + node.x * (width - 2 * margin);
  }

  getY(node: HierarchyPointNode<any>, height: number): number {
    return margin + node.y * (height - 2 * margin);
  }

  selectStream(stream: StreamData) {
    this.origin = stream.id;
    this.originChange.emit(stream.id);
  }

  getLinkPath$(link: HierarchyPointLink<any>, height: number) {
    return of(this.getLinkPath(link, this.width, this.getHeight(height)));
  }

  getNodeTransform$(node: HierarchyPointNode<any>, height: number) {
    return of(this.getNodeTransform(node, this.width, this.getHeight(height)));
  }

  getHeight(height: number) {
    return (height + 1) * distance;
  }

  private layoutFlowToNode(streams, origin): FlowLayout {
    const root = flowToNode(streams[origin], undefined, streams);
    const nodes = hierarchy(root, (node) => node.inputs);
    const {width, height} = getTreeDimensions(nodes);
    const layoutResult = this.layout.size([width, height])(nodes);
    return {
      nodes: layoutResult.descendants(),
      links: layoutResult.links(),
      width,
      height,
    };
  }

  private layoutFlowFromNode(streams, origin): FlowLayout {
    const root = flowFromNode(streams[origin], undefined, streams);
    const nodes = hierarchy(root, (node) => node.outputs);
    const {width, height} = getTreeDimensions(nodes);
    const layoutResult = this.layout.size([width, height])(nodes);
    return {
      nodes: layoutResult.descendants(),
      links: layoutResult.links(),
      width,
      height,
    };
  }

  private getLinkPath(link: HierarchyPointLink<any>, width: number, height: number) {
    const sx = this.getX(link.source, width);
    const sy = this.getY(link.source, height);
    const tx = this.getX(link.target, width);
    const ty = this.getY(link.target, height);
    return `M${sx},${sy}C${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`;
  }

  private getNodeTransform(node: HierarchyPointNode<any>, width: number, height: number) {
    const nx = this.getX(node, width);
    const ny = this.getY(node, height);

    return `translate(${nx},${ny})`;
  }
}
