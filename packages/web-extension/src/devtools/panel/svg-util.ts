export type AttrValue = string | number | boolean;

export interface Attrs {
  [attr: string]: AttrValue;
}

export const getNormalizedAttrName = (attr: string) => attr.split(/(?=[A-Z])/).join('-').toLowerCase();

export const setAttrs = (element: SVGElement, attrs: Attrs): void => {
  Object.entries(attrs).forEach(([attr, value]) => element.setAttribute(getNormalizedAttrName(attr), String(value)));
};

export const makeCircle = (attrs?: Attrs) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  if (attrs) {
    setAttrs(element, attrs);
  }

  return element;
};

export const makeLine = (attrs?: Attrs) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  if (attrs) {
    setAttrs(element, attrs);
  }

  return element;
};

export const makeGroup = (elements: SVGElement[], attrs?: Attrs) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  element.append(...elements);
  if (attrs) {
    setAttrs(element, attrs);
  }

  return element;
};



