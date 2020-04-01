import {ContentScriptMessageType, DevtoolsMessageType} from '../messages';

document.addEventListener('doctor-rxjs:instrumented', () => {
  chrome.runtime.sendMessage({message: ContentScriptMessageType.INSTRUMENTED});
});

console.log('before');
chrome.runtime.sendMessage({message: ContentScriptMessageType.LOADED}, (response) => {
  if (response && response.message === DevtoolsMessageType.READY) {
    console.log('injection');
    injectScript(chrome.extension.getURL('/page-script.js'));
    injectScript(chrome.extension.getURL( '/page-script-vendor.js'));

  }
});
console.log('after');


function injectScript(src) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', src);
  document.documentElement.appendChild(script);
}
