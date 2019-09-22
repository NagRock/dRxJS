import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Event, Instance} from '../state';
import {animationFrameScheduler, asapScheduler, BehaviorSubject, combineLatest} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, observeOn, throttleTime} from 'rxjs/operators';
import {changeDirection} from '../layout/tree';
import {doubleTreeLayout} from '../layout/double-tree';
import {getHeight, getWidth} from './coords';
import {AnimationPlayer, buildAnimation} from './event-animations';
import * as R from 'ramda';
import {InstanceLayout} from './types';

function getProperties(instance: Instance, time: number) {
  const snapshot = R.findLast((s) => s.time <= time, instance.snapshots);
  return snapshot !== undefined ? snapshot.properties : {};
}

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewerComponent implements AfterViewInit {
  private readonly instanceSubject = new BehaviorSubject<Instance>(undefined);
  private readonly eventSubject = new BehaviorSubject<Event>(undefined);
  private animation: AnimationPlayer;

  readonly layout$ = this.instanceSubject.asObservable().pipe(
    map((observable) => doubleTreeLayout(
      observable,
      (node) => node.senders,
      node => node.receivers,
    )),
    map((layout) => changeDirection(layout, 'right')),
  );
  readonly event$ = this.eventSubject.asObservable().pipe(
    distinctUntilChanged(),
  );
  readonly state$ = combineLatest([
    this.layout$,
    this.event$,
  ]).pipe(
    debounceTime(0, asapScheduler),
    map(([layout, event]): InstanceLayout => {
      const time = event ? event.time : 0;

      const nodes = layout.nodes.map((node) => ({
        x: node.x,
        y: node.y,
        instance: node.data,
        properties: getProperties(node.data, time),
      }));
      const indexedNodes = R.indexBy((node: any) => String(node.instance.id), nodes);
      const links = layout.links.map((link) => {
        return ({
          source: indexedNodes[link.source.data.id],
          target: indexedNodes[link.target.data.id],
        });
      });

      return {
        ...layout,
        nodes,
        links,
      };
    })
  );

  @ViewChild('svg')
  svgElementRef: ElementRef<SVGElement>;

  @Input('instance')
  set instanceInput(instance: Instance) {
    this.instanceSubject.next(instance);
  }

  @Input('event')
  set eventInput(event: Event) {
    this.eventSubject.next(event);
  }

  @Output()
  readonly instanceChange = new EventEmitter<Instance>();

  ngAfterViewInit(): void {
    this.eventSubject
      .pipe(observeOn(animationFrameScheduler))
      .subscribe((event) => {
        if (this.animation) {
          this.animation.stop();
        }
        if (event) {
          this.animation = buildAnimation(this.svgElementRef.nativeElement, event, true);
          if (this.animation) {
            this.animation.play();
          }
        }
      });
  }

  get instance() {
    return this.instanceSubject.getValue();
  }

  getWidth(layout: InstanceLayout) {
    return getWidth(layout.width);
  }

  getHeight(layout: InstanceLayout) {
    return getHeight(layout.height);
  }

  instanceClicked(instance: Instance) {
    this.instanceChange.emit(instance);
  }
}
