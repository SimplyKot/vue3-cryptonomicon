const API_KEY =
  "9a54c61b45ac389b252ee8b8eab0a0521930b18780641228922688851af95c78";

export const loadTicker = (tickers) => {
  //TODO: refactor to use URLSearchParams
  return fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(
      ","
    )}&api_key=${API_KEY}`
  ).then((r) => {
    return r.json();
  });
};

export const loadTickerList = () => {
  console.log("TRL");
  return fetch(
    `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
  ).then((r) => {
    return r.json();
  });
};
