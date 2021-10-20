const API_KEY =
  "9a54c61b45ac389b252ee8b8eab0a0521930b18780641228922688851af95c78";
const AGREGATE_INDEX = "5";
const UNKNOWN_CURRENCY_INDEX = "500";
const UNKNOWN_CURRENCY_MESSAGE = "INVALID_SUB";
const UNKNOWN_DIRECT_PAIR_INFO =
  "We have not integrated any of the exchanges BTCD~USD pair trades on or we have not currently mapped it.";

const tickersHandlers = new Map();

// Массив с пользователямя курса BTC-USD
var BTCusers = [];

//  Актуальный курс BTC-USD
var BTCUSDexchange = 0;

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

var worker = new SharedWorker("scripts/worker.js");

worker.port.addEventListener(
  "message",
  function (e) {
    console.log("Shared worker return=>", e.data);
  },
  false
);

worker.port.start();

worker.port.postMessage({
  URL: `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`,
});

// Обработчик событий WS
socket.addEventListener("message", (e) => {
  //const subscribers = tickersHandlers.get(ticker) || [];

  var currency = "";
  var newPrice = "";
  var isExist = true;

  const {
    TYPE: type,
    FROMSYMBOL: rawCurrency,
    TOSYMBOL: rawProxyCurrency,
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

  // Из соообщения о несуществующей валюте вытаскиваем названия этой валюты и ставим ей признак несуществования
  if (
    type == UNKNOWN_CURRENCY_INDEX &&
    rawMessage == UNKNOWN_CURRENCY_MESSAGE
  ) {
    currency = getTickerNameFormMessage(rawParameter);
    if (info === UNKNOWN_DIRECT_PAIR_INFO) {
      console.log(`Монетка ${currency} существует, но нет прямого курса`);
      isExist = true;
      newPrice = 0;
      if (!checkCoinInHandlers("BTC")) {
        console.log("Нет подписки на BTC-USD. Выполняем подписку.");
        subscribeToTickerOnWs("BTC", "USD");
      } else {
        console.log("Подписка на BTC-USD есть. Будем пользоваться ей.");
      }
      BTCusers.push(currency);
      subscribeToTickerOnWs(currency, "BTC");
    } else {
      console.log(`Монетки ${currency} не существует`);
      isExist = false;
      newPrice = "-";
    }

    //debugger;
  }

  // Если есть подписчики на курс BTC-USD и сообщение содержит этот курс - сохраняем его
  if (BTCusers.length && currency === "BTC") {
    BTCUSDexchange = newPrice;
    console.log(BTCUSDexchange);
  }

  // Есл пришел курс для подписчика ***-BTC, то переводим его в курс ***-USD
  if (BTCusers.includes(currency) && rawProxyCurrency === "BTC") {
    newPrice = newPrice * BTCUSDexchange;
  }

  //Выбираем хэндлер валюты из сообщения
  const handlers = tickersHandlers.get(currency) ?? [];

  // Зарускаем колбеки с обновленными параметрами
  handlers.forEach((fn) => fn(newPrice, isExist));
});

function sendToWs(message) {
  const stringifiedMessage = JSON.stringify(message);

  // Посылвем сообщение на SharedWorker
  worker.port.postMessage(stringifiedMessage);

  // Если WS уже открыт, то шлём сообщение туда и завершаем функцию
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  // Если WS закрыт, то отрываем его и уже тогдв шлём сообщение туда
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
  return !!isExist;
}

// Функция доставет название монеты из сообщения
function getTickerNameFormMessage(parameter) {
  const coin = Object.keys(Object.fromEntries(tickersHandlers)).find((coin) => {
    if (parameter.includes(`5~CCCAGG~${coin}~`)) {
      return true;
    }
  });
  //debugger;
  return coin;
}

function subscribeToTickerOnWs(ticker, toCurrency) {
  sendToWs({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${toCurrency}`],
  });
}

function unsubscribeToTickerOnWs(ticker, toCurrency) {
  sendToWs({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~${toCurrency}`],
  });
}

// Загружаем список доступных монет
export const loadTickersList = () => {
  return fetch(
    `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
  ).then((r) => {
    return r.json();
  });
};

// Подписывается на монету
export const subscribeToTicker = (ticker, cb, toCurrency = "USD") => {
  // Если подписка на BTC, то добавляем её в список использующих BTC
  // так как он может нам понадобится для кросс-курса
  if (ticker === "BTC") {
    BTCusers.push(ticker);
  }
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker, toCurrency);
};

// Отписываемся от монетки
export const unsubscribeFromTicker = (ticker, toCurrency = "USD") => {
  // Если запрошена отписка от монетки использующей кросс-курс
  if (
    BTCusers.some((element) => {
      return element === ticker;
    })
  ) {
    console.log(`Запрошена отписка от кросскурса ${ticker}-USD`);
    console.log(BTCusers);
    // Удаляем название монеты из списка использующих кросс-курс
    BTCusers = BTCusers.filter((coin) => {
      const res = coin !== ticker;
      console.log(res);
      return res;
    });

    console.log(BTCusers);
    // Если список использующих кросс-курс пуст - отписываемся от BTC-USD
    if (BTCusers.length === 0) {
      unsubscribeToTickerOnWs("BTC", "USD");
    }
  } else {
    unsubscribeToTickerOnWs(ticker, toCurrency);
  }
};
