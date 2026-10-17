"use strict";

const STORAGE_PREFIX = "grade9-throw-up";
const G = 10;

const examples = [
  {
    id: "rise",
    level: "базовый уровень",
    title: "Время подъёма и наибольшая высота",
    text: "Тело брошено вертикально вверх со скоростью 20 м/с. Найди время подъёма и наибольшую высоту. Принять g = 10 м/с².",
    steps: [
      { title: "Дано и ось", body: "v₀ = 20 м/с; g = 10 м/с². Ось Oy направлена вверх, поэтому aᵧ = −g." },
      { title: "Верхняя точка", body: "В верхней точке скорость равна нулю: 0 = v₀ − g·t₁. Скорость равна нулю на мгновение, а ускорение по-прежнему равно g вниз." },
      { title: "Время подъёма", body: "t₁ = v₀ / g = 20 / 10 = 2 с." },
      { title: "Наибольшая высота", body: "H = v₀² / (2g) = 400 / 20 = 20 м." },
      { title: "Проверка", body: "Подставим время в h = v₀t − gt²/2: 20 · 2 − 10 · 4 / 2 = 40 − 20 = 20 м. Результаты совпали." }
    ],
    answer: "t₁ = 2 с; H = 20 м."
  },
  {
    id: "position",
    level: "средний уровень",
    title: "Высота и скорость в заданные моменты",
    text: "Тело брошено вверх со скоростью 25 м/с. Найди скорость и высоту через 1, 2 и 3 секунды. Что показывает знак скорости?",
    steps: [
      { title: "Формулы", body: "v = v₀ − gt и h = v₀t − gt²/2 при v₀ = 25 м/с, g = 10 м/с²." },
      { title: "Через 1 с", body: "v = 25 − 10 = 15 м/с; h = 25 − 5 = 20 м. Скорость положительна: тело летит вверх." },
      { title: "Через 2 с", body: "v = 25 − 20 = 5 м/с; h = 50 − 20 = 30 м. Тело ещё поднимается, но медленнее." },
      { title: "Через 3 с", body: "v = 25 − 30 = −5 м/с; h = 75 − 45 = 30 м. Скорость отрицательна: тело уже падает." },
      { title: "Вывод", body: "Через 2 с и 3 с тело на одной высоте 30 м, скорости равны по модулю (5 м/с), но направлены противоположно. Верхняя точка (v = 0) пройдена в момент 2,5 с." }
    ],
    answer: "t = 1 с: v = 15 м/с, h = 20 м; t = 2 с: v = 5 м/с, h = 30 м; t = 3 с: v = −5 м/с (вниз), h = 30 м."
  },
  {
    id: "lift",
    level: "средний уровень",
    title: "Вес человека в лифте",
    text: "Масса человека 50 кг. Найди его вес в покое, при разгоне лифта вверх с ускорением 1 м/с², при разгоне вниз с ускорением 1 м/с² и при свободном падении лифта.",
    steps: [
      { title: "Вес и сила тяжести", body: "Сила тяжести mg приложена к человеку. Вес P приложен к весам. По третьему закону Ньютона вес равен силе реакции опоры N." },
      { title: "Второй закон для человека", body: "Ось вверх: N − mg = m·a. Отсюда N = m(g + a), где a — проекция ускорения лифта на ось вверх." },
      { title: "Покой и разгон вверх", body: "Покой: P = mg = 500 Н. Вверх (a = +1): P = 50 · 11 = 550 Н — перегрузка." },
      { title: "Разгон вниз и свободное падение", body: "Вниз (a = −1): P = 50 · 9 = 450 Н. Свободное падение (a = −g = −10): P = 50 · 0 = 0." },
      { title: "Смысл", body: "При P = 0 человек в невесомости, хотя сила тяжести 500 Н не исчезла: она сообщает ускорение g." }
    ],
    answer: "500 Н; 550 Н; 450 Н; 0 (невесомость)."
  },
  {
    id: "ball-weightless",
    level: "повышенный уровень",
    title: "Мяч в полёте и в руке",
    text: "Мяч массой 0,4 кг бросают вверх. Каков его вес в полёте? Что происходит с весом, пока рука разгоняет мяч?",
    steps: [
      { title: "Силы в полёте", body: "После отрыва от руки на мяч действует только сила тяжести. По второму закону Ньютона ускорение равно g и направлено вниз — на подъёме, в верхней точке и при падении." },
      { title: "Вес в полёте", body: "Мяч ни на что не давит и не растягивает подвес: ускорение мяча равно g, поэтому P = m(g − g) = 0. Мяч невесом на всей траектории." },
      { title: "В верхней точке", body: "Скорость равна нулю, но ускорение g, поэтому мяч всё равно невесом и начинает падать." },
      { title: "Пока рука разгоняет мяч", body: "Мяч движется вверх с ускорением a (вверх). Тогда на руку он действует с силой m(g + a) > mg — вес больше обычного (перегрузка)." }
    ],
    answer: "В полёте вес равен нулю (невесомость); при разгоне рукой вес больше mg."
  }
];

