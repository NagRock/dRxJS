import {browser} from '../types/webextension-polyfill-ts';

browser.devtools.panels.create(
  'Doctor 💊 RxJS ',
  './../assets/images/icon-32x32.png',
  '/devtools/panel/panel.html'
);
