var URL = "";
var socket = null;
var connected = false;
var ports = [];

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

function subscribeToTickerOnWs(ticker, toCurrency) {
  sendToWS({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${toCurrency}`],
  });
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

function messageHandler(e) {
  //const subscribers = tickersHandlers.get(ticker) || [];

  //console.log(e);

  var currency = "";
  var newPrice = "";
  // eslint-disable-next-line no-unused-vars
  var isExist = true;

  //console.log(isExist);

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

      console.log(BTCusers);
      // Если этой монеты нет в подпичсиках кросс-курса - добавляем её
      if (!BTCusers.length && currency) {
        console.log("Первый подписчик на BTC: ", currency);
        BTCusers.push(currency);
      }

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
    //console.log(BTCUSDexchange);
  }

  // Есл пришел курс для подписчика ***-BTC, то переводим его в курс ***-USD
  if (BTCusers.includes(currency) && rawProxyCurrency === "BTC") {
    newPrice = newPrice * BTCUSDexchange;
  }

  // //Выбираем хэндлер валюты из сообщения
  // const handlers = tickersHandlers.get(currency) ?? [];

  // // Зарускаем колбеки с обновленными параметрами
  // handlers.forEach((fn) => fn(newPrice, isExist));
}

function createSocket() {
  if (!connected) {
    socket = new WebSocket(URL);
    connected = true;
    socket.addEventListener("message", (e) => {
      //TODO: Вот тут глобальная обратотка ответв

      messageHandler(e);
      ports.forEach((port) => port.postMessage(e.data));
      //port.postMessage(e.data);
    });
  }
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
// Функция послает сообщение в WebSocket
function sendToWS(data) {
  if (data && !data.URL) {
    //console.log(data);
    console.log("socketState =>", socket.readyState);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(data);
      return;
    }
    // Если WS закрыт, то отрываем его и уже тогдв шлём сообщение туда
    socket.addEventListener(
      "open",
      () => {
        socket.send(data);
      },
      { once: true }
    );
  }
}

// Подписывается на монету
const subscribeToTicker = (ticker, cb, toCurrency = "USD") => {
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
const unsubscribeFromTicker = (ticker, toCurrency = "USD") => {
  if (toCurrency) {
    console.log(toCurrency);
  }
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
      //unsubscribeToTickerOnWs("BTC", "USD");
    }
  } else {
    //unsubscribeToTickerOnWs(ticker, toCurrency);
  }
};

self.addEventListener(
  "connect",
  (e) => {
    const port = e.ports[0];
    ports.push(port);
    console.log("ports =>", e.ports);

    // Анализируем пришедшее из основного потока сообщение и выполняем требуемые операции
    function dispatch(data) {
      console.log(data.action);
      // Если эндпоинт не установлен и приходит запрос на его установку - устанавливаем
      if (!URL) {
        URL = data.URL;
        // port.postMessage(`Установлен эндпоинт ${URL}`);
        createSocket();
      }

      if (data.action) {
        console.log("Будет подписка или отписка");
        const dataToSend = JSON.stringify({
          action: data.action,
          subs: [`5~CCCAGG~${data.ticker}~USD`],
        });
        console.log(dataToSend);
        sendToWS(dataToSend);
      }
    }

    port.addEventListener("message", (e) => dispatch(e.data), false);
    port.start();
  },
  false
);
