// Глобальные переменные для управления сценами и интерфейсом
let currentSceneId = "scene1"; // Текущая сцена
let currentSceneData; // Данные текущей сцены
let loadedImages = {}; // Кэш для загруженных фоновых изображений
let visibleButtons = []; // Список кнопок, отображаемых на экране

// Параметры для текстового блока
const textBoxPadding = 20; // Отступы текстового блока
const textBoxHeight = 150; // Высота текстового блока
const textBoxRadius = 10; // Скругление углов текстового блока

// Параметры для кнопок
const buttonHeight = 40; // Высота кнопок
const buttonPadding = 10; // Отступ между кнопками
const buttonRadius = 5; // Скругление углов кнопок
const buttonFontSize = 16; // Размер шрифта текста на кнопках
const buttonTextColor = [255, 255, 255]; // Цвет текста кнопок (белый)
const buttonColor = [68, 68, 68]; // Цвет кнопок (темно-серый)
const buttonHoverColor = [102, 102, 102]; // Цвет кнопок при наведении (светло-серый)

// Функция для предварительной загрузки ресурсов (например, изображений)
function preload() {
  for (const sceneKey in story) {
    if (story.hasOwnProperty(sceneKey)) {
      const scene = story[sceneKey];
      if (scene.background && !loadedImages[scene.background]) {
        try {
          // Загружаем изображение для фона сцены
          loadedImages[scene.background] = loadImage(scene.background);
          console.log("Loaded image:", scene.background);
        } catch (error) {
          console.error("Error loading image:", scene.background, error);
        }
      }
    }
  }
}

// Функция для настройки холста и начальной сцены
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight); // Создаем адаптивный холст
  textFont('Arial'); // Устанавливаем шрифт по умолчанию
  loadScene(currentSceneId); // Загружаем начальную сцену
}

// Основная функция отрисовки, вызывается каждый кадр
function draw() {
  // Отображение фона текущей сцены
  if (currentSceneData && loadedImages[currentSceneData.background]) {
    image(loadedImages[currentSceneData.background], 0, 0, width, height);
  } else {
    // Если фон не загружен, показываем сообщение об ошибке
    background(30); // Темный фон
    fill(255); // Белый текст
    textAlign(CENTER, CENTER);
    text("Loading background or error...", width / 2, height / 2);
  }

  // Отображение текстового блока
  if (currentSceneData) {
    const tbX = textBoxPadding;
    const tbY = height - textBoxHeight - textBoxPadding * 2 - (visibleButtons.length > 0 ? (buttonHeight + buttonPadding) * visibleButtons.length + buttonPadding : 0);
    const tbW = width - textBoxPadding * 2;
    const tbH = textBoxHeight;

    fill(0, 0, 0, 150); // Полупрозрачный черный фон
    noStroke();
    rect(tbX, tbY, tbW, tbH, textBoxRadius); // Рисуем текстовый блок

    fill(255); // Белый текст
    textSize(18);
    textAlign(LEFT, TOP);
    text(currentSceneData.text, tbX + textBoxPadding, tbY + textBoxPadding, tbW - textBoxPadding * 2, tbH - textBoxPadding * 2);
  }

  // Отображение кнопок
  textAlign(CENTER, CENTER);
  textSize(buttonFontSize);
  for (let i = 0; i < visibleButtons.length; i++) {
    let btn = visibleButtons[i];
    // Меняем цвет кнопки при наведении
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      fill(buttonHoverColor);
    } else {
      fill(buttonColor);
    }
    noStroke();
    rect(btn.x, btn.y, btn.w, btn.h, buttonRadius); // Рисуем кнопку

    fill(buttonTextColor); // Цвет текста кнопки
    text(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2); // Текст кнопки
  }
}

// Обработка изменения размера окна
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Изменяем размер холста
  prepareButtons(); // Пересчитываем позиции кнопок
}

// Функция для загрузки сцены по её идентификатору
function loadScene(id) {
  if (!story[id]) {
    // Если сцена не найдена, показываем сообщение об ошибке
    console.error("Scene with id not found:", id);
    currentSceneData = { text: "Ошибка: Сцена '" + id + "' не найдена.", background: Object.keys(loadedImages)[0] || null };
    visibleButtons = [{
        text: "Начать сначала",
        next: "scene1",
        isRestart: true
    }];
    prepareButtons();
    return;
  }

  // Загружаем данные сцены
  currentSceneId = id;
  currentSceneData = story[id];
  visibleButtons = [];

  // Добавляем кнопки выбора
  if (currentSceneData.choices) {
    currentSceneData.choices.forEach(choice => {
      visibleButtons.push({ text: choice.text, next: choice.next });
    });
  } else if (currentSceneData.next) {
    visibleButtons.push({ text: "Далее", next: currentSceneData.next });
  } else {
    visibleButtons.push({ text: "Начать сначала", next: "scene1", isRestart: true });
  }
  prepareButtons();
}

// Функция для расчета позиций кнопок
function prepareButtons() {
  const totalButtons = visibleButtons.length;
  if (totalButtons === 0) return;

  const buttonAreaY = height - textBoxPadding - (buttonHeight + buttonPadding) * totalButtons;
  const buttonWidth = width / 2;

  for (let i = 0; i < totalButtons; i++) {
    let btn = visibleButtons[i];
    btn.w = buttonWidth;
    btn.h = buttonHeight;
    btn.x = (width - btn.w) / 2;
    btn.y = buttonAreaY + i * (buttonHeight + buttonPadding);
  }
}

// Обработка нажатий мыши
function mousePressed() {
  for (let i = 0; i < visibleButtons.length; i++) {
    let btn = visibleButtons[i];
    // Проверяем, нажата ли кнопка
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      loadScene(btn.next); // Загружаем следующую сцену
      break;
    }
  }
}

// Обработка движения мыши для отображения/скрытия заголовка
document.addEventListener('mousemove', (event) => {
  const header = document.querySelector('header');
  if (event.clientY <= 50) {
    header.classList.add('visible'); // Показываем заголовок
  } else {
    header.classList.remove('visible'); // Скрываем заголовок
  }
});