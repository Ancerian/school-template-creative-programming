let currentSceneId = "scene1";
let currentSceneData;
let loadedImages = {}; // Кэш для загруженных фоновых изображений
let visibleButtons = []; // Кнопки, отображаемые на экране

// Размеры холста - можно сделать адаптивными или фиксированными
const canvasWidth = 800;
const canvasHeight = 600;

// Параметры для текстового блока
const textBoxPadding = 20;
const textBoxHeight = 150; // Высота текстового блока
const textBoxRadius = 10; // Скругление углов как в CSS

// Параметры для кнопок
const buttonHeight = 40;
const buttonPadding = 10; // Отступ между кнопками
const buttonRadius = 5;
const buttonFontSize = 16;
const buttonTextColor = [255, 255, 255]; // Белый
const buttonColor = [68, 68, 68]; // #444
const buttonHoverColor = [102, 102, 102]; // #666

function preload() {
  // Предварительно загружаем все фоновые изображения
  // Это предотвращает задержки при смене сцен
  for (const sceneKey in story) {
    if (story.hasOwnProperty(sceneKey)) {
      const scene = story[sceneKey];
      if (scene.background && !loadedImages[scene.background]) {
        try {
          loadedImages[scene.background] = loadImage(scene.background);
          console.log("Loaded image:", scene.background);
        } catch (error) {
          console.error("Error loading image:", scene.background, error);
          // Можно загрузить "заглушку" или обработать ошибку
          // loadedImages[scene.background] = createGraphics(1,1); // placeholder
        }
      }
    }
  }
}

function setup() {
  let canvas = createCanvas(canvasWidth, canvasHeight);
  // Если ты создал <div id="canvas-container"></div> в HTML:
  // canvas.parent('canvas-container');

  textFont('Arial'); // Установка шрифта по умолчанию
  loadScene(currentSceneId);
}

function draw() {
  // 1. Отрисовка фона
  if (currentSceneData && loadedImages[currentSceneData.background]) {
    image(loadedImages[currentSceneData.background], 0, 0, width, height);
  } else {
    background(30); // Темный фон по умолчанию, если изображение не загружено
    fill(255);
    textAlign(CENTER,CENTER);
    text("Loading background or error...", width/2, height/2);
  }

  // 2. Отрисовка текстового блока
  if (currentSceneData) {
    const tbX = textBoxPadding;
    const tbY = height - textBoxHeight - textBoxPadding * 2 - (visibleButtons.length > 0 ? (buttonHeight + buttonPadding) * visibleButtons.length + buttonPadding : 0) ; // Динамический Y, чтобы не перекрывать кнопки
    const tbW = width - textBoxPadding * 2;
    const tbH = textBoxHeight;

    fill(0, 0, 0, 150); // Полупрозрачный черный фон (rgba(0,0,0,0.6))
    noStroke();
    rect(tbX, tbY, tbW, tbH, textBoxRadius);

    fill(255); // Белый текст
    textSize(18);
    textAlign(LEFT, TOP); // Выравнивание для текста в блоке
    // Внутренние отступы для текста в блоке
    text(currentSceneData.text, tbX + textBoxPadding, tbY + textBoxPadding, tbW - textBoxPadding * 2, tbH - textBoxPadding * 2);
  }

  // 3. Отрисовка кнопок
  textAlign(CENTER, CENTER);
  textSize(buttonFontSize);
  for (let i = 0; i < visibleButtons.length; i++) {
    let btn = visibleButtons[i];
    // Проверка наведения мыши
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      fill(buttonHoverColor);
    } else {
      fill(buttonColor);
    }
    noStroke();
    rect(btn.x, btn.y, btn.w, btn.h, buttonRadius);

    fill(buttonTextColor);
    text(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
  }
}

function loadScene(id) {
  if (!story[id]) {
    console.error("Scene with id not found:", id);
    currentSceneData = { text: "Ошибка: Сцена '" + id + "' не найдена.", background: Object.keys(loadedImages)[0] || null }; // Показать какую-то ошибку
    visibleButtons = [{
        text: "Начать сначала",
        next: "scene1",
        isRestart: true
    }];
    prepareButtons();
    return;
  }

  currentSceneId = id;
  currentSceneData = story[id];
  visibleButtons = []; // Очищаем старые кнопки

  if (currentSceneData.choices) {
    currentSceneData.choices.forEach(choice => {
      visibleButtons.push({ text: choice.text, next: choice.next });
    });
  } else if (currentSceneData.next) {
    visibleButtons.push({ text: "Далее", next: currentSceneData.next });
  } else {
    // Конец истории или нет `next` (как в credits)
    visibleButtons.push({ text: "Начать сначала", next: "scene1", isRestart: true });
  }
  prepareButtons();
}

function prepareButtons() {
    const totalButtons = visibleButtons.length;
    if (totalButtons === 0) return;

    // Располагаем кнопки под текстовым блоком
    // Можно сделать более сложную логику для горизонтального расположения, если кнопок мало
    const buttonAreaY = height - textBoxPadding - (buttonHeight + buttonPadding) * totalButtons;
    const buttonWidth = width / 2; // Ширина кнопки (можно настроить)

    for (let i = 0; i < totalButtons; i++) {
        let btn = visibleButtons[i];
        btn.w = buttonWidth;
        btn.h = buttonHeight;
        btn.x = (width - btn.w) / 2; // Центрируем кнопку
        btn.y = buttonAreaY + i * (buttonHeight + buttonPadding);
    }
}


function mousePressed() {
  for (let i = 0; i < visibleButtons.length; i++) {
    let btn = visibleButtons[i];
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      loadScene(btn.next);
      break; // Прерываем цикл, так как клик обработан
    }
  }
}

// Можно добавить обработку изменения размера окна, если холст адаптивный
// function windowResized() {
//   resizeCanvas(windowWidth, canvasHeight); // или другие размеры
//   prepareButtons(); // Пересчитать позиции кнопок
// }