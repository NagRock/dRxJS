import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Event, Instance} from '../state';
import {animationFrameScheduler, BehaviorSubject} from 'rxjs';
import {map, observeOn} from 'rxjs/operators';
import {changeDirection} from '../layout/tree';
import {DoubleTreeLayout, doubleTreeLayout} from '../layout/double-tree';
import {getHeight, getWidth} from './coords';
import {AnimationPlayer, buildAnimation} from './event-animations';

@Component({
  selector: 'app-tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['./tree-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewerComponent implements AfterViewInit {
  private readonly observableSubject = new BehaviorSubject<Instance>(undefined);
  private readonly eventSubject = new BehaviorSubject<Event>(undefined);
  private animation: AnimationPlayer;

  readonly layout$ = this.observableSubject.asObservable().pipe(
    map((observable) => doubleTreeLayout(
      observable,
      (node) => node.senders,
      node => node.receivers,
    )),
    map((layout) => changeDirection(layout, 'right')),
  );

  @ViewChild('svg')
  svgElementRef: ElementRef<SVGElement>;

  @Input('observable')
  set observableInput(observable: Instance) {
    this.observableSubject.next(observable);
  }

  @Input('event')
  set eventInput(event: Event) {
    this.eventSubject.next(event);
  }

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

  get observable() {
    return this.observableSubject.getValue();
  }

  getWidth(layout: DoubleTreeLayout<any>) {
    return getWidth(layout.width);
  }

  getHeight(layout: DoubleTreeLayout<any>) {
    return getHeight(layout.height);
  }
}
