console.log('devtools-init');
import {browser} from '../types/webextension-polyfill-ts';

browser.devtools.panels.create('dRxJS', './../assets/images/icon-32x32.png', '/devtools/panel/panel.html');
