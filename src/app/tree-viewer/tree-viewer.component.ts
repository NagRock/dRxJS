import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {hierarchy, HierarchyNode, HierarchyPointLink, HierarchyPointNode, tree} from 'd3';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';
import {EventModel, StreamModel} from '../model';

interface FlowLayout {
  nodes: HierarchyPointNode<any>[];
  links: HierarchyPointLink<any>[];
  width: number;
  height: number;
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
  private readonly streamSubject = new BehaviorSubject<StreamModel>(undefined);
  private readonly widthSubject = new BehaviorSubject<number>(this.elementRef.nativeElement.clientWidth);
  private readonly layout = tree();

  readonly width$ = this.widthSubject.asObservable().pipe(delay(0, animationFrame));
  readonly layout$: Observable<FlowLayout> = this.streamSubject
    .asObservable()
    .pipe(
      map((stream: StreamModel) => {
        if (stream === undefined) {
          return {nodes: [], links: [], width: 0, height: 0};
        } else {
          const incoming = this.layoutFlowToNode(stream);
          const outgoing = this.layoutFlowFromNode(stream);
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
  readonly streamChange = new EventEmitter<StreamModel>();

  constructor(
    private readonly elementRef: ElementRef,
  ) {
  }

  @Input()
  set stream(stream: StreamModel) {
    this.streamSubject.next(stream);
  }

  get stream() {
    return this.streamSubject.getValue();
  }

  @Input()
  event: EventModel | undefined;

  @HostListener('window:resize')
  onWindowResize() {
    this.widthSubject.next(this.elementRef.nativeElement.clientWidth);
  }

  isNodeHighlighted(id: number) {
    return this.event !== undefined && (id === this.event.source.id || id === this.event.destination.id);
  }

  getX(node: HierarchyPointNode<any>, width: number): number {
    return margin + node.x * (width - 2 * margin);
  }

  getY(node: HierarchyPointNode<any>, height: number): number {
    return margin + node.y * (height - 2 * margin);
  }

  selectStream(stream: StreamModel) {
    this.stream = stream;
    this.streamChange.emit(stream);
  }

  getHeight(height: number) {
    return (height + 1) * distance;
  }

  getLinkPath(link: HierarchyPointLink<any>, width: number, height: number) {
    const sx = this.getX(link.source, width);
    const sy = this.getY(link.source, height);
    const tx = this.getX(link.target, width);
    const ty = this.getY(link.target, height);
    return `M${sx},${sy}C${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`;
  }

  getNodeTransform(node: HierarchyPointNode<any>, width: number, height: number) {
    const nx = this.getX(node, width);
    const ny = this.getY(node, height);

    return `translate(${nx},${ny})`;
  }

  private layoutFlowToNode(stream: StreamModel): FlowLayout {
    const nodes = hierarchy(stream, (node) => node.subscriptions);
    const {width, height} = getTreeDimensions(nodes);
    const layoutResult = this.layout.size([width, height])(nodes);
    return {
      nodes: layoutResult.descendants(),
      links: layoutResult.links(),
      width,
      height,
    };
  }

  private layoutFlowFromNode(stream: StreamModel): FlowLayout {
    const nodes = hierarchy(stream, (node) => node.subscribers);
    const {width, height} = getTreeDimensions(nodes);
    const layoutResult = this.layout.size([width, height])(nodes);
    return {
      nodes: layoutResult.descendants(),
      links: layoutResult.links(),
      width,
      height,
    };
  }
}
