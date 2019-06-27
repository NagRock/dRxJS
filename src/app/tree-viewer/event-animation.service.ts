import {Injectable} from '@angular/core';
import {animate, AnimationBuilder, AnimationPlayer, style} from '@angular/animations';
import {EventModel} from '../model';

export interface EventAnimationPlayer {
  play(): void;

  stop(): void;
}

export class InfiniteAnimationPlayer implements EventAnimationPlayer {

  private player: AnimationPlayer;
  private playing = false;

  constructor(
    private readonly factory: () => AnimationPlayer,
  ) {
  }

  play(): void {
    this.stop();
    this.player = this.factory();
    this.player.onDone(() => {
      if (this.playing) {
        this.play();
      }
    });
    this.player.play();
    this.playing = true;
  }

  stop(): void {
    if (this.player !== undefined) {
      this.player.destroy();
      this.player = undefined;
      this.playing = false;
    }
  }
}

class FiniteAnimationPlayer implements EventAnimationPlayer {

  private player: AnimationPlayer;

  constructor(
    private readonly factory: () => AnimationPlayer,
  ) {
  }

  play(): void {
    this.stop();
    this.player = this.factory();
    this.player.play();
  }

  stop(): void {
    if (this.player !== undefined) {
      this.player.destroy();
    }
  }
}

@Injectable()
export class EventAnimationService {

  constructor(
    private readonly animationBuilder: AnimationBuilder,
  ) {
  }

  buildAnimation(svg: SVGElement, event: EventModel, loop: boolean) {
    switch (event.kind) {
      case 'subscribe':
        return this.buildSubscribeAnimation(svg, event, loop);
      case 'unsubscribe':
        return this.buildUnsubscribeAnimation(svg, event, loop);
    }
  }

  buildSubscribeAnimation(svg: SVGElement, event: EventModel, loop: boolean): EventAnimationPlayer {
    const selector = `path[data-source="${event.source.id}"][data-target="${event.destination.id}"]`;
    const pathElement = svg.querySelector(selector) as SVGPathElement;
    const length = pathElement.getTotalLength();
    if (loop) {
      const factory = this.animationBuilder.build([
        style({strokeDasharray: length, strokeDashoffset: -length, opacity: 1}),
        animate('500ms ease', style({strokeDashoffset: 0})),
        animate('1000ms 500ms ease', style({opacity: 0}))
      ]);

      return new InfiniteAnimationPlayer(() => factory.create(pathElement));
    } else {
      const factory = this.animationBuilder.build([
        style({strokeDasharray: length, strokeDashoffset: -length, opacity: 1}),
        animate('500ms ease', style({strokeDashoffset: 0})),
      ]);
      return new FiniteAnimationPlayer(() => factory.create(pathElement));
    }

  }

  buildUnsubscribeAnimation(svg: SVGElement, event: EventModel, loop: boolean): EventAnimationPlayer {
    const selector = `path[data-source="${event.source.id}"][data-target="${event.destination.id}"]`;
    const pathElement = svg.querySelector(selector) as SVGPathElement;
    const length = pathElement.getTotalLength();
    if (loop) {
      const factory = this.animationBuilder.build([
        style({strokeDasharray: length, strokeDashoffset: 0, opacity: 1}),
        animate('500ms ease', style({offset: 0, strokeDashoffset: -length})),
        style({strokeDasharray: 0, opacity: 0}),
        animate('1000ms 500ms ease', style({opacity: 1})),
      ]);

      return new InfiniteAnimationPlayer(() => factory.create(pathElement));
    } else {
      const factory = this.animationBuilder.build([
        style({strokeDasharray: length, strokeDashoffset: 0, opacity: 1}),
        animate('500ms ease', style({offset: 0, strokeDashoffset: -length})),
      ]);

      return new FiniteAnimationPlayer(() => factory.create(pathElement));
    }
  }
}
