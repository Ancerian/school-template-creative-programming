const story = {
    scene1: {
      background: "images/темний зал.png",
      text: "Ночь. Зал пуст. Сигнализация не сработала. Камера обриваеться в 03:14. На полу - протеиновий след.",
      next: "scene2"
    },
    scene2: {
      background: "images/темний зал.png",
      text: "Разведчик (мислено): Что-то здесь не так... Надо решить, с чего начать расследование.",
      choices: [
        { text: "Проверить камери и консоль безопасности.", next: "security" },
        { text: "Проанализировать следи протеина.", next: "protein" }
      ]
    },
    security: {
      background: "images/room.jpg",
      text: "Ты подошёл к консоли безопасности и увидел, что камера обрывается в 03:14. Последние кадри - тень, прошедшая мимо камеры с огромним рюкзаком.",
      choices: [
        { text: "Востановить кадри с помощью переносного терминала", next: "hacker" },
        { text: "Проверить список входов по ключ-картам", next: "id" }
      ]
    },
    protein: {
      background: "images/door.jpg",
      text: "Ты подошёл к двери и услышал голос...",
      next: "scene4"
    },
    hide: {
      background: "images/dark.jpg",
      text: "Ты спрятался под кровать и ждёшь...",
      next: "scene5"
    },
    scene4: {
      background: "images/hallway.jpg",
      text: "За дверью оказался охранник. Конец."
    },
    scene5: {
      background: "images/dark.jpg",
      text: "Ты притаился в темноте. Конец."
    }
  };
  