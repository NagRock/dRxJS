console.log('page script loaded');
(window as any).__doctor_rxjs__instrument = (rxjs, rxjsOperators) => {
  document.dispatchEvent(new Event('doctor-rxjs:instrumented'));
};
