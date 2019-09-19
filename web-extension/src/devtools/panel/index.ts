import {browser} from '../../types/webextension-polyfill-ts';

browser.devtools.inspectedWindow.eval('_dRxJS.getData()').then((value) => {
  console.log('panel', value[0]);
});
