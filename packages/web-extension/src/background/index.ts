/**
 * Background script is always running unless extension is disabled
 * There is always one instance - even when you have opened many browser windows
 *
 * tab ID may duplicate between windows on Firefox
 */
import {browser} from '../types/webextension-polyfill-ts';

console.info('background-page-init')