const tasks = [
  {
    id: "top-acc",
    type: "верхняя точка",
    title: "Ускорение в верхней точке",
    text: "Тело брошено вверх. Чему равен модуль его ускорения в верхней точке траектории? Принять g = 10 м/с².",
    placeholder: "м/с²",
    hint: "Скорость там равна нулю, но на тело по-прежнему действует сила тяжести.",
    check: value => near(numberValue(value), 10),
    answerText: "10 м/с² (направлено вниз).",
    solution: [
      "<b>Разбор.</b> Скорость в верхней точке равна нулю лишь на мгновение. Ускорение определяется силой: действует только сила тяжести, поэтому a = g = 10 м/с², направлено вниз.",
      "<b>Ответ:</b> 10 м/с²."
    ]
  },
  {
    id: "time-up",
    type: "время подъёма",
    title: "Время подъёма",
    text: "Тело брошено вверх со скоростью 40 м/с. Через какое время оно достигнет верхней точки? Ответ в секундах.",
    placeholder: "с",
    hint: "В верхней точке v = 0: t₁ = v₀ / g.",
    check: value => near(numberValue(value), 4),
    answerText: "t₁ = 4 с.",
    solution: [
      "<b>Откуда формула.</b> 0 = v₀ − g·t₁, поэтому t₁ = v₀ / g.",
      "<b>Решение.</b> t₁ = 40 / 10 = 4 с.",
      "<b>Ответ:</b> 4 с."
    ]
  },
  {
    id: "height-max",
    type: "наибольшая высота",
    title: "Наибольшая высота",
    text: "Тело брошено вверх со скоростью 30 м/с. Найди наибольшую высоту подъёма в метрах.",
    placeholder: "м",
    hint: "H = v₀² / (2g).",
    check: value => near(numberValue(value), 45),
    answerText: "H = 45 м.",
    solution: [
      "<b>Откуда формула.</b> Из v² = v₀² − 2gh при v = 0 получаем H = v₀² / (2g).",
      "<b>Решение.</b> H = 30² / (2 · 10) = 900 / 20 = 45 м.",
      "<b>Проверка:</b> t₁ = 3 с, h = 30 · 3 − 10 · 9 / 2 = 90 − 45 = 45 м.",
      "<b>Ответ:</b> 45 м."
    ]
  },
  {
    id: "speed-t2",
    type: "скорость в момент t",
    title: "Скорость через 2 с",
    text: "Тело брошено вверх со скоростью 35 м/с. Найди скорость через 2 с в м/с. Если тело движется вниз, поставь минус.",
    placeholder: "м/с",
    hint: "v = v₀ − gt. Подставь v₀ = 35, t = 2.",
    check: value => near(numberValue(value), 15),
    answerText: "v = 15 м/с (вверх).",
    solution: [
      "<b>Решение.</b> v = 35 − 10 · 2 = 15 м/с.",
      "<b>Смысл:</b> скорость положительна, тело ещё поднимается.",
      "<b>Ответ:</b> 15 м/с."
    ]
  },
  {
    id: "height-t2",
    type: "высота в момент t",
    title: "Высота через 2 с",
    text: "Тело брошено вверх со скоростью 25 м/с. На какой высоте оно окажется через 2 с? Ответ в метрах.",
    placeholder: "м",
    hint: "h = v₀t − gt²/2.",
    check: value => near(numberValue(value), 30),
    answerText: "h = 30 м.",
    solution: [
      "<b>Решение.</b> h = 25 · 2 − 10 · 2² / 2 = 50 − 20 = 30 м.",
      "<b>Проверка:</b> v = 25 − 20 = 5 м/с, тело ещё поднимается.",
      "<b>Ответ:</b> 30 м."
    ]
  },
  {
    id: "flight-time",
    type: "время полёта",
    title: "Время до возвращения",
    text: "Тело брошено вверх со скоростью 15 м/с. Через какое время после броска оно вернётся в точку броска? Ответ в секундах.",
    placeholder: "с",
    hint: "Подъём и падение занимают одинаковое время.",
    check: value => near(numberValue(value), 3),
    answerText: "t = 3 с.",
    solution: [
      "<b>Время подъёма:</b> t₁ = 15 / 10 = 1,5 с.",
      "<b>Симметрия:</b> падение занимает столько же, полёт — 2t₁ = 2 · 1,5 = 3 с.",
      "<b>Проверка:</b> v = 15 − 10 · 3 = −15 м/с, по модулю равна начальной.",
      "<b>Ответ:</b> 3 с."
    ]
  },
  {
    id: "speed-sign",
    type: "знак скорости",
    title: "Скорость через 3 с",
    text: "Тело брошено вверх со скоростью 20 м/с. Найди проекцию скорости через 3 с в м/с (ось направлена вверх).",
    placeholder: "м/с",
    hint: "v = v₀ − gt. Отрицательный результат означает движение вниз.",
    check: value => near(numberValue(value), -10),
    answerText: "v = −10 м/с (тело падает).",
    solution: [
      "<b>Решение.</b> v = 20 − 10 · 3 = −10 м/с.",
      "<b>Смысл:</b> время подъёма 2 с уже прошло, тело движется вниз со скоростью 10 м/с.",
      "<b>Ответ:</b> −10 м/с."
    ]
  },
  {
    id: "needed-v0",
    type: "начальная скорость",
    title: "Какая скорость нужна",
    text: "С какой начальной скоростью нужно бросить тело вверх, чтобы оно поднялось на 20 м? Ответ в м/с.",
    placeholder: "м/с",
    hint: "H = v₀² / (2g), поэтому v₀² = 2gH.",
    check: value => near(numberValue(value), 20),
    answerText: "v₀ = 20 м/с.",
    solution: [
      "<b>Формула.</b> v₀² = 2gH = 2 · 10 · 20 = 400.",
      "<b>Решение.</b> v₀ = √400 = 20 м/с.",
      "<b>Ответ:</b> 20 м/с."
    ]
  },
  {
    id: "weight-rest",
    type: "вес в покое",
    title: "Вес в покое",
    text: "Масса человека 70 кг. Каков его вес в покое в ньютонах? Принять g = 10 м/с².",
    placeholder: "Н",
    hint: "В покое вес равен силе тяжести.",
    check: value => near(numberValue(value), 700),
    answerText: "P = 700 Н.",
    solution: [
      "<b>Разбор.</b> Человек неподвижен, ускорения нет: N = mg, и по третьему закону P = N.",
      "<b>Решение.</b> P = 70 · 10 = 700 Н.",
      "<b>Ответ:</b> 700 Н."
    ]
  },
  {
    id: "weight-up",
    type: "вес в лифте",
    title: "Лифт разгоняется вверх",
    text: "Масса человека 60 кг. Лифт разгоняется вверх с ускорением 3 м/с². Найди вес человека в ньютонах.",
    placeholder: "Н",
    hint: "Ускорение вверх: P = m(g + a).",
    check: value => near(numberValue(value), 780),
    answerText: "P = 780 Н.",
    solution: [
      "<b>Откуда формула.</b> Ось вверх: N − mg = ma, поэтому N = m(g + a); P = N.",
      "<b>Решение.</b> P = 60 · (10 + 3) = 780 Н (больше, чем в покое: 600 Н).",
      "<b>Ответ:</b> 780 Н."
    ]
  },
  {
    id: "weight-down",
    type: "вес в лифте",
    title: "Лифт разгоняется вниз",
    text: "Масса человека 50 кг. Лифт разгоняется вниз с ускорением 4 м/с². Найди вес человека в ньютонах.",
    placeholder: "Н",
    hint: "Ускорение вниз: P = m(g − a).",
    check: value => near(numberValue(value), 300),
    answerText: "P = 300 Н.",
    solution: [
      "<b>Откуда формула.</b> Ось вверх, ускорение лифта вниз: a<sub>y</sub> = −4. N − mg = ma<sub>y</sub>, поэтому N = m(g − 4).",
      "<b>Решение.</b> P = 50 · (10 − 4) = 300 Н (меньше, чем в покое: 500 Н).",
      "<b>Ответ:</b> 300 Н."
    ]
  },
  {
    id: "weight-flight",
    type: "невесомость",
    title: "Вес мяча в полёте",
    text: "Мяч массой 0,5 кг подбросили вверх, и он летит, не касаясь руки. Чему равен его вес в полёте, в ньютонах? Сопротивлением воздуха пренебречь.",
    placeholder: "Н",
    hint: "Ускорение мяча равно g, значит P = m(g − g).",
    check: value => near(numberValue(value), 0, 0) || /^\s*0([.,]0+)?\s*$/.test(value),
    answerText: "P = 0 (невесомость); сила тяжести 5 Н действует.",
    solution: [
      "<b>Разбор.</b> В полёте на мяч действует только сила тяжести, ускорение a = g вниз. Тогда P = m(g − a) = 0.",
      "<b>Смысл:</b> мяч невесом, но сила тяжести mg = 5 Н не исчезла.",
      "<b>Ответ:</b> 0."
    ]
  }
];

