declare var ___dRxJS_refs : Array<string | number | boolean | Function | Object>;

(window as any)._dRxJS = {
  getValueRefDat: (refId: number) => {
    const value = ___dRxJS_refs[refId];

    switch (typeof value) {
      case 'undefined':
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
        return value;
      case 'function':
        return `function ${value.prototype.constructor.name}`;
      case 'symbol':
        if (value === null) {
          return null;
        }
    }

  },
  getData: () => ({
    test: Math.random(),
    now: new Date().toLocaleString()
  })
};
