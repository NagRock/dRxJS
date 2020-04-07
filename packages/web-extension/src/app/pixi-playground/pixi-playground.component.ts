import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import * as PIXI from 'pixi.js';
import {TweenLite, TweenMax, gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {asapScheduler, concat, fromEvent, of, Subject} from 'rxjs';
import {observeOn, takeUntil} from 'rxjs/operators';

gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-pixi-playground',
  templateUrl: './pixi-playground.component.html',
  styleUrls: ['./pixi-playground.component.scss']
})
export class PixiPlaygroundComponent implements AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private app: PIXI.Application;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {
  }

  ngAfterViewInit() {
    this.app = new PIXI.Application({
      antialias: true,
    });
    this.elementRef.nativeElement.appendChild(this.app.view);
    concat(
      of(undefined).pipe(observeOn(asapScheduler)),
      fromEvent(window, 'resize'),
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.resize());

    const circle = new PIXI.Graphics();
    circle.lineStyle(4, 0xff0000, 1);
    circle.beginFill(0x00ff00, 1);
    circle.drawCircle(0, 0, 10);
    circle.endFill();


    const bezier = new PIXI.Graphics();
    bezier.lineStyle(2, 0xff0000, 1);
    const A = {x: 100, y: 100};
    const B = {x: 400, y: 200};
    const Ac = {x: A.x + (B.x - A.x) * 0.5, y: A.y};
    const Bc = {x: B.x - (B.x - A.x) * 0.5, y: B.y};

    const A1 = {...A};
    const B1 = {...B};
    const Ac1 = {...Ac};
    const Bc1 = {...Bc};

    const points: PIXI.Graphics[] = [];
    [A, B, Ac, Bc].forEach(({x, y}) => {
      const point = new PIXI.Graphics();
      point.lineStyle(0);
      point.beginFill(0x0000ff, 1);
      point.drawCircle(0, 0, 4);
      point.endFill();
      points.push(point);
      this.app.stage.addChild(point);
    });

    bezier.moveTo(A.x, A.y);
    bezier.bezierCurveTo(Ac.x, Ac.y, Bc.x, Bc.y, B.x, B.y);

    gsap.fromTo(Ac1, A, {...Ac, duration: 10, ease: 'power2.out'});
    gsap.fromTo(Bc1, Ac, {...Bc, duration: 10, ease: 'power2.out'});
    gsap.fromTo(B1, Bc, {...B, duration: 10, ease: 'power2.out'});

    this.app.ticker.add(() => {
      bezier.clear();
      bezier.lineStyle(2, 0xff0000, 1);
      bezier.moveTo(A1.x, A1.y);
      bezier.bezierCurveTo(Ac1.x, Ac1.y, Bc1.x, Bc1.y, B1.x, B1.y);

      [A1, B1, Ac1, Bc1].forEach(({x, y}, index) => {
        const point = points[index];
        point.x = x;
        point.y = y;
      });
    });

    this.app.stage.addChild(circle);
    this.app.stage.addChild(bezier);


    circle.x = A.x;
    circle.y = A.y;
    gsap.to(circle, {
      duration: 10,
      motionPath: {
        path: [A, Ac, Bc, B],
        type: 'cubic',
      },
      ease: 'power2.out'
    });

    console.log(circle);


  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resize(): void {
    const {clientWidth, clientHeight} = this.elementRef.nativeElement;
    console.log(this.elementRef.nativeElement, {clientWidth, clientHeight});
    this.app.renderer.resize(clientWidth, clientHeight);
  }

}
