let iframeElement: HTMLIFrameElement | null = null;
let ctaContainerElement: HTMLDivElement | null = null;
let buttonElement: HTMLButtonElement | null = null;
let badgeElement: HTMLDivElement | null = null;
const state = {
  isWhitelisted: true,
  isMaximized: false,
  isAlwaysShown: true,
};
const CTA_CONTAINER_MINIMIZED_BOTTOM_LEFT = '-64px';
const IFRAME_HEIGHT_IN_PIXELS = 560;
const IFRAME_WIDTH_IN_PIXELS = 480;

export async function initizializeExtension() {
  createCta();
  createIframe();

  if (!iframeElement || !buttonElement) {
    return;
  }

  maximize();

  handleHistoryColorScheme();
}

function createCta() {
  ctaContainerElement = document.createElement('div');
  ctaContainerElement.id = 'tr___cta';
  ctaContainerElement.style.bottom = state.isWhitelisted
    ? '16px'
    : CTA_CONTAINER_MINIMIZED_BOTTOM_LEFT;
  ctaContainerElement.style.left = state.isWhitelisted
    ? '16px'
    : CTA_CONTAINER_MINIMIZED_BOTTOM_LEFT;
  buttonElement = document.createElement('button');
  buttonElement.id = 'tr___trinsly-chrome';
  buttonElement.classList.add('tr___trinsly-button');
  buttonElement.innerHTML = `
    <svg width="36" height="36" viewBox="0 0 11 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.3333 0.237054L0.454244 3.46513C0.175247 3.5563 0.134901 3.93579 0.388817 4.08343L4.1222 6.25432C4.23998 6.32281 4.38718 6.31455 4.49653 6.23333L5.54601 5.45395L4.76663 6.50343C4.68543 6.6128 4.67717 6.76002 4.74564 6.87779L6.91653 10.6112C7.06434 10.8653 7.44374 10.8245 7.53485 10.5457L10.7629 0.666707C10.8495 0.401442 10.5972 0.150741 10.3333 0.237054V0.237054ZM7.12331 9.61142L5.44746 6.72937L7.46825 4.00827C7.56893 3.87264 7.55507 3.68373 7.43563 3.56429C7.31621 3.44484 7.12725 3.43096 6.99165 3.53167L4.27055 5.55248L1.38852 3.8766L9.90677 1.09317L7.12331 9.61142ZM3.79642 7.68527L1.53451 9.94716C1.40148 10.0802 1.18578 10.0802 1.05276 9.94716C0.919709 9.81414 0.919709 9.59844 1.05276 9.46541L3.31467 7.20352C3.44774 7.07051 3.66344 7.07047 3.79642 7.20352C3.92947 7.33654 3.92947 7.55224 3.79642 7.68527V7.68527ZM0.80825 7.77086C0.675203 7.63781 0.675203 7.42213 0.80825 7.28911L1.70077 6.39657C1.8338 6.26352 2.04949 6.26352 2.18252 6.39657C2.31557 6.52961 2.31557 6.74529 2.18252 6.87832L1.29 7.77086C1.157 7.90386 0.941276 7.90388 0.80825 7.77086V7.77086ZM4.60337 8.8174C4.73642 8.95042 4.73642 9.16612 4.60337 9.29915L3.71083 10.1917C3.64432 10.2582 3.55713 10.2915 3.46997 10.2915C3.16919 10.2915 3.01389 9.92511 3.2291 9.70992L4.12164 8.8174C4.25465 8.68435 4.47035 8.68435 4.60337 8.8174V8.8174Z" />
    </svg>
  `;
  buttonElement.onclick = toggleIsMaximized;
  ctaContainerElement.appendChild(buttonElement);

  if (!document.body) {
    //document.body is null probably due to update
    return;
  }

  document.body.appendChild(ctaContainerElement);
}

function createIframe() {
  iframeElement = document.createElement('iframe');
  iframeElement.id = 'tr___iframe';
  iframeElement.style.width = `${IFRAME_WIDTH_IN_PIXELS}px`;
  iframeElement.style.height = `${IFRAME_HEIGHT_IN_PIXELS}px`;
  iframeElement.style.bottom = '-9999px';
  iframeElement.style.left = '-9999px';
  iframeElement.style.top = 'auto';
  iframeElement.style.zIndex = '9999';
  iframeElement.style.position = 'fixed';
  iframeElement.style.border = '0';
  iframeElement.style.margin = '0';
  iframeElement.style.padding = '0';
  iframeElement.style.overflow = 'hidden';
  iframeElement.style.background = 'transparent';
  iframeElement.style.background = 'transparent';
  iframeElement.style.borderTopLeftRadius = '24px';
  iframeElement.style.borderTopRightRadius = '24px';
  iframeElement.style.transition =
    'all 0.4s ease-in-out, bottom 0.2s ease-in-out, left 0.2s ease-in-out';
  iframeElement.style.boxShadow =
    '0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3)';

  iframeElement.src = chrome.runtime.getURL('index.html');
  document.body.appendChild(iframeElement);
}

function maximize() {
  state.isMaximized = true;
  ctaContainerElement!.style.left = '32px';
  ctaContainerElement!.style.bottom = `${IFRAME_HEIGHT_IN_PIXELS - 28}px`;
  iframeElement!.style.bottom = '0';
  iframeElement!.style.left = '16px';
  iframeElement!.focus();
}

function minimize() {
  const { isWhitelisted } = state;
  let ctaStyleBottom;
  let ctaStyleBottomLeft;

  switch (true) {
    case isWhitelisted:
      ctaStyleBottom = '16px';
      ctaStyleBottomLeft = '16px';
      break;

    default:
      ctaStyleBottom = '-64px';
      ctaStyleBottomLeft = CTA_CONTAINER_MINIMIZED_BOTTOM_LEFT;
      break;
  }

  state.isMaximized = false;
  iframeElement!.style.bottom = '-9999px';
  iframeElement!.style.left = '-9999px';
  ctaContainerElement!.style.bottom = ctaStyleBottom;
  ctaContainerElement!.style.left = ctaStyleBottomLeft;
  ctaContainerElement!.style.top = 'auto';
}

function toggleIsMaximized() {
  state.isAlwaysShown = true;
  state.isMaximized = !state.isMaximized;

  if (state.isMaximized) {
    maximize();
  } else {
    minimize();
  }
}

function handleHistoryColorScheme() {
  const defaultStyles = {
    button: { color: 'white', backgroundColor: '#23d160' },
    badge: { color: 'white', backgroundColor: '#f43f5e' },
  };

  if (buttonElement) {
    buttonElement.style.background = defaultStyles.button.backgroundColor;
    buttonElement.style.color = defaultStyles.button.color;
  }
}
