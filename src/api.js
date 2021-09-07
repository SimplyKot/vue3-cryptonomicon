const API_KEY =
  "9a54c61b45ac389b252ee8b8eab0a0521930b18780641228922688851af95c78";
const AGREGATE_INDEX = "5";
const UNKNOWN_CURRENCY_INDEX = "500";
const UNKNOWN_CURRENCY_MESSAGE = "INVALID_SUB";

const tickersHandlers = new Map();

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", (e) => {
  //const subscribers = tickersHandlers.get(ticker) || [];

  var currency = "";
  var newPrice = "";
  var isExist = true;

  const {
    TYPE: type,
    FROMSYMBOL: rawCurrency,
    PRICE: rawPrice,
    MESSAGE: rawMessage,
    PARAMETER: rawParameter,
  } = JSON.parse(e.data);

  currency = rawCurrency;
  newPrice = rawPrice;

  // Игнорируем все ненужные типы сообщений
  if (type !== AGREGATE_INDEX && type !== UNKNOWN_CURRENCY_INDEX) {
    return;
  }

  if (type == AGREGATE_INDEX && newPrice == undefined) {
    return;
  }

  if (
    type == UNKNOWN_CURRENCY_INDEX &&
    rawMessage == UNKNOWN_CURRENCY_MESSAGE
  ) {
    Object.keys(Object.fromEntries(tickersHandlers)).forEach((coin) => {
      if (rawParameter.includes(`5~CCCAGG~${coin}~`)) {
        console.log(
          coin,
          rawParameter,
          !rawParameter.includes(`5~CCCAGG~${coin}~`)
        );
        isExist = false;
        currency = coin;
        newPrice = "-";
      }
    });
  }

  const handlers = tickersHandlers.get(currency) ?? [];

  console.log(currency, newPrice, isExist);

  handlers.forEach((fn) => fn(newPrice, isExist));
});

function sendToWs(message) {
  const stringifiedMessage = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
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
  tickersHandlers.delete(ticker);
  unsubscribeToTickerOnWs(ticker);
};
