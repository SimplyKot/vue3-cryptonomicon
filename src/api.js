const API_KEY =
  "9a54c61b45ac389b252ee8b8eab0a0521930b18780641228922688851af95c78";
const AGREGATE_INDEX = "5";
const UNKNOWN_CURRENCY_INDEX = "500";
const UNKNOWN_CURRENCY_MESSAGE = "INVALID_SUB";
const UNKNOWN_DIRECT_PAIR_INFO =
  "We have not integrated any of the exchanges BTCD~USD pair trades on or we have not currently mapped it.";

const tickersHandlers = new Map();

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

// Обработчик событий WS
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
    INFO: info,
  } = JSON.parse(e.data);

  currency = rawCurrency;
  newPrice = rawPrice;

  // Игнорируем все ненужные типы сообщений
  if (type !== AGREGATE_INDEX && type !== UNKNOWN_CURRENCY_INDEX) {
    return;
  }

  // Игнорируем сообщения о валидных тикерах, но без указания цены
  if (type == AGREGATE_INDEX && newPrice == undefined) {
    return;
  }

  // Из соообщения о несуществующей валюте вытаскиваем нзвания этой валюты и ставим ей признак несуществования
  if (
    type == UNKNOWN_CURRENCY_INDEX &&
    rawMessage == UNKNOWN_CURRENCY_MESSAGE
  ) {
    currency = getTickerNameFormMessage(rawParameter);
    if (info === UNKNOWN_DIRECT_PAIR_INFO) {
      console.log(`Монетка ${currency} существует, но нет прямого курса`);
      isExist = true;
      newPrice = 0;
      const asd = checkCoinInHandlers("BTC");
      console.log(asd);
      //debugger;
      //TODO:

      // 1. Подписаться на курс монетка-BTC
      // 2. Подписаться на курс BTC-USD
      // 3. Реализовать крос-курс
      // 4. Рализовать корректную отписку (от BTC отписываться только если нет других кросс-курсов
      // и прямой подписки прямой подписки)
    } else {
      console.log(`Монетки ${currency} не существует`);
      isExist = false;
      newPrice = "-";
    }

    //debugger;
  }

  //Выбираем хэндлер валюты из сообщения
  const handlers = tickersHandlers.get(currency) ?? [];

  // Зарускаем колбеки с обновленными параметрами
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

// Функция проверяет есть ли активая подписка на монетку
function checkCoinInHandlers(currency) {
  const isExist = Object.keys(Object.fromEntries(tickersHandlers)).find(
    (coin) => {
      return currency == coin;
    }
  );
  //debugger;
  return !!isExist;
}

function getTickerNameFormMessage(parameter) {
  const coin = Object.keys(Object.fromEntries(tickersHandlers)).find((coin) => {
    if (parameter.includes(`5~CCCAGG~${coin}~`)) {
      return true;
    }
  });
  //debugger;
  return coin;
}

function subscribeToTickerOnWs(ticker, toCurrency = "USD") {
  sendToWs({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${toCurrency}`],
  });
}

function unsubscribeToTickerOnWs(ticker, toCurrency = "USD") {
  sendToWs({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~${toCurrency}`],
  });
}

// Зашружаем список доступных монет
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