// ===== Общие функции тренажёра =====
const state = {
  animationId: 0,
  running: false,
  solved: loadProgress("tasks"),
  studied: loadProgress("examples")
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

function words(value) {
  return normalize(value).toLowerCase().replaceAll("ё", "е");
}

function format(value, digits = 2) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

function loadProgress(kind) {
  try {
    const value = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}-${kind}-v1`) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function saveProgress(kind, value) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}-${kind}-v1`, JSON.stringify(value));
  } catch {
    // Хранилище браузера может быть недоступно; тренажёр продолжает работать без сохранения.
  }
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(`${STORAGE_PREFIX}-theme`); } catch { saved = null; }
  const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) document.documentElement.dataset.theme = "dark";
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(`${STORAGE_PREFIX}-theme`, next); } catch { /* без сохранения темы */ }
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

// ===== Разборы задач =====
function renderExamples() {
  const list = $("#exampleList");
  list.replaceChildren();
  examples.forEach((example, index) => {
    const card = document.createElement("article");
    card.className = "example-card";
    card.innerHTML = `
      <div class="example-top"><span class="example-number">Разбор ${index + 1}</span><span class="example-level">${example.level}</span></div>
      <h3>${example.title}</h3>
      <div class="example-condition">${example.text}</div>
      <ol class="example-steps"></ol>
      <div class="example-answer" hidden></div>
      <div class="example-actions">
        <button class="btn primary example-next" type="button">Показать первый шаг</button>
        <button class="btn ghost example-all" type="button">Показать весь разбор</button>
        <span class="example-progress"></span>
      </div>`;
    const steps = $(".example-steps", card);
    const answer = $(".example-answer", card);
    const next = $(".example-next", card);
    const all = $(".example-all", card);
    const progress = $(".example-progress", card);
    let shown = 0;

    const showStep = () => {
      if (shown >= example.steps.length) return;
      const step = example.steps[shown];
      const item = document.createElement("li");
      item.innerHTML = `<b>${step.title}</b>${step.body}`;
      steps.append(item);
      shown += 1;
      update();
    };
    const update = () => {
      const finished = shown >= example.steps.length;
      progress.textContent = `Шагов: ${shown}/${example.steps.length}`;
      next.textContent = shown === 0 ? "Показать первый шаг" : "Показать следующий шаг";
      next.disabled = finished;
      all.disabled = finished;
      answer.hidden = !finished;
      if (finished) {
        answer.innerHTML = `Ответ: ${example.answer}`;
        if (!state.studied[example.id]) {
          state.studied[example.id] = true;
          saveProgress("examples", state.studied);
          updateExampleScore();
        }
      }
    };
    next.addEventListener("click", showStep);
    all.addEventListener("click", () => { while (shown < example.steps.length) showStep(); });
    update();
    list.append(card);
  });
  updateExampleScore();
}

