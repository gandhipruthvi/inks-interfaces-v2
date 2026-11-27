// Vercel Web Analytics + Speed Insights (cookieless) and Google Analytics 4.
// Production only, so local dev doesn't pollute the numbers.
// GA4 loads only when VITE_GA_ID is set (Vercel → Settings → Environment Variables).
const GA_ID = import.meta.env.VITE_GA_ID;
const IS_PROD = !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

// EEA + UK + Switzerland: GA cookies stay off by default (Consent Mode v2 sends cookieless pings).
// ponytail: no consent banner yet, so EU/UK visitors are modelled, not fully counted. Add a banner that calls
// gtag('consent','update',{analytics_storage:'granted'}) if those numbers matter.
const CONSENT_REGIONS = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'];

function addScript(src) {
  const s = document.createElement('script');
  s.src = src;
  s.defer = true;
  document.head.appendChild(s);
}

export function initAnalytics() {
  if (!IS_PROD || window.__iiAnalytics) return;
  window.__iiAnalytics = true;

  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  addScript('/_vercel/insights/script.js');
  addScript('/_vercel/speed-insights/script.js');

  if (!GA_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  gtag('consent', 'default', { ...denied, region: CONSENT_REGIONS });
  gtag('consent', 'default', { ...denied, analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', GA_ID);
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
}

// One call, both tools. Vercel custom events need the Pro plan; on Hobby they're dropped silently.
export function track(name, params = {}) {
  window.va?.('event', { name, data: params });
  window.gtag?.('event', name, params);
}
