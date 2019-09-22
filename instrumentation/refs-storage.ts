export class RefsStorage {
  private nextRef = 0;

  constructor(
    private readonly refs: { [ref: number]: any },
  ) {
  }

  store(value: any): number {
    const ref = this.nextRef++;
    this.refs[ref] = value;
    return ref;
  }
}

export function createRefsStorage() {
  const refs = (window as any).___dRxJS_refs = {};
  return new RefsStorage(refs);
}
