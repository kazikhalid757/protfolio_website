/** Tiny user-agent reader: is it a bot, and what device / browser / OS. No dependency, no fingerprinting. */
export interface UaInfo {
  bot: boolean;
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

const BOT =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|preview|monitor|uptime|curl|wget|python|node-fetch|axios|go-http|java\/|okhttp|libwww|facebookexternalhit|embedly|scrapy|httpclient|postman|insomnia|phantom|selenium|puppeteer|playwright/i;

export function parseUa(ua: string | null | undefined): UaInfo {
  const s = ua || '';
  const bot = s.length < 20 || BOT.test(s);
  const device = /iPad|Tablet|PlayBook|Silk/i.test(s) || (/Android/i.test(s) && !/Mobile/i.test(s)) ? 'tablet' : /Mobi|iPhone|iPod|Android/i.test(s) ? 'mobile' : 'desktop';
  const browser = /Edg(e|A|iOS)?\//.test(s)
    ? 'Edge'
    : /OPR\/|Opera/.test(s)
    ? 'Opera'
    : /SamsungBrowser/.test(s)
    ? 'Samsung Internet'
    : /Firefox\/|FxiOS/.test(s)
    ? 'Firefox'
    : /Chrome\/|CriOS/.test(s)
    ? 'Chrome'
    : /Safari\//.test(s)
    ? 'Safari'
    : 'Other';
  const os = /Windows/.test(s) ? 'Windows' : /Android/.test(s) ? 'Android' : /iPhone|iPad|iPod/.test(s) ? 'iOS' : /Mac OS X|Macintosh/.test(s) ? 'macOS' : /CrOS/.test(s) ? 'ChromeOS' : /Linux/.test(s) ? 'Linux' : 'Other';
  return { bot, device, browser, os };
}
