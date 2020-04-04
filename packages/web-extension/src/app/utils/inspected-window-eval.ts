export function inspectedWindowEval(expression: string): Promise<any> {
  return new Promise<any>(((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(expression, (result, exceptionInfo) => {
      if (exceptionInfo !== undefined) {
        reject(exceptionInfo);
      } else {
        resolve(result);
      }
    });
  }));
}
