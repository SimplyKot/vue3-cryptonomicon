const API_KEY =
  "9a54c61b45ac389b252ee8b8eab0a0521930b18780641228922688851af95c78";

const tickers = new Map();

const loadTickers = () => {
  //TODO: refactor to use URLSearchParams

  //debugger;

  if (tickers.size === 0) {
    return;
  }

  return fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickers.keys(),
    ].join(",")}&tsyms=USD&&api_key=${API_KEY}`
  )
    .then((r) => {
      return r.json();
    })
    .then((rawData) => {
      return Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => {
          return [key, value.USD];
        })
      );
    });
};

export const loadTickersList = () => {
  return fetch(
    `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
  ).then((r) => {
    return r.json();
  });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickers.get(ticker) || [];
  tickers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker, cb) => {
  const subscribers = tickers.get(ticker) || [];
  tickers.set(
    ticker,
    subscribers.filter((fn) => fn !== cb)
  );
};

setInterval(loadTickers, 5000);

window.tickers = tickers;
