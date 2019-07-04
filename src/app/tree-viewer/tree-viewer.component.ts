import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {hierarchy, HierarchyNode, HierarchyPointLink, HierarchyPointNode, tree} from 'd3';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';
import {EventModel, StreamModel} from '../model';
import {AnimationPlayer, buildAnimation} from './event-animations';

import * as SvgPanZoom from 'svg-pan-zoom';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewerComponent implements AfterViewInit {
  private readonly streamSubject = new BehaviorSubject<StreamModel>(undefined);
  private readonly layout = tree();
  private player: AnimationPlayer;
  instance: SvgPanZoom.Instance;

  private _activeSubscriptionIds = new Set<string>();
  _event: EventModel;

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

  @ViewChild('svg')
  readonly svgElementRef: ElementRef<SVGElement>;

  @ViewChild('g')
  readonly gElementRef: ElementRef<SVGGElement>;

  readonly width = 800;
  readonly height = 800;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {
  }

  @Input()
  set activeSubscriptionIds(ids: string[]) {
    this._activeSubscriptionIds = new Set<string>(ids);
  }

  @Input()
  set stream(stream: StreamModel) {
    this.streamSubject.next(stream);
  }

  get stream() {
    return this.streamSubject.getValue();
  }

  @Input()
  set event(event: EventModel | undefined) {
    console.log(event);
    this._event = event;
    Promise.resolve().then(() => {
      this.animateEvent(event);
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    // this.width = this.elementRef.nativeElement.clientWidth;
    // this.height = this.elementRef.nativeElement.clientHeight;
    // this.widthSubject.next(this.elementRef.nativeElement.clientWidth);
  }

  isNodeHighlighted(id: number) {
    return this._event !== undefined && (id === this._event.source.id || id === this._event.destination.id);
  }

  getX(node: HierarchyPointNode<any>, width: number): number {
    return margin + node.x * (this.width - 2 * margin);
  }

  getY(node: HierarchyPointNode<any>, height: number): number {
    return margin + node.y * (this.height - 2 * margin);
  }

  isNodeActive(node: HierarchyPointNode<any>) {
    return this._activeSubscriptionIds.has(node.data.id);
  }

  isLinkActive(link: HierarchyPointLink<any>) {
    return this.isNodeActive(link.source) && this.isNodeActive(link.target);
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
      links: layoutResult.links().map(({source, target}) => ({source: target, target: source})),
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

  private animateEvent(event: EventModel | undefined) {
    if (this.player !== undefined) {
      console.log('stop', this.player);
      this.player.stop();
    }

    if (event !== undefined) {
      this.player = buildAnimation(this.gElementRef.nativeElement, event, true);

      if (this.player !== undefined) {
        this.player.play();
      }
    } else {
      this.player = undefined;
    }
  }

  ngAfterViewInit(): void {
    this.instance = SvgPanZoom(this.svgElementRef.nativeElement, {
      beforePan: ((oldPan, newPan) => {
        const sizes = this.instance.getSizes() as any;
        const gutterWidth = sizes.viewBox.width / 2;
        const gutterHeight = sizes.viewBox.height / 2;
        const leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth;
        const rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom);
        const topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight;
        const bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);

        return {
          x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
          y: Math.max(topLimit, Math.min(bottomLimit, newPan.y)),
        };
      })
    });
  }
}
