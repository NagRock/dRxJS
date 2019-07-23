import {Instance, Properties} from '../state';

export interface InstanceNode<P extends Properties = Properties> {
  x: number;
  y: number;
  instance: Instance<P>;
  properties: P;
}

export interface InstanceLink {
  source: InstanceNode;
  target: InstanceNode;
}

export interface InstanceLayout {
  nodes: InstanceNode[];
  links: InstanceLink[];
  width: number;
  height: number;
}
