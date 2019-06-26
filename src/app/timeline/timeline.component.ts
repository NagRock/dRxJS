import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {EventModel, StreamModel} from '../model';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';

function getIncomingEvents(stream: StreamModel): EventModel[] {
  return [
    ...stream.events.filter((e) => e.source === stream || e.destination === stream),
    ...stream.subscriptions.map((s) => getIncomingEvents(s)).reduce((result, x) => result.concat(...x), [])
  ];
}

function getOutgoingEvents(stream: StreamModel): EventModel[] {
  return [
    ...stream.events.filter((e) => e.source === stream || e.destination === stream),
    ...stream.subscribers.map((s) => getOutgoingEvents(s)).reduce((result, x) => result.concat(...x), [])
  ];
}

interface TimelineEvent {
  x: number;
  event: EventModel;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  private readonly streamSubject = new BehaviorSubject<StreamModel>(undefined);
  private readonly widthSubject = new BehaviorSubject<number>(this.elementRef.nativeElement.clientWidth);

  @Output()
  readonly eventClicked = new EventEmitter<EventModel>();

  @Output()
  readonly eventHighlighted = new EventEmitter<EventModel | undefined>();

  readonly height = 200;
  readonly margin = 100;
  readonly width$ = this.widthSubject.asObservable().pipe(delay(0, animationFrame));
  readonly events$ = this.streamSubject.asObservable()
    .pipe(
      map((stream) => {
        if (stream === undefined) {
          return [];
        } else {
          const events: EventModel[] = [...getIncomingEvents(stream), ...getOutgoingEvents(stream)];
          return events
            .sort((a, b) => a.id - b.id)
            .filter((item, i, arr) => !i || item.id !== arr[i - 1].id)
            .map((event, index): TimelineEvent => ({event, x: index / (events.length - 1)}));
        }
      })
    );

  constructor(
    private readonly elementRef: ElementRef,
  ) {
  }

  @Input()
  set stream(stream: StreamModel) {
    this.streamSubject.next(stream);
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.widthSubject.next(this.elementRef.nativeElement.clientWidth);
  }

  getEventTransform(event: TimelineEvent, width: number) {
    const ex = this.margin + event.x * (width - 2 * this.margin);
    const ey = this.height / 2;

    return `translate(${ex},${ey})`;
  }
}
