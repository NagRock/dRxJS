/**
 * content-script is injected to EVERY page and have access to plain window object - without dynamically created variables & objects
 */
import {browser} from '../types/webextension-polyfill-ts';

injectScript(browser.extension.getURL('/page-scripts.js'), 'body');

function injectScript(file, node) {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement('script');

  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);

  return new Promise((resolve, reject) => {
    s.onload = () => {
      resolve();
    };
  });
}
