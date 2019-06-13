import { Matcher } from '../types';

export const anything = <T>(): Matcher<T> =>
  (target: T) => true;

export const matchesAll = <T>(...matchers: Array<Matcher<T>>): Matcher<T> =>
  (target: T) => matchers.every((m) => m(target));

export const matchesAny = <T>(...matchers: Array<Matcher<T>>): Matcher<T> =>
  (target: T) => matchers.some((m) => m(target));

export const not = <T>(matcher: Matcher<T>): Matcher<T> =>
  (target: T) => !matcher(target);
