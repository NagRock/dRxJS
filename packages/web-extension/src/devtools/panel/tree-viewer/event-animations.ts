import anime from 'animejs';
import {makeCircle, makeGroup, makeLine} from '../svg-util';
import {Call, Event, Notification, Subscribe, Unsubscribe} from '../state';

export interface AnimationPlayer {
  play(): void;

  stop(): void;
}

const buildSubscriptionAnimation = (svg: SVGElement, event: Subscribe | Unsubscribe, loop: boolean): AnimationPlayer => {
  const selector = `path[data-source="${event.sender.id}"][data-target="${event.receiver.id}"]`;
  const pathElement = svg.querySelector(selector) as SVGPathElement;
  const pathElementClone = pathElement.cloneNode() as SVGPathElement;
  pathElementClone.setAttribute('opacity', '1');
  pathElementClone.setAttribute('stroke-dasharray', String(pathElementClone.getTotalLength()));

  const [strokeDashoffset, opacity] = event.kind === 'subscribe'
    ? [[-pathElementClone.getTotalLength(), 0], [1, 0]]
    : [[0, pathElementClone.getTotalLength()], [0, 1]];

  const animation = anime({
    autoplay: false,
    targets: pathElementClone,
    keyframes: [
      {strokeDashoffset, duration: 1000},
      ...loop ? [{opacity, strokeDashoffset: [0, 0], duration: 500, delay: 500}] : [],
    ],
    easing: 'easeInOutSine',
    loop
  });

  return {
    play(): void {
      pathElement.setAttribute('opacity', '0.1');
      svg.insertBefore(pathElementClone, pathElement.nextSibling);
      animation.play();
    },
    stop(): void {
      pathElement.setAttribute('opacity', '1');
      pathElementClone.remove();
      animation.restart();
      animation.pause();
    }
  };
};


const makeNotificationElement = (kind: 'next' | 'error' | 'complete') => {
  switch (kind) {
    case 'next':
      return makeCircle({
        r: 12,
        cx: 0,
        cy: 0,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 4,
      });
    case 'complete':
      return makeGroup([
        makeCircle({r: 12, cx: 0, cy: 0, fill: 'green'}),
        makeLine({x1: 0, y1: -8, x2: 0, y2: 8})
      ], {
        stroke: 'black',
        strokeWidth: 4,
      });
    case 'error':
      return makeGroup([
          makeCircle({r: 12, cx: 0, cy: 0, fill: 'red'}),
          makeLine({x1: -6, y1: -6, x2: 6, y2: 6}),
          makeLine({x1: -6, y1: 6, x2: 6, y2: -6}),
        ], {
          stroke: 'black',
          strokeWidth: 4,
        },
      );
  }
};

const buildNotificationAnimation = (svg: SVGElement, event: Notification, loop: boolean) => {
  const selector = `path[data-source="${event.sender.id}"][data-target="${event.receiver.id}"]`;
  const pathElement = svg.querySelector(selector) as SVGPathElement;

  const notificationElement = makeNotificationElement(event.kind);

  const {x: sx, y: sy} = pathElement.getPointAtLength(0);
  const {x: ex, y: ey} = pathElement.getPointAtLength(pathElement.getTotalLength());

  // const path = anime.path(pathElement);
  const animation = anime({
    autoplay: false,
    targets: notificationElement,
    keyframes: [
      {translateX: [sx, sx], translateY: [sy, sy], rotate: [0, 0], scale: [0, 1], duration: 150, easing: 'easeInQuad'},
      {translateX: [sx, ex], translateY: [sy, ey], duration: 700, easing: 'easeOutQuad'},
      {translateX: [ex, ex], translateY: [ey, ey], rotate: [0, 0], scale: [1, 0], duration: 150, easing: 'easeOutQuad'},
      ...loop ? [{delay: 500}] : [],
    ],
    loop,
  });

  return {
    play(): void {
      svg.append(notificationElement);
      animation.play();
    },
    stop(): void {
      notificationElement.remove();
      animation.restart();
      animation.pause();
    }
  };
};

function makeCallElement(kind: 'subject-next' | 'subject-error' | 'subject-complete' | 'connect') {
  let color;
  switch (kind) {
    case 'subject-next':
      color = 'blue';
      break;
    case 'subject-error':
      color = 'red';
      break;
    case 'subject-complete':
      color = 'green';
      break;
    case 'connect':
      color = 'black';
      break;
  }
  return makeCircle({
    r: 16,
    // cx: 0,
    // cy: 0,
    fill: color,
    // stroke: color,
    // strokeWidth: 4,
  })
}

const buildCallAnimation = (svg: SVGElement, event: Call, loop: boolean): AnimationPlayer => {
  const selector = `g[data-node="${event.receiver.id}"]`;
  const groupElement = svg.querySelector(selector) as SVGGElement;

  const callElement = makeCallElement(event.kind);
  // callElement.setAttribute('transform', targetElement.getAttribute('transform'));

  const animation = anime({
    autoplay: false,
    targets: callElement,
    keyframes: [
      {r: [16, 32], opacity: [1, 0], duration: 1000, easing: 'easeOutQuad'},
      ...loop ? [{delay: 500}] : [],
    ],
    loop,
  });

  return {
    play(): void {
      groupElement.prepend(callElement);
      animation.play();
    },
    stop(): void {
      callElement.remove();
      animation.restart();
      animation.pause();
    }
  };

};

export const buildAnimation = (svg: SVGElement, event: Event, loop: boolean): AnimationPlayer => {
  switch (event.kind) {

    case 'subscribe':
    case 'unsubscribe':
      return buildSubscriptionAnimation(svg, event, loop);
    case 'next':
    case 'error':
    case 'complete':
      return buildNotificationAnimation(svg, event, loop);
    case 'subject-next':
    case 'subject-error':
    case 'subject-complete':
    case 'connect':
      return buildCallAnimation(svg, event, loop);
    default:
      return undefined;
  }
};
