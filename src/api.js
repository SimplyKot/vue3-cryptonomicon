const API_KEY =
  "9a54c61b45ac389b252ee8b8eab0a0521930b18780641228922688851af95c78";
const AGREGATE_INDEX = "5";

const tickersHandlers = new Map();

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (type !== AGREGATE_INDEX) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWs(message) {
  const stringifyedMessade = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifyedMessade);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(message);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWs({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeToTickerOnWs(ticker) {
  sendToWs({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

// const loadTickers = () => {
//   //TODO: refactor to use URLSearchParams

//   //debugger;

//   if (tickersHandlers.size === 0) {
//     return;
//   }

//   return fetch(
//     `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
//       ...tickersHandlers.keys(),
//     ].join(",")}&tsyms=USD&&api_key=${API_KEY}`
//   )
//     .then((r) => {
//       return r.json();
//     })
//     .then((rawData) => {
//       const udatedPrices = Object.fromEntries(
//         Object.entries(rawData).map(([key, value]) => {
//           return [key, value.USD];
//         })
//       );
//       Object.entries(udatedPrices).forEach(([currency, newPrice]) => {
//         const handlers = tickersHandlers.get(currency) ?? [];
//         handlers.forEach((fn) => fn(newPrice));
//       });
//     });
// };

export const loadTickersList = () => {
  return fetch(
    `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
  ).then((r) => {
    return r.json();
  });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  // const subscribers = tickersHandlers.get(ticker) || [];
  // tickersHandlers.set(
  //   ticker,
  //   subscribers.filter((fn) => fn !== cb)
  // );
  tickersHandlers.delete(ticker);
  unsubscribeToTickerOnWs(ticker);
};

// setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;
