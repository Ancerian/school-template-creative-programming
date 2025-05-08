const story = {
    scene1: {
      background: "images/room.jpg",
      text: "Оператор: \
      Ты просыпаешься в тёмной комнате...",
      next: "scene2"
    },
    scene2: {
      background: "images/room.jpg",
      text: "Свет медленно проникает через шторы...",
      next: "scene3"
    },
    scene3: {
      background: "images/room.jpg",
      text: "Ты слышишь шаги в коридоре. Что делать?",
      choices: [
        { text: "Подойти к двери", next: "door" },
        { text: "Спрятаться под кровать", next: "hide" }
      ]
    },
    door: {
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
  