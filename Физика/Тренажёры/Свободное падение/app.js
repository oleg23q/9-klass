"use strict";

const STORAGE_KEY = "grade9-free-fall-progress-v1";

const tasks = [
  {
    id: "speed-2",
    type: "формула v = gt",
    title: "Скорость через 2 секунды",
    text: "Тело отпустили без начальной скорости. Найди скорость через 2 с при g = 10 м/с². Введи число в м/с.",
    placeholder: "м/с",
    hint: "Умножь g на время: v = gt.",
    check: value => near(numberValue(value), 20),
    solution: "v = gt = 10 · 2 = 20 м/с вниз."
  },
  {
    id: "distance-3",
    type: "формула h = gt²/2",
    title: "Путь за 3 секунды",
    text: "Какой путь пройдёт тело за 3 с при g = 10 м/с²? Введи число в метрах.",
    placeholder: "м",
    hint: "Сначала возведи 3 в квадрат, затем умножь на 10 и раздели на 2.",
    check: value => near(numberValue(value), 45),
    solution: "h = gt²/2 = 10 · 3² / 2 = 45 м."
  },
  {
    id: "time-80",
    type: "обратная задача",
    title: "Время падения с 80 метров",
    text: "Тело отпустили с высоты 80 м. Найди время падения при g = 10 м/с². Введи число в секундах.",
    placeholder: "с",
    hint: "Вырази время: t = √(2h/g).",
    check: value => near(numberValue(value), 4),
    solution: "t = √(2 · 80 / 10) = √16 = 4 с."
  },
  {
    id: "speed-20m",
    type: "две формулы",
    title: "Скорость перед ударом",
    text: "Тело падает с высоты 20 м. Найди скорость перед ударом при g = 10 м/с². Введи число в м/с.",
    placeholder: "м/с",
    hint: "Можно найти t, а затем v, или использовать v² = 2gh.",
    check: value => near(numberValue(value), 20),
    solution: "v = √(2gh) = √(2 · 10 · 20) = √400 = 20 м/с вниз."
  },
  {
    id: "axis-sign",
    type: "направление и знак",
    title: "Ось направлена вверх",
    text: "Как записать проекцию ускорения свободного падения на ось Oy, направленную вверх? Введи знак и обозначение.",
    placeholder: "например, -g",
    hint: "Вектор g направлен вниз, то есть против положительного направления оси.",
    check: value => /-\s*g|минус\s*g|отриц/i.test(normalize(value)),
    solution: "aᵧ = −g. Ускорение направлено вниз, против оси Oy."
  },
  {
    id: "mass-compare",
    type: "физическое объяснение",
    title: "Шары разной массы",
    text: "Шары массой 1 кг и 5 кг одновременно отпустили с одной высоты в вакууме. Какой упадёт раньше?",
    placeholder: "ответ словами",
    hint: "Сравни a = mg/m для обоих тел.",
    check: value => /(одновременно|одинаков|в одно время|никто)/i.test(normalize(value)),
    solution: "Они упадут одновременно: a = mg/m = g для любого из шаров."
  }
];

const state = {
  animationId: 0,
  running: false,
  solved: loadProgress()
};

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function normalize(value) {
  return String(value ?? "").trim().replaceAll("−", "-").replaceAll(",", ".");
}

function numberValue(value) {
  const match = normalize(value).match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
}

function near(actual, expected, tolerance = 0.03) {
  return Number.isFinite(actual) && Math.abs(actual - expected) <= Math.max(.03, Math.abs(expected) * tolerance);
}

function format(value, digits = 2) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

function loadProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.solved));
}

function initTheme() {
  const saved = localStorage.getItem("grade9-free-fall-theme");
  const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) document.documentElement.dataset.theme = "dark";
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("grade9-free-fall-theme", next);
  });
}

function initNavigation() {
  $all(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      $all(".nav-btn").forEach(item => item.classList.toggle("active", item === button));
      $all(".content-section").forEach(section => section.classList.toggle("active", section.id === button.dataset.target));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function currentExperiment() {
  const height = Number($("#heightInput").value);
  const g = Number($("#worldSelect").value);
  const mass = Number($("#massSelect").value);
  const time = Math.sqrt(2 * height / g);
  const speed = g * time;
  return { height, g, mass, time, speed };
}

function renderScale() {
  const { height, mass } = currentExperiment();
  $("#heightLabel").textContent = format(height, 0);
  $("#ballMass").textContent = `${mass} кг`;
  const scale = $("#heightScale");
  scale.replaceChildren();
  [0, .25, .5, .75, 1].forEach(fraction => {
    const y = 58 + 302 * fraction;
    const value = height * (1 - fraction);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "80");
    line.setAttribute("x2", "110");
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "24");
    text.setAttribute("y", y + 5);
    text.textContent = `${format(value, 1)} м`;
    scale.append(line, text);
  });
}

