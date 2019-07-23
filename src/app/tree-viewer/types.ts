import {Instance, Properties} from '../state';

export interface InstanceNode {
  x: number;
  y: number;
  instance: Instance;
  properties: Properties;
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
