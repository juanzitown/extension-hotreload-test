import { initizializeExtension } from './setup';
console.log('@@@@@@@@ Content script works!');

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

if (!inIframe()) {
  initizializeExtension();
}
