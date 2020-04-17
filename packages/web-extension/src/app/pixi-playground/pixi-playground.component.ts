import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import * as PIXI from 'pixi.js';
import {TweenLite, TweenMax, gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {asapScheduler, concat, fromEvent, of, Subject} from 'rxjs';
import {observeOn, takeUntil} from 'rxjs/operators';


gsap.registerPlugin(MotionPathPlugin);


function bezierPart(x1, y1, bx1, by1, bx2, by2, x2, y2, t0, t1) {
  const u0 = 1.0 - t0;
  const u1 = 1.0 - t1;

  const qxa = x1 * u0 * u0 + bx1 * 2 * t0 * u0 + bx2 * t0 * t0;
  const qxb = x1 * u1 * u1 + bx1 * 2 * t1 * u1 + bx2 * t1 * t1;
  const qxc = bx1 * u0 * u0 + bx2 * 2 * t0 * u0 + x2 * t0 * t0;
  const qxd = bx1 * u1 * u1 + bx2 * 2 * t1 * u1 + x2 * t1 * t1;

  const qya = y1 * u0 * u0 + by1 * 2 * t0 * u0 + by2 * t0 * t0;
  const qyb = y1 * u1 * u1 + by1 * 2 * t1 * u1 + by2 * t1 * t1;
  const qyc = by1 * u0 * u0 + by2 * 2 * t0 * u0 + y2 * t0 * t0;
  const qyd = by1 * u1 * u1 + by2 * 2 * t1 * u1 + y2 * t1 * t1;

  const xa = qxa * u0 + qxc * t0;
  const xb = qxa * u1 + qxc * t1;
  const xc = qxb * u0 + qxd * t0;
  const xd = qxb * u1 + qxd * t1;

  const ya = qya * u0 + qyc * t0;
  const yb = qya * u1 + qyc * t1;
  const yc = qyb * u0 + qyd * t0;
  const yd = qyb * u1 + qyd * t1;

  return [xa, ya, xb, yb, xc, yc, xd, yd];
}


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
    this.app.stage.angle
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


    const t = {value: 0};

    gsap.fromTo(t, {value: 0}, {value: 1, duration: 10, ease: 'power2.out'});

    this.app.ticker.add(() => {
      const [xa, ya, xb, yb, xc, yc, xd, yd] = bezierPart(A.x, A.y, Ac.x, Ac.y, Bc.x, Bc.y, B.x, B.y, 0, t.value);
      bezier.clear();
      bezier.lineStyle(2, 0xff0000, 1);

      bezier.moveTo(xa, ya);
      bezier.bezierCurveTo(xb, yb, xc, yc, xd, yd);

      [[xa, ya], [xb, yb], [xc, yc], [xd, yd]].forEach(([x, y], index) => {
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
