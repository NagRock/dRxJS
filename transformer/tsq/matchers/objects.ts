import { Matcher } from '../types';
import { matchesAll } from './core';

export const equals = <T>(value: T): Matcher<T> =>
  (target: T) => target === value;

export const hasProperty = <T>(path: string, ...matchers: Array<Matcher<any>>): Matcher<T> => {
  const matcher = matchesAll(...matchers);

  return (target: T) => {
    const property = path.split('.').reduce((t, seg) => t ? t[seg] : undefined, target);

    return property !== undefined && matcher(property);
  };
};