function setMeters(time = 0, distance = 0, speed = 0) {
  $("#timeMeter").textContent = `${format(time, 2)} с`;
  $("#distanceMeter").textContent = `${format(distance, 1)} м`;
  $("#speedMeter").textContent = `${format(speed, 1)} м/с`;
}

function resetExperiment(message = "Сделай прогноз и запусти модель.") {
  cancelAnimationFrame(state.animationId);
  state.running = false;
  $("#runBtn").disabled = false;
  $("#fallBall").setAttribute("cy", "58");
  setMeters();
  renderScale();
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = message;
}

function predictionMessage(time, speed) {
  const predictedTime = numberValue($("#timePrediction").value);
  const predictedSpeed = numberValue($("#speedPrediction").value);
  if (!Number.isFinite(predictedTime) || !Number.isFinite(predictedSpeed)) {
    return { kind: "error", text: `Результат: t = ${format(time)} с, v = ${format(speed, 1)} м/с. В следующий раз сначала запиши оба прогноза.` };
  }
  const timeOk = near(predictedTime, time, .05);
  const speedOk = near(predictedSpeed, speed, .05);
  if (timeOk && speedOk) return { kind: "success", text: `Точный прогноз! t = ${format(time)} с, v = ${format(speed, 1)} м/с.` };
  const pieces = [];
  if (!timeOk) pieces.push(`время ${format(time)} с`);
  if (!speedOk) pieces.push(`скорость ${format(speed, 1)} м/с`);
  return { kind: "error", text: `Проверь расчёт: ${pieces.join(", ")}. Используй t = √(2h/g), затем v = gt.` };
}

function runExperiment() {
  if (state.running) return;
  const experiment = currentExperiment();
  const visualDuration = Math.max(1300, Math.min(3500, experiment.time * 650));
  const start = performance.now();
  state.running = true;
  $("#runBtn").disabled = true;
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = "Наблюдай: за равные следующие промежутки тело проходит всё больший путь.";

  const frame = now => {
    const progress = Math.min(1, (now - start) / visualDuration);
    const physicalTime = experiment.time * progress;
    const distance = .5 * experiment.g * physicalTime ** 2;
    const speed = experiment.g * physicalTime;
    const position = 58 + 302 * Math.min(1, distance / experiment.height);
    $("#fallBall").setAttribute("cy", String(position));
    setMeters(physicalTime, Math.min(distance, experiment.height), speed);
    if (progress < 1) {
      state.animationId = requestAnimationFrame(frame);
      return;
    }
    state.running = false;
    $("#runBtn").disabled = false;
    const result = predictionMessage(experiment.time, experiment.speed);
    feedback.className = `feedback ${result.kind}`;
    feedback.textContent = result.text;
  };
  state.animationId = requestAnimationFrame(frame);
}

function compareMasses() {
  const { height, g, time } = currentExperiment();
  resetExperiment(`Для 1 кг и 5 кг: t = √(2 · ${format(height, 0)} / ${format(g, 2)}) = ${format(time)} с. В модели без воздуха массы упадут одновременно.`);
  $("#labFeedback").classList.add("success");
}

function initExperiment() {
  $("#heightInput").addEventListener("input", () => resetExperiment("Высота изменилась. Сделай новый прогноз."));
  $("#worldSelect").addEventListener("change", () => resetExperiment("Значение g изменилось. Сравни результат с прежним."));
  $("#massSelect").addEventListener("change", () => resetExperiment("Масса изменилась. Проверь, повлияет ли она на время."));
  $("#runBtn").addEventListener("click", runExperiment);
  $("#resetBtn").addEventListener("click", () => resetExperiment());
  $("#compareBtn").addEventListener("click", compareMasses);
  resetExperiment();
}