function updateExampleScore() {
  const count = examples.filter(example => state.studied[example.id]).length;
  $("#exampleScore").textContent = `${count}/${examples.length}`;
}

// ===== Задания =====
function solutionHtml(task) {
  return task.solution.map(line => `<p>${line}</p>`).join("");
}

function renderTasks() {
  const grid = $("#taskGrid");
  grid.replaceChildren();
  tasks.forEach((task, index) => {
    const solved = Boolean(state.solved[task.id]);
    const card = document.createElement("article");
    card.className = `task-card${solved ? " completed" : ""}`;
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
      <button class="solution-toggle" type="button" ${solved ? "" : "disabled"}>Показать разбор</button>
      <p class="task-hint" hidden>${task.hint}</p>
      <div class="task-solution" hidden>${solutionHtml(task)}</div>
      <div class="task-feedback${solved ? " success" : ""}" aria-live="polite">${solved ? `Верно. ${task.answerText}` : "Ответ ещё не проверен."}</div>`;

    $(".task-check", card).addEventListener("click", () => checkTask(task, card));
    $(".task-answer", card).addEventListener("keydown", event => {
      if (event.key === "Enter") checkTask(task, card);
    });
    $(".hint-toggle", card).addEventListener("click", event => {
      const hint = $(".task-hint", card);
      hint.hidden = !hint.hidden;
      event.currentTarget.textContent = hint.hidden ? "Показать подсказку" : "Скрыть подсказку";
    });
    $(".solution-toggle", card).addEventListener("click", event => {
      const box = $(".task-solution", card);
      box.hidden = !box.hidden;
      event.currentTarget.textContent = box.hidden ? "Показать разбор" : "Скрыть разбор";
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
  $(".solution-toggle", card).disabled = false;
  if (task.check(answer)) {
    state.solved[task.id] = { answer };
    saveProgress("tasks", state.solved);
    card.classList.add("completed");
    feedback.className = "task-feedback success";
    feedback.textContent = `Верно. ${task.answerText}`;
  } else {
    delete state.solved[task.id];
    saveProgress("tasks", state.solved);
    card.classList.remove("completed");
    feedback.className = "task-feedback error";
    feedback.textContent = "Пока неверно. Открой подсказку, проверь модель, формулу и единицы, затем попробуй ещё раз. Полный разбор доступен по кнопке ниже.";
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
    saveProgress("tasks", state.solved);
    renderTasks();
  });
}


// ===== Опыт 1: бросок вверх =====
const NS = "http://www.w3.org/2000/svg";
const GROUND_Y = 360;
const PX_PER_M = 3.4;
const BALL_X = 170;

const lab = { t: 0, running: false, last: 0, frame: 0, revealed: false, maxY: 0, landed: false };

function throwParams() {
  const v0 = Number($("#v0Input").value);
  return { v0, t1: v0 / G, H: v0 * v0 / (2 * G), flight: 2 * v0 / G };
}

function buildHeightRuler() {
  const ruler = $("#heightRuler");
  ruler.replaceChildren();
  const add = (name, attrs, text) => {
    const el = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    if (text !== undefined) el.textContent = text;
    ruler.append(el);
  };
  add("line", { class: "ruler-line", x1: 480, y1: GROUND_Y, x2: 480, y2: GROUND_Y - 80 * PX_PER_M });
  for (let m = 0; m <= 80; m += 10) {
    const y = GROUND_Y - m * PX_PER_M;
    add("line", { class: "ruler-tick", x1: 480, y1: y, x2: 492, y2: y });
    add("text", { class: "ruler-text-y", x: 498, y: y + 4 }, `${m} м`);
  }
}

function drawThrow() {
  const p = throwParams();
  const t = Math.min(lab.t, p.flight);
  const h = Math.max(0, p.v0 * t - G * t * t / 2);
  const v = p.v0 - G * t;
  const y = GROUND_Y - 12 - h * PX_PER_M;
  $("#ball").setAttribute("cy", y);
  if (h > lab.maxY) lab.maxY = h;

  // Стрелка скорости появляется, пока тело движется и скорость не равна нулю.
  const vecV = $("#vecV");
  const labelV = $("#labelV");
  const showV = lab.t > 0 && Math.abs(v) > 0.4 && !lab.landed;
  if (showV) {
    const len = Math.min(100, Math.max(14, Math.abs(v) * 2.3));
    const dir = v > 0 ? -1 : 1;
    vecV.setAttribute("x1", BALL_X - 26);
    vecV.setAttribute("y1", y);
    vecV.setAttribute("x2", BALL_X - 26);
    vecV.setAttribute("y2", y + dir * len);
    labelV.setAttribute("x", BALL_X - 50);
    labelV.setAttribute("y", y + dir * len / 2 + 5);
  }
  [vecV, labelV].forEach(el => el.setAttribute("visibility", showV ? "visible" : "hidden"));

  // Ускорение всегда g вниз.
  const vecA = $("#vecA");
  vecA.setAttribute("x1", BALL_X + 26);
  vecA.setAttribute("y1", y);
  vecA.setAttribute("x2", BALL_X + 26);
  vecA.setAttribute("y2", y + 50);
  $("#labelA").setAttribute("x", BALL_X + 36);
  $("#labelA").setAttribute("y", y + 32);

  // Линия наибольшей высоты, достигнутой в этом броске.
  const showMax = lab.maxY > 0 && (lab.t >= p.t1 - 1e-9);
  const maxY = GROUND_Y - lab.maxY * PX_PER_M - 12;
  $("#maxLine").setAttribute("y1", maxY);
  $("#maxLine").setAttribute("y2", maxY);
  $("#maxText").setAttribute("y", maxY - 6);
  [$("#maxLine"), $("#maxText")].forEach(el => el.setAttribute("visibility", showMax ? "visible" : "hidden"));

  $("#v0Label").textContent = format(p.v0, 0);
  $("#tMeter").textContent = `${format(t, 2)} с`;
  $("#vMeter").textContent = `${format(v, 1)} м/с`;
  $("#hMeter").textContent = `${format(h, 1)} м`;
  // Расчётные значения скрыты, пока прогноз не проверен.
  $("#t1Meter").textContent = lab.revealed ? `${format(p.t1, 2)} с` : "?";
  $("#HMeter").textContent = lab.revealed ? `${format(p.H, 1)} м` : "?";
  $("#flightMeter").textContent = lab.revealed ? `${format(p.flight, 2)} с` : "?";
}

function resetThrow(message) {
  cancelAnimationFrame(lab.frame);
  lab.t = 0;
  lab.running = false;
  lab.revealed = false;
  lab.maxY = 0;
  lab.landed = false;
  $("#runBtn").textContent = "Бросить";
  drawThrow();
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = message || "Сосчитай t₁ и H сам, запиши прогноз и нажми «Проверить прогноз»: значения на табло откроются после верного ответа.";
  $("#verdict").textContent = "Ускорение всё время равно g и направлено вниз. В верхней точке скорость равна нулю, а ускорение нет.";
}

function runThrow() {
  if (lab.running) {
    cancelAnimationFrame(lab.frame);
    lab.running = false;
    $("#runBtn").textContent = "Продолжить";
    return;
  }
  if (lab.landed) resetThrow();
  lab.running = true;
  $("#runBtn").textContent = "Пауза";
  const p = throwParams();
  lab.last = performance.now();
  const frame = now => {
    const tempo = Number($("#tempoSelect").value);
    lab.t += Math.min(.05, (now - lab.last) / 1000) * tempo;
    lab.last = now;
    if (lab.t >= p.flight) {
      lab.t = p.flight;
      lab.landed = true;
      lab.running = false;
      drawThrow();
      $("#runBtn").textContent = "Бросить";
      $("#verdict").textContent = "Тело вернулось в точку броска со скоростью v₀ вниз: подъём и падение симметричны.";
      return;
    }
    drawThrow();
    lab.frame = requestAnimationFrame(frame);
  };
  lab.frame = requestAnimationFrame(frame);
}

function checkThrowPrediction() {
  const p = throwParams();
  const pt = numberValue($("#predT").value);
  const ph = numberValue($("#predH").value);
  const feedback = $("#labFeedback");
  if (!Number.isFinite(pt) || !Number.isFinite(ph)) {
    feedback.className = "feedback error";
    feedback.textContent = "Сначала сосчитай и запиши оба прогноза: время подъёма t₁ в секундах и наибольшую высоту H в метрах.";
    return;
  }
  const okT = near(pt, p.t1, .05);
  const okH = near(ph, p.H, .05);
  if (okT && okH) {
    lab.revealed = true;
    drawThrow();
    feedback.className = "feedback success";
    feedback.textContent = `Прогноз верный: t₁ = v₀/g = ${format(p.t1, 2)} с, H = v₀²/(2g) = ${format(p.H, 1)} м. Время всего полёта 2t₁ = ${format(p.flight, 2)} с. Значения на табло открыты.`;
    return;
  }
  const parts = [];
  if (!okT) parts.push("время: в верхней точке v = 0, поэтому 0 = v₀ − g·t₁");
  if (!okH) parts.push("высота: H = v₀²/(2g); скорость нужно возвести в квадрат");
  feedback.className = "feedback error";
  feedback.textContent = `Пока не сходится — ${parts.join("; ")}. Исправь прогноз и проверь ещё раз; если застрял, нажми «Показать значения».`;
}

function initThrow() {
  buildHeightRuler();
  $("#v0Input").addEventListener("input", () => resetThrow("Скорость изменилась. Сделай новый прогноз."));
  $("#runBtn").addEventListener("click", runThrow);
  $("#resetBtn").addEventListener("click", () => resetThrow());
  $("#checkBtn").addEventListener("click", checkThrowPrediction);
  $("#revealBtn").addEventListener("click", () => {
    lab.revealed = true;
    drawThrow();
    $("#labFeedback").className = "feedback";
    $("#labFeedback").textContent = "Значения открыты. Разбери, как они получаются, и реши заново с другой скоростью.";
  });
  resetThrow();
}

// ===== Опыт 2: весы в лифте =====
const liftView = { revealed: false };

function liftParams() {
  const m = Number($("#massInput").value);
  const a = Number($("#accInput").value);
  const weight = m * (G + a);
  return { m, a, weight, mg: m * G };
}

function setLine(line, label, x1, y1, x2, y2, lx, ly, visible) {
  [line, label].forEach(el => el.setAttribute("visibility", visible ? "visible" : "hidden"));
  if (!visible) return;
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  label.setAttribute("x", lx);
  label.setAttribute("y", ly);
}

function drawLift() {
  const p = liftParams();
  const floating = p.weight === 0;
  $("#person").setAttribute("transform", floating ? "translate(0,-26)" : "translate(0,0)");
  const bodyCentre = floating ? 235 : 260;
  // Сила тяжести: всегда вниз; реакция опоры — вверх от весов (скрыта при N = 0).
  const down = Math.min(110, 30 + p.mg / 8);
  setLine($("#vecMg"), $("#labelMg"), 232, bodyCentre, 232, bodyCentre + down, 196, bodyCentre + down - 10, true);
  const up = Math.min(150, 30 + p.weight / 8);
  setLine($("#vecN"), $("#labelN"), 298, 322, 298, 322 - up, 306, 322 - up + 14, p.weight > 0);
  // Ускорение лифта рядом с кабиной.
  if (p.a !== 0) {
    const len = 14 + Math.abs(p.a) * 6;
    const dir = p.a > 0 ? -1 : 1;
    setLine($("#vecAcc"), $("#labelAcc"), 410, 200, 410, 200 + dir * len, 424, 200 + dir * len / 2 + 5, true);
  } else {
    setLine($("#vecAcc"), $("#labelAcc"), 0, 0, 0, 0, 0, 0, false);
  }

  $("#massLabel").textContent = format(p.m, 0);
  $("#accLabel").textContent = format(p.a, 0);
  $("#accDirLabel").textContent = p.a === 0 ? "(покой или равномерное движение)" : p.a > 0 ? "(вверх)" : p.a === -G ? "(вниз, свободное падение)" : "(вниз)";
  $("#mMeter").textContent = `${format(p.m, 0)} кг`;
  $("#aMeter").textContent = `${format(p.a, 0)} м/с²`;
  const state = p.weight === 0 ? "невесомость" : p.a > 0 ? "перегрузка" : p.a < 0 ? "вес меньше" : "обычный вес";
  $("#mgMeter").textContent = liftView.revealed ? `${format(p.mg, 0)} Н` : "?";
  $("#pMeter").textContent = liftView.revealed ? `${format(p.weight, 0)} Н` : "?";
  $("#stateMeter").textContent = liftView.revealed ? state : "?";
  $("#scaleText").textContent = liftView.revealed ? `весы: ${format(p.weight, 0)} Н` : "весы";
}

function resetLift(message) {
  liftView.revealed = false;
  drawLift();
  $("#liftFeedback").className = "feedback";
  $("#liftFeedback").textContent = message || "Сосчитай P сам, запиши прогноз и нажми «Проверить прогноз»: значения на табло откроются после верного ответа.";
  $("#liftVerdict").textContent = "Весы показывают вес — силу, с которой человек давит на весы.";
}

function checkLiftPrediction() {
  const p = liftParams();
  const predicted = numberValue($("#predP").value);
  const feedback = $("#liftFeedback");
  if (!Number.isFinite(predicted)) {
    feedback.className = "feedback error";
    feedback.textContent = "Сначала сосчитай и запиши прогноз: показание весов P в ньютонах.";
    return;
  }
  const ok = p.weight === 0 ? Math.abs(predicted) < 0.5 : near(predicted, p.weight, .03);
  if (ok) {
    liftView.revealed = true;
    drawLift();
    feedback.className = "feedback success";
    $("#liftVerdict").textContent = p.weight === 0
      ? "Невесомость: P = 0. Сила тяжести не исчезла (человек и лифт падают вместе с ускорением g), но человек не давит на весы."
      : p.a > 0 ? "Ускорение вверх: вес больше силы тяжести (перегрузка)." : p.a < 0 ? "Ускорение вниз: вес меньше силы тяжести." : "Нет ускорения: вес равен силе тяжести.";
    feedback.textContent = `Прогноз верный: P = m(g + a) = ${format(p.m, 0)} · (10 ${p.a < 0 ? "−" : "+"} ${format(Math.abs(p.a), 0)}) = ${format(p.weight, 0)} Н.`;
    return;
  }
  feedback.className = "feedback error";
  feedback.textContent = "Пока не сходится. Определи направление ускорения лифта: вверх — P = m(g + a), вниз — P = m(g − a). Проверь, не подставил ли ты массу вместо силы. Если застрял, нажми «Показать значения».";
}

function initLift() {
  ["massInput", "accInput"].forEach(id => $(`#${id}`).addEventListener("input", () => resetLift("Параметры изменились. Сделай новый прогноз.")));
  $("#checkLiftBtn").addEventListener("click", checkLiftPrediction);
  $("#revealLiftBtn").addEventListener("click", () => {
    liftView.revealed = true;
    drawLift();
    $("#liftFeedback").className = "feedback";
    $("#liftFeedback").textContent = "Значения открыты. Разбери, как они получаются, и реши заново с другим ускорением.";
  });
  resetLift();
}

function initModes() {
  const set = lift => {
    $("#panelThrow").hidden = lift;
    $("#panelLift").hidden = !lift;
    $("#modeThrow").classList.toggle("active", !lift);
    $("#modeLift").classList.toggle("active", lift);
    $("#modeThrow").setAttribute("aria-selected", String(!lift));
    $("#modeLift").setAttribute("aria-selected", String(lift));
  };
  $("#modeThrow").addEventListener("click", () => set(false));
  $("#modeLift").addEventListener("click", () => set(true));
}

// ===== Калькулятор =====
const calcModes = {
  top: { x: ["Начальная скорость v₀, м/с", 20], y: null },
  at: { x: ["Начальная скорость v₀, м/с", 25], y: ["Время t, с", 2] },
  v0: { x: ["Наибольшая высота H, м", 20], y: null },
  weight: { x: ["Масса m, кг", 60], y: ["Ускорение a, м/с² (вверх +, вниз −)", 2] }
};

function setCalcMode() {
  const mode = calcModes[$("#calcMode").value];
  $("#calcXLabel").textContent = mode.x[0];
  $("#calcX").value = mode.x[1];
  $("#calcYLabel").hidden = !mode.y;
  $("#calcY").hidden = !mode.y;
  if (mode.y) {
    $("#calcYLabel").textContent = mode.y[0];
    $("#calcY").value = mode.y[1];
  }
  $("#calculationResult").replaceChildren();
}

function calculate() {
  const key = $("#calcMode").value;
  const x = Number($("#calcX").value);
  const y = Number($("#calcY").value);
  const result = $("#calculationResult");
  const lines = [];
  let answer;
  if (key === "top") {
    if (!(x > 0)) { result.textContent = "Введите положительную скорость."; return; }
    const t1 = x / G;
    const H = x * x / (2 * G);
    lines.push(`В верхней точке v = 0: t₁ = v₀ / g = ${format(x)} / 10 = ${format(t1, 3)} с.`);
    lines.push(`Наибольшая высота: H = v₀² / (2g) = ${format(x)}² / 20 = ${format(H, 3)} м.`);
    lines.push(`Время всего полёта до возвращения: 2t₁ = ${format(2 * t1, 3)} с; скорость при возвращении по модулю равна ${format(x)} м/с.`);
    lines.push("В верхней точке скорость равна нулю, а ускорение равно g и направлено вниз.");
    answer = `t₁ = ${format(t1, 3)} с; H = ${format(H, 3)} м`;
  } else if (key === "at") {
    if (!(x > 0) || !(y >= 0)) { result.textContent = "Введите положительную скорость и неотрицательное время."; return; }
    const v = x - G * y;
    const h = x * y - G * y * y / 2;
    lines.push(`Скорость: v = v₀ − gt = ${format(x)} − 10 · ${format(y)} = ${format(v, 3)} м/с.`);
    lines.push(`Высота: h = v₀t − gt²/2 = ${format(x)} · ${format(y)} − 5 · ${format(y)}² = ${format(h, 3)} м.`);
    lines.push(v > 0 ? "Скорость положительна: тело движется вверх." : v < 0 ? "Скорость отрицательна: тело движется вниз." : "Скорость равна нулю: верхняя точка.");
    if (h < 0) lines.push("Высота отрицательна: тело уже упало на землю, момент t слишком большой (полёт закончился).");
    answer = `v = ${format(v, 3)} м/с; h = ${format(h, 3)} м`;
  } else if (key === "v0") {
    if (!(x > 0)) { result.textContent = "Введите положительную высоту."; return; }
    const v0 = Math.sqrt(2 * G * x);
    lines.push(`Из H = v₀² / (2g): v₀² = 2gH = 2 · 10 · ${format(x)} = ${format(2 * G * x, 3)}.`);
    lines.push(`v₀ = √${format(2 * G * x, 3)} = ${format(v0, 3)} м/с.`);
    lines.push(`Время подъёма: t₁ = v₀ / g = ${format(v0 / G, 3)} с.`);
    answer = `v₀ = ${format(v0, 3)} м/с`;
  } else {
    if (!(x > 0)) { result.textContent = "Введите положительную массу."; return; }
    const P = x * (G + y);
    lines.push(`Сила тяжести: mg = ${format(x)} · 10 = ${format(x * G, 3)} Н.`);
    lines.push(`Ось вверх: N − mg = ma, откуда P = N = m(g + a) = ${format(x)} · (10 ${y < 0 ? "−" : "+"} ${format(Math.abs(y))}) = ${format(P, 3)} Н.`);
    lines.push(P > x * G ? "Вес больше силы тяжести: перегрузка." : P < x * G ? (P === 0 ? "Вес равен нулю: невесомость, сила тяжести при этом действует." : "Вес меньше силы тяжести.") : "Вес равен силе тяжести.");
    if (P < 0) lines.push("Отрицательный вес невозможен: при ускорении, большем g, тело отрывается от опоры.");
    answer = `P = ${format(Math.max(P, 0), 3)} Н`;
  }
  result.innerHTML = `<strong>Ответ: ${answer}.</strong>
    <ol>${lines.map(line => `<li>${line}</li>`).join("")}</ol>`;
}

function initCalculator() {
  $("#calcMode").addEventListener("change", setCalcMode);
  $("#calculateBtn").addEventListener("click", calculate);
  setCalcMode();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initModes();
  initThrow();
  initLift();
  renderExamples();
  initCalculator();
  initTasks();
});
