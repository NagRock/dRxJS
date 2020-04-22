export interface SourcecodeMarker<T> {
  name: string;
  line: number;
  column: number;
  data: T;
}

