let currentSceneId = "scene1";
let currentSceneData;
let loadedImages = {}; // Кэш для загруженных фоновых изображений
let visibleButtons = []; // Кнопки, отображаемые на экране

// Параметры для текстового блока (можно оставить фиксированными или сделать адаптивными)
const textBoxPadding = 20; // Отступы от краев экрана
const textBoxHeight = 150; // Высота текстового блока (фиксированная)
const textBoxRadius = 10; // Скругление углов

// Параметры для кнопок
const buttonHeight = 40; // Высота кнопки (фиксированная)
const buttonPadding = 10; // Отступ между кнопками
const buttonRadius = 5;
const buttonFontSize = 16; // Размер шрифта кнопок (фиксированный)
const buttonTextColor = [255, 255, 255]; // Белый
const buttonColor = [68, 68, 68, 200]; // #444 (полупрозрачный)
const buttonHoverColor = [102, 102, 102, 200]; // #666 (полупрозрачный)
const buttonFixedW = 300; // Желаемая фиксированная ширина кнопки (в пикселях)
const buttonTextPadding = 10; // Внутренний отступ текста внутри кнопки

// Предполагается, что объект story определен где-то еще, например:
/*
const story = {
  scene1: {
    text: "Вы стоите на распутье. Куда пойдете?",
    background: "images/forest.jpg",
    choices: [
      { text: "Налево к деревне", next: "scene_village" },
      { text: "Направо к горам", next: "scene_mountains" },
      { text: "Третий длинный вариант выбора, который должен перенестись на новую строку", next: "scene_long_choice" }
    ]
  },
  // ... другие сцены
};
*/


function preload() {
  // Предварительно загружаем все фоновые изображения
  // Это предотвращает задержки при смене сцен
  for (const sceneKey in story) {
    if (story.hasOwnProperty(sceneKey)) {
      const scene = story[sceneKey];
      if (scene.background && !loadedImages[scene.background]) {
        try {
          // Используем load an image асинхронно
          loadImage(scene.background,
            img => {
              loadedImages[scene.background] = img;
              console.log("Загружено изображение:", scene.background);
            },
            err => {
              console.error("Ошибка загрузки изображения:", scene.background, err);
              // Можно загрузить "заглушку" или обработать ошибку
            }
          );
        } catch (error) {
          console.error("Ошибка при вызове loadImage:", scene.background, error);
        }
      }
    }
  }
}

function setup() {
  // Создаем холст размером с окно браузера
  let canvas = createCanvas(windowWidth, windowHeight);
  // Это гарантирует, что холст будет корректно позиционирован в HTML
  // canvas.parent('canvas-container'); // Если вы хотите поместить его в определенный div

  textFont('Arial'); // Установка шрифта по умолчанию
  loadScene(currentSceneId); // Загружаем первую сцену
}

