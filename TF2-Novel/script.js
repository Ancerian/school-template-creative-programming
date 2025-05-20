let currentScene = "scene1";
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const gameEl = document.getElementById("game");

function typeText(element, text) {
    // Устанавливаем текст сразу без анимации
    element.textContent = text;
}

function showScene(id) {
    const sceneData = story[id];
    currentScene = id;

    // Устанавливаем фон сцены
    gameEl.style.backgroundImage = `url('${sceneData.background}')`;

    // Отображаем текст сцены
    typeText(textEl, sceneData.text);

    // Очищаем предыдущие кнопки выбора
    choicesEl.innerHTML = "";

    // Если есть выборы, создаем кнопки для каждого выбора
    if (sceneData.choices) {
        sceneData.choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.textContent = choice.text;
            btn.onclick = () => showScene(choice.next);
            choicesEl.appendChild(btn);
        });
    } else if (sceneData.next) {
        // Если выбора нет, но есть следующая сцена, создаем кнопку "Далее"
        const btn = document.createElement("button");
        btn.textContent = "Далее";
        btn.onclick = () => showScene(sceneData.next);
        choicesEl.appendChild(btn);
    } else {
        // Если это конец истории, создаем кнопку "Начать сначала"
        const btn = document.createElement("button");
        btn.textContent = "Начать сначала";
        btn.onclick = () => showScene("scene1");
        choicesEl.appendChild(btn);
    }
}


document.addEventListener('mousemove', (event) => {
    const header = document.querySelector('header');
    if (event.clientY <= 50) {
      header.classList.add('visible'); // Show header
    } else {
      header.classList.remove('visible'); // Hide header
    }
  });

// Запускаем первую сцену
showScene(currentScene);
