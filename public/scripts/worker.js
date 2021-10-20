// const API_KEY =
//   "9a54c61b45ac389b252ee8b8eab0a0521930b18780641228922688851af95c78";
// const socket = new WebSocket(
//   `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
// );

var URL = "";
var socket = null;

self.addEventListener(
  "connect",
  function (e) {
    const port = e.ports[0];

    port.addEventListener(
      "message",
      function (e) {
        if (!URL) {
          URL = e.data.URL;
          port.postMessage(`Установлен эндпоинт ${URL}`);
          socket = new WebSocket(URL);
        } else {
          port.postMessage(`Эндпоинт УЖЕ установлен =${URL}`);
        }
      },
      false
    );
    port.start();
  },
  false
);
console.log(socket);

// function sendToWs(message) {
//   const stringifiedMessage = JSON.stringify(message);

//   // Если WS уже открыт, то шлём сообщение туда и завершаем функцию
//   if (socket.readyState === WebSocket.OPEN) {
//     socket.send(stringifiedMessage);
//     return;
//   }

//   // Если WS закрыт, то отрываем его и уже тогдв шлём сообщение туда
//   socket.addEventListener(
//     "open",
//     () => {
//       socket.send(stringifiedMessage);
//     },
//     { once: true }
//   );
// }
