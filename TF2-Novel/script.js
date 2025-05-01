let currentScene = "scene1";
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const gameEl = document.getElementById("game");

function typeText(text, callback) {
  let i = 0;
  textEl.textContent = "";
  function type() {
    if (i < text.length) {
      textEl.textContent += text[i++];
      setTimeout(type, 30); // скорость печати
    } else if (callback) {
      callback();
    }
  }
  type();
}

function showScene(id) {
  const scene = story[id];
  currentScene = id;

  gameEl.style.backgroundImage = `url('${scene.background}')`;

  typeText(scene.text, () => {
    choicesEl.innerHTML = "";

    if (scene.choices) {
      scene.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice.text;
        btn.onclick = () => showScene(choice.next);
        choicesEl.appendChild(btn);
      });
    } else if (scene.next) {
      const btn = document.createElement("button");
      btn.textContent = "Далее";
      btn.onclick = () => showScene(scene.next);
      choicesEl.appendChild(btn);
    } else {
      const btn = document.createElement("button");
      btn.textContent = "Начать сначала";
      btn.onclick = () => showScene("scene1");
      choicesEl.appendChild(btn);
    }
  });
}

showScene(currentScene);
