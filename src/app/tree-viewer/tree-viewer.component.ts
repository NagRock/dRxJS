import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {StreamData} from '../../__instrument__/streams';
import {hierarchy, HierarchyPointLink, HierarchyPointNode, tree} from 'd3';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

interface IncomingFlowNode {
  stream: StreamData;
  inputs: IncomingFlowNode[];
  output: number;
}

interface FlowLayout {
  nodes: HierarchyPointNode<any>[];
  links: HierarchyPointLink<any>[];
}

function createIncomingFlowNode(stream: StreamData, output: number, streams: StreamData[]): IncomingFlowNode {
  const inputs = streams
    .filter((s) => s.subscribers.includes(stream.id))
    .map((s) => createIncomingFlowNode(s, stream.id, streams));
  return {
    stream,
    inputs,
    output,
  };
}

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
  private readonly margin = 80;

  readonly layout$: Observable<FlowLayout> = combineLatest(
    this.originSubject,
    this.streamsSubject,
  ).pipe(
    map(([origin, streams]) => {
      if (streams[origin] === undefined) {
        return {nodes: [], links: []};
      } else {
        const root = createIncomingFlowNode(streams[origin], undefined, streams);
        const nodes = hierarchy(root, (node) => node.inputs);
        const layoutResult = this.layout(nodes);
        return {
          nodes: layoutResult.descendants(),
          links: layoutResult.links(),
        };
      }
    })
  );


  @Input()
  width = 800;

  @Input()
  height = 600;

  @Input()
  set origin(origin: number) {
    this.originSubject.next(origin);
  }

  @Input()
  set streams(streams: StreamData[]) {
    this.streamsSubject.next(streams);
  }

  getX(node: HierarchyPointNode<any>): number {
    return this.margin + (1 - node.y) * (this.width - 2 * this.margin);
  }

  getY(node: HierarchyPointNode<any>): number {
    return this.margin + node.x * (this.height - 2 * this.margin);
  }
}