function draw() {
  // 1. Отрисовка фона
  // Используем width и height - текущие размеры холста (окна)
  if (currentSceneData && loadedImages[currentSceneData.background]) {
    image(loadedImages[currentSceneData.background], 0, 0, width, height);
  } else {
    background(30); // Темный фон по умолчанию, если изображение не загружено
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24); // Немного больший текст для сообщения
    text("Загрузка фона или ошибка...", width / 2, height / 2);
  }

  // 2. Отрисовка текстового блока
  if (currentSceneData) {
    const tbX = textBoxPadding;
    const tbW = width - textBoxPadding * 2;
    const tbH = textBoxHeight; // Фиксированная высота
    // Располагаем текстовый блок у нижнего края экрана
    const tbY = height - tbH - textBoxPadding;

    fill(0, 0, 0, 180); // Полупрозрачный черный фон
    noStroke();
    rect(tbX, tbY, tbW, tbH, textBoxRadius);

    fill(255); // Белый текст
    textSize(18); // Фиксированный размер шрифта текста истории
    textAlign(LEFT, TOP); // Выравнивание для текста в блоке
    // Внутренние отступы для текста в блоке
    // Ограничиваем текст шириной блока
    text(currentSceneData.text, tbX + textBoxPadding, tbY + textBoxPadding, tbW - textBoxPadding * 2, tbH - textBoxPadding * 2);
  }

  // 3. Отрисовка кнопок
  // Важно: сохраняем текущее выравнивание текста перед отрисовкой кнопок,
  // так как будем его временно менять.
  let currentTextAlign = { horiz: horizontalAlign, vert: verticalAlign };

  textSize(buttonFontSize); // Фиксированный размер шрифта кнопок

  for (let i = 0; i < visibleButtons.length; i++) {
    let btn = visibleButtons[i];
    // Проверка наведения мыши (для ПК)
    let isHover = mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h;

    fill(isHover ? buttonHoverColor : buttonColor);
    noStroke();
    rect(btn.x, btn.y, btn.w, btn.h, buttonRadius);

    // --- Исправляем выравнивание текста в кнопке ---
    fill(buttonTextColor);

    // Временно устанавливаем LEFT, TOP для более предсказуемого поведения text() с maxWidth
    textAlign(LEFT, TOP);

    // Вычисляем внутренние отступы для текста
    const textX = btn.x + buttonTextPadding;
    const textY = btn.y + buttonTextPadding;
    const textW = btn.w - buttonTextPadding * 2;
    const textH = btn.h - buttonTextPadding * 2; // Ограничиваем высоту текста высотой кнопки

    // Отрисовываем текст внутри кнопки с учетом внутренних отступов и переноса строк
    // NOTE: p5 text() с maxWidth и maxHeight ведет себя так, что textY и textX
    // являются верхним левым углом *ограничивающего* прямоугольника для текста.
    // Для *центрирования* текста внутри кнопки, даже при LEFT, TOP выравнивании,
    // нужно немного доработать. Простой способ для центрирования одно- или двух-строчного текста:
    // использовать CENTER, CENTER, но с правильными размерами ограничивающего прямоугольника.
    // Попробуем вернуться к CENTER, CENTER, но с точным maxWidth и maxHeight:

    textAlign(CENTER, CENTER); // Возвращаем CENTER для центрирования
    text(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2, btn.w - buttonTextPadding * 2, btn.h - buttonTextPadding * 2);

    // Если все равно текст уезжает, можно попробовать рассчитать смещение для LEFT, TOP:
    /*
    let textMeasuredH = textAscent() + textDescent(); // Примерная высота одной строки
    let estimatedLines = ceil(textWidth(btn.text) / (btn.w - buttonTextPadding * 2));
    let totalTextHeight = estimatedLines * textMeasuredH; // Очень грубая оценка
    let centeredTextY = btn.y + btn.h/2 - totalTextHeight/2; // Центрирование по вертикали

    textAlign(LEFT, TOP); // Рисуем от верхнего левого угла
    text(btn.text, btn.x + buttonTextPadding, centeredTextY, btn.w - buttonTextPadding * 2);
    */
    // Но чаще всего CENTER, CENTER с точными размерами работает лучше.

  }

  // Восстанавливаем исходное выравнивание текста после отрисовки кнопок
  textAlign(currentTextAlign.horiz, currentTextAlign.vert);
}

// Эта функция вызывается при изменении размера окна браузера
function windowResized() {
  // Изменяем размер холста под новый размер окна
  resizeCanvas(windowWidth, windowHeight);
  // Пересчитываем позиции кнопок, так как размеры экрана изменились
  prepareButtons();
  // Пересчитывать позицию текстового блока в draw() не нужно,
  // так как она вычисляется там динамически
}


