type RxInspectorEvent = any;
type RxInspectorListener = (event: RxInspectorEvent) => void;

export class RxInspector {
  private listeners: RxInspectorListener[] = [];

  dispatch(event: RxInspectorEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  addListener(listener: RxInspectorListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: RxInspectorListener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.slice(index, 1);
    }
  }
}

export const rxInspector = (window as any).RxInspector || ((window as any).RxInspector = new RxInspector());
