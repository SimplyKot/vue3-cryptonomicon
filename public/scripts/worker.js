var URL = "";
var socket = null;
var connected = false;
var ports = [];

function createSocket() {
  if (!connected) {
    socket = new WebSocket(URL);
    connected = true;
    socket.addEventListener("message", (e) => {
      console.log(e);
      ports.forEach((port) => port.postMessage(e.data));
      //port.postMessage(e.data);
    });
  }
}

function sentToWS(data) {
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

self.addEventListener(
  "connect",
  (e) => {
    const port = e.ports[0];
    ports.push(port);
    console.log("ports =>", e.ports);

    // Анализируем пришедшее из основного потока сообщение и выполняем требуемые операции
    function dispatch(data) {
      console.log(e);
      // Если эндпоинт не установлен и приходит запрос на его установку - устанавливаем
      if (!URL) {
        URL = data.URL;
        // port.postMessage(`Установлен эндпоинт ${URL}`);
        createSocket();
      }
      sentToWS(data);
    }

    port.addEventListener("message", (e) => dispatch(e.data), false);
    port.start();
  },
  false
);