function loadScene(id) {
  if (!story[id]) {
    console.error("Сцена с id не найдена:", id);
    currentSceneData = {
      text: "Ошибка: Сцена '" + id + "' не найдена. Нажмите 'Начать сначала'.",
      background: null // Оставим текущий фон или поставим заглушку
    };
    visibleButtons = [{
      text: "Начать сначала",
      next: "scene1",
      isRestart: true
    }];
    prepareButtons(); // Обновляем кнопки
    return;
  }

  currentSceneId = id;
  currentSceneData = story[id];
  visibleButtons = []; // Очищаем старые кнопки

  // Загружаем фоновое изображение для новой сцены, если оно еще не в кэше
  if (currentSceneData.background && !loadedImages[currentSceneData.background]) {
     loadImage(currentSceneData.background,
            img => {
              loadedImages[currentSceneData.background] = img;
              console.log("Загружено изображение (динамически):", currentSceneData.background);
            },
            err => {
              console.error("Ошибка загрузки изображения (динамически):", currentSceneData.background, err);
            }
          );
  }


  if (currentSceneData.choices) {
    currentSceneData.choices.forEach(choice => {
      visibleButtons.push({
        text: choice.text,
        next: choice.next
      });
    });
  } else if (currentSceneData.next) {
    visibleButtons.push({
      text: "Далее",
      next: currentSceneData.next
    });
  } else {
    // Конец истории или нет `next` (как в credits)
    visibleButtons.push({
      text: "Начать сначала",
      next: "scene1",
      isRestart: true
    });
  }

  prepareButtons(); // Пересчитываем и устанавливаем позиции новых кнопок
}

function prepareButtons() {
  const totalButtons = visibleButtons.length;
  if (totalButtons === 0) return;

  // Определяем Y координату, с которой начнем рисовать кнопки (над текстовым блоком)
  // Нижний край кнопочной области: Отступ снизу (textBoxPadding) + Высота текстового блока (textBoxHeight) + Отступ между блоком и кнопками (buttonPadding)
  const buttonAreaBottom = height - textBoxPadding - textBoxHeight - buttonPadding;

  // Определяем Y координату для верхнего края самой нижней кнопки
  const startY = buttonAreaBottom - buttonHeight;

  for (let i = 0; i < totalButtons; i++) {
    let btn = visibleButtons[i];

    // Ширина кнопки: используем фиксированную ширину, но не более ширины экрана
    // минус отступы по бокам (textBoxPadding используется как общий отступ).
    btn.w = min(buttonFixedW, width - textBoxPadding * 2);

    // Высота кнопки фиксирована
    btn.h = buttonHeight;

    // Горизонтальное позиционирование: центрируем кнопку
    btn.x = (width - btn.w) / 2;

    // Вертикальное позиционирование: Стек кнопок над текстовым блоком,
    // начиная от startY и двигаясь вверх.
    // Для кнопки с индексом i (0, 1, 2...) ее верхний край будет:
    // startY (верхний край 0-й кнопки) - i * (Высота кнопки + Отступ между кнопками)
    btn.y = startY - i * (buttonHeight + buttonPadding);

    // Дополнительная проверка на случай, если кнопок очень много
    if (btn.y < 0) {
        console.warn("Кнопки выходят за верхний край экрана!");
        // Здесь можно добавить логику, чтобы кнопки не уходили вверх, например,
        // уменьшить buttonHeight или fontSize, или добавить прокрутку.
    }
  }
}


function mousePressed() {
  // Проверяем клики по кнопкам
  for (let i = 0; i < visibleButtons.length; i++) {
    let btn = visibleButtons[i];
    // Проверка попадания клика в область кнопки
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      // Если клик попал в кнопку, загружаем следующую сцену
      loadScene(btn.next);
      break; // Прерываем цикл, так как клик обработан
    }
  }
}

// Не забудьте добавить эти стили в ваш HTML, чтобы убрать прокрутку и отступы:
/*
<style>
  body {
    margin: 0;
    overflow: hidden; // Убирает прокрутку
  }
  canvas {
    display: block; // Убирает лишний нижний отступ под canvas
  }
</style>
*/

document.addEventListener('mousemove', (event) => {
  const header = document.querySelector('header');
  if (event.clientY <= 50) {
    header.classList.add('visible'); // Show header
  } else {
    header.classList.remove('visible'); // Hide header
  }
});