function calculate() {
  const mode = $("#calcMode").value;
  const value = Number($("#calcValue").value);
  const g = Number($("#calcG").value);
  const result = $("#calculationResult");
  if (!(value > 0) || !(g > 0)) {
    result.innerHTML = "Введите положительные значения.";
    return;
  }

  if (mode === "height") {
    const time = Math.sqrt(2 * value / g);
    const speed = g * time;
    result.innerHTML = `<strong>Ответ: t = ${format(time)} с, v = ${format(speed, 2)} м/с.</strong>
      <ol><li>Модель: v₀ = 0, сопротивления воздуха нет.</li>
      <li>Время: t = √(2h/g) = √(2 · ${format(value)} / ${format(g)}) = ${format(time)} с.</li>
      <li>Скорость: v = gt = ${format(g)} · ${format(time)} = ${format(speed, 2)} м/с.</li></ol>`;
  } else {
    const distance = .5 * g * value ** 2;
    const speed = g * value;
    result.innerHTML = `<strong>Ответ: h = ${format(distance, 2)} м, v = ${format(speed, 2)} м/с.</strong>
      <ol><li>Путь: h = gt²/2 = ${format(g)} · ${format(value)}² / 2 = ${format(distance, 2)} м.</li>
      <li>Скорость: v = gt = ${format(g)} · ${format(value)} = ${format(speed, 2)} м/с.</li>
      <li>Проверка: при большем времени и путь, и скорость растут.</li></ol>`;
  }
}

function initCalculator() {
  $("#calcMode").addEventListener("change", event => {
    const heightMode = event.target.value === "height";
    $("#calcValueLabel").textContent = heightMode ? "Высота h, м" : "Время t, с";
    $("#calcValue").value = heightMode ? "45" : "3";
    $("#calculationResult").replaceChildren();
  });
  $("#calculateBtn").addEventListener("click", calculate);
}

function renderTasks() {
  const grid = $("#taskGrid");
  grid.replaceChildren();
  tasks.forEach((task, index) => {
    const card = document.createElement("article");
    card.className = `task-card${state.solved[task.id] ? " completed" : ""}`;
    card.dataset.taskId = task.id;
    card.innerHTML = `
      <div class="task-topline"><span class="task-number">Задача ${index + 1}</span><span class="task-type">${task.type}</span></div>
      <h3>${task.title}</h3>
      <p>${task.text}</p>
      <div class="answer-row">
        <input class="task-answer" aria-label="Ответ на задачу ${index + 1}" placeholder="${task.placeholder}" value="${state.solved[task.id]?.answer || ""}">
        <button class="btn primary task-check" type="button">Проверить</button>
      </div>
      <button class="hint-toggle" type="button">Показать подсказку</button>
      <p class="task-hint" hidden>${task.hint}</p>
      <div class="task-feedback${state.solved[task.id] ? " success" : ""}" aria-live="polite">${state.solved[task.id] ? `Верно. ${task.solution}` : "Ответ ещё не проверен."}</div>`;

    $(".task-check", card).addEventListener("click", () => checkTask(task, card));
    $(".task-answer", card).addEventListener("keydown", event => {
      if (event.key === "Enter") checkTask(task, card);
    });
    $(".hint-toggle", card).addEventListener("click", event => {
      const hint = $(".task-hint", card);
      hint.hidden = !hint.hidden;
      event.currentTarget.textContent = hint.hidden ? "Показать подсказку" : "Скрыть подсказку";
    });
    grid.append(card);
  });
  updateScore();
}

function checkTask(task, card) {
  const input = $(".task-answer", card);
  const feedback = $(".task-feedback", card);
  const answer = input.value;
  if (!answer.trim()) {
    feedback.className = "task-feedback error";
    feedback.textContent = "Сначала запиши собственный ответ.";
    return;
  }
  if (task.check(answer)) {
    state.solved[task.id] = { answer };
    saveProgress();
    card.classList.add("completed");
    feedback.className = "task-feedback success";
    feedback.textContent = `Верно. ${task.solution}`;
  } else {
    delete state.solved[task.id];
    saveProgress();
    card.classList.remove("completed");
    feedback.className = "task-feedback error";
    feedback.textContent = "Пока неверно. Открой подсказку, проверь модель, формулу и единицы, затем попробуй ещё раз.";
  }
  updateScore();
}

function updateScore() {
  const count = tasks.filter(task => state.solved[task.id]).length;
  $("#scoreValue").textContent = `${count}/${tasks.length}`;
}

function initTasks() {
  renderTasks();
  $("#resetProgressBtn").addEventListener("click", () => {
    state.solved = {};
    saveProgress();
    renderTasks();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initExperiment();
  initCalculator();
  initTasks();
});
