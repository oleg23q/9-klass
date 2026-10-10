"use strict";

const STORAGE_PREFIX = "grade9-newton-laws";
const G = 10;

const examples = [
  {
    id: "which-law",
    level: "базовый уровень",
    title: "Какой закон нужен",
    text: "Определи закон Ньютона: а) тележка не меняет скорость, пока на неё не действуют силы; б) при той же силе лёгкий мяч разгоняется сильнее тяжёлого; в) пловец отталкивается от бортика бассейна.",
    steps: [
      { title: "Вопрос к ситуации", body: "Первый закон отвечает, когда скорость не меняется. Второй — как скорость меняется под действием силы. Третий — как два тела действуют друг на друга." },
      { title: "Случай а", body: "Скорость сохраняется, пока силы нет или они скомпенсированы — это первый закон (закон инерции)." },
      { title: "Случай б", body: "Связываются сила, масса и ускорение: a = F / m. При одинаковой F у меньшей массы ускорение больше. Это второй закон." },
      { title: "Случай в", body: "Пловец действует на бортик, поэтому и бортик действует на пловца с равной по модулю и противоположной по направлению силой. Это третий закон." }
    ],
    answer: "а) первый закон; б) второй закон; в) третий закон."
  },
  {
    id: "forces",
    level: "базовый уровень",
    title: "Ускорение при нескольких силах",
    text: "На ящик массой 8 кг по гладкому полу действуют силы 28 Н вправо и 12 Н влево. Найди ускорение и его направление.",
    steps: [
      { title: "Тело и силы", body: "Рассматриваем ящик. Горизонтальные силы: 28 Н вправо и 12 Н влево. Вертикальные силы (тяжести и реакции опоры) уравновешены." },
      { title: "Равнодействующая", body: "Силы направлены в противоположные стороны, поэтому вычитаем: F = 28 − 12 = 16 Н, направлена вправо." },
      { title: "Второй закон", body: "a = F / m = 16 / 8 = 2 м/с²." },
      { title: "Проверка", body: "Единицы: Н / кг = м/с². Ускорение направлено так же, как равнодействующая — вправо." }
    ],
    answer: "a = 2 м/с², направлено вправо."
  },
  {
    id: "two-carts",
    level: "средний уровень",
    title: "Две тележки расталкиваются",
    text: "Между тележками массой 1 кг и 4 кг находится сжатая пружина. После освобождения она действует на тележки с силой 8 Н. Найди ускорения тележек.",
    steps: [
      { title: "Третий закон", body: "Первая тележка действует на вторую, поэтому и вторая действует на первую. По третьему закону силы равны по модулю: по 8 Н, направлены противоположно." },
      { title: "Силы приложены к разным телам", body: "Это пара сил третьего закона. Одна сила приложена к первой тележке, другая — ко второй, поэтому они не уравновешивают друг друга." },
      { title: "Второй закон для каждой", body: "a₁ = F / m₁ = 8 / 1 = 8 м/с²; a₂ = F / m₂ = 8 / 4 = 2 м/с²." },
      { title: "Сравнение", body: "Силы одинаковые, а ускорения разные: a₁ / a₂ = m₂ / m₁ = 4. У лёгкой тележки ускорение больше." }
    ],
    answer: "a₁ = 8 м/с², a₂ = 2 м/с²: силы равны, а ускорение лёгкой тележки в 4 раза больше."
  },
  {
    id: "rope",
    level: "повышенный уровень",
    title: "Тела на нити",
    text: "Бруски массой 2 кг и 4 кг лежат на гладком столе и связаны нитью. Первый брусок тянут силой 12 Н вдоль нити. Найди ускорение и силу натяжения нити.",
    steps: [
      { title: "Модель", body: "Нить нерастяжима и натянута, поэтому оба бруска имеют одинаковое ускорение a. Трения нет." },
      { title: "Ускорение системы", body: "На систему в горизонтальном направлении действует только внешняя сила F = 12 Н: a = F / (m₁ + m₂) = 12 / 6 = 2 м/с²." },
      { title: "Второй брусок", body: "Его разгоняет только сила натяжения нити: T = m₂a = 4 · 2 = 8 Н." },
      { title: "Третий закон", body: "Нить действует на брусок силой T, а брусок на нить — силой T в противоположную сторону. Поэтому на оба конца нити действуют равные по модулю силы натяжения." },
      { title: "Проверка для первого бруска", body: "F − T = 12 − 8 = 4 Н, а m₁a = 2 · 2 = 4 Н. Результат совпал." }
    ],
    answer: "a = 2 м/с²; T = 8 Н."
  }
];

const tasks = [
  {
    id: "law-first",
    type: "какой закон",
    title: "Книга на столе",
    text: "Книга неподвижно лежит на столе, силы, действующие на неё, уравновешены. Какой закон Ньютона объясняет, что её скорость не меняется?",
    placeholder: "первый, второй или третий",
    hint: "Скорость не меняется, потому что равнодействующая равна нулю.",
    check: value => /(перв|(^|\D)1(\D|$))/.test(words(value)),
    answerText: "Первый закон.",
    solution: [
      "<b>Разбор.</b> Равнодействующая сил равна нулю, поэтому ускорение равно нулю, скорость сохраняется (в данном случае равна нулю).",
      "<b>Ответ:</b> первый закон Ньютона."
    ]
  },
  {
    id: "law-second",
    type: "какой закон",
    title: "Лёгкая и тяжёлая тележка",
    text: "При одной и той же силе лёгкая тележка разгоняется быстрее тяжёлой. Какой закон Ньютона это объясняет?",
    placeholder: "первый, второй или третий",
    hint: "Здесь связаны сила, масса и ускорение: a = F/m.",
    check: value => /(втор|(^|\D)2(\D|$))/.test(words(value)),
    answerText: "Второй закон.",
    solution: [
      "<b>Разбор.</b> Из a = F / m при одинаковой силе у меньшей массы ускорение больше.",
      "<b>Ответ:</b> второй закон Ньютона."
    ]
  },
  {
    id: "law-third",
    type: "какой закон",
    title: "Пловец у бортика",
    text: "Пловец отталкивается ногами от бортика бассейна и движется от него. Какой закон Ньютона объясняет, что бортик действует на пловца?",
    placeholder: "первый, второй или третий",
    hint: "Тела действуют друг на друга: пловец на бортик и бортик на пловца.",
    check: value => /(трет|(^|\D)3(\D|$))/.test(words(value)),
    answerText: "Третий закон.",
    solution: [
      "<b>Разбор.</b> Пловец давит на бортик, значит и бортик действует на пловца силой, равной по модулю и противоположной по направлению. Это взаимодействие описывает третий закон.",
      "<b>Ответ:</b> третий закон Ньютона."
    ]
  },
  {
    id: "pair-or-not",
    type: "пары сил",
    title: "Тяжесть и опора",
    text: "Книга лежит на столе. Является ли сила тяжести, действующая на книгу, и сила реакции опоры парой сил третьего закона? Ответь «да» или «нет».",
    placeholder: "да или нет",
    hint: "К каким телам приложены эти две силы?",
    check: value => /^\s*нет|не\s*явля|не\s*пар/.test(words(value)),
    answerText: "Нет.",
    solution: [
      "<b>Разбор.</b> Обе силы приложены к одному телу — книге — и уравновешивают друг друга (первый закон). Пара третьего закона всегда приложена к разным телам.",
      "<b>Настоящие пары:</b> для силы тяжести — притяжение книгой Земли; для силы реакции опоры — давление книги на стол.",
      "<b>Ответ:</b> нет."
    ]
  },
  {
    id: "force",
    type: "второй закон",
    title: "Сила по ускорению",
    text: "Тело массой 7 кг движется с ускорением 2,5 м/с². Найди равнодействующую силу в ньютонах.",
    placeholder: "Н",
    hint: "F = ma.",
    check: value => near(numberValue(value), 17.5),
    answerText: "F = 17,5 Н.",
    solution: [
      "<b>Формула.</b> Второй закон: F = ma.",
      "<b>Решение.</b> F = 7 · 2,5 = 17,5 Н.",
      "<b>Ответ:</b> 17,5 Н."
    ]
  },
  {
    id: "accel",
    type: "второй закон",
    title: "Ускорение по силе",
    text: "На тело массой 15 кг действует равнодействующая сила 45 Н. Найди ускорение в м/с².",
    placeholder: "м/с²",
    hint: "a = F/m.",
    check: value => near(numberValue(value), 3),
    answerText: "a = 3 м/с².",
    solution: [
      "<b>Решение.</b> a = F / m = 45 / 15 = 3 м/с².",
      "<b>Проверка единиц:</b> Н / кг = м/с².",
      "<b>Ответ:</b> 3 м/с²."
    ]
  },
  {
    id: "opposite",
    type: "несколько сил",
    title: "Две противоположные силы",
    text: "На ящик массой 6 кг по гладкому полу действуют силы 40 Н вправо и 16 Н влево. Найди ускорение в м/с².",
    placeholder: "м/с²",
    hint: "Сначала равнодействующая: силы направлены в противоположные стороны.",
    check: value => near(numberValue(value), 4),
    answerText: "a = 4 м/с².",
    solution: [
      "<b>Равнодействующая:</b> F = 40 − 16 = 24 Н вправо.",
      "<b>Второй закон:</b> a = F / m = 24 / 6 = 4 м/с².",
      "<b>Ответ:</b> 4 м/с², направлено вправо."
    ]
  },
  {
    id: "ball-wall",
    type: "третий закон",
    title: "Мяч и стена",
    text: "Мяч ударил в стену с силой 25 Н. С какой по модулю силой стена действует на мяч? Ответ в ньютонах.",
    placeholder: "Н",
    hint: "Применить третий закон: силы взаимодействия равны по модулю.",
    check: value => near(numberValue(value), 25),
    answerText: "25 Н, направлена противоположно.",
    solution: [
      "<b>Разбор.</b> По третьему закону силы взаимодействия равны по модулю и противоположны по направлению. То, что стена неподвижна, силу не меняет.",
      "<b>Ответ:</b> 25 Н."
    ]
  },
  {
    id: "light-cart",
    type: "две тележки",
    title: "Ускорение лёгкой тележки",
    text: "Тележки массой 3 кг и 6 кг расталкиваются пружиной с силой 12 Н. Найди ускорение лёгкой тележки в м/с².",
    placeholder: "м/с²",
    hint: "Сила на каждую тележку одна и та же по модулю. a = F/m для лёгкой.",
    check: value => near(numberValue(value), 4),
    answerText: "a = 4 м/с².",
    solution: [
      "<b>Третий закон:</b> на каждую тележку действует сила 12 Н.",
      "<b>Второй закон:</b> для лёгкой тележки a = 12 / 3 = 4 м/с²; для тяжёлой 12 / 6 = 2 м/с².",
      "<b>Ответ:</b> 4 м/с²."
    ]
  },
  {
    id: "ratio",
    type: "отношение ускорений",
    title: "Во сколько раз больше",
    text: "Две тележки массой 2 кг и 8 кг расталкиваются. Во сколько раз ускорение лёгкой тележки больше ускорения тяжёлой?",
    placeholder: "раз",
    hint: "Силы равны, поэтому m₁a₁ = m₂a₂.",
    check: value => near(numberValue(value), 4),
    answerText: "В 4 раза.",
    solution: [
      "<b>Разбор.</b> Силы равны, поэтому m₁a₁ = m₂a₂ и a₁ / a₂ = m₂ / m₁ = 8 / 2 = 4.",
      "<b>Ответ:</b> в 4 раза."
    ]
  },
  {
    id: "rope-a",
    type: "тела на нити",
    title: "Ускорение связанных тел",
    text: "Бруски массой 4 кг и 6 кг лежат на гладком столе и связаны нитью. Первый тянут силой 20 Н вдоль нити. Найди ускорение в м/с².",
    placeholder: "м/с²",
    hint: "Нить нерастяжима, поэтому ускорение общее: a = F/(m₁ + m₂).",
    check: value => near(numberValue(value), 2),
    answerText: "a = 2 м/с².",
    solution: [
      "<b>Модель.</b> Трения нет, ускорение у обоих брусков одинаковое.",
      "<b>Решение.</b> a = F / (m₁ + m₂) = 20 / 10 = 2 м/с².",
      "<b>Ответ:</b> 2 м/с²."
    ]
  },
  {
    id: "rope-t",
    type: "тела на нити",
    title: "Натяжение нити",
    text: "В условиях предыдущей задачи найди силу натяжения нити в ньютонах.",
    placeholder: "Н",
    hint: "Второй брусок разгоняет только натяжение: T = m₂a.",
    check: value => near(numberValue(value), 12),
    answerText: "T = 12 Н.",
    solution: [
      "<b>Решение.</b> Для второго бруска T = m₂a = 6 · 2 = 12 Н.",
      "<b>Проверка для первого бруска:</b> F − T = 20 − 12 = 8 Н, а m₁a = 4 · 2 = 8 Н.",
      "<b>Ответ:</b> 12 Н."
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


// ===== Эксперимент: две тележки =====
const NS = "http://www.w3.org/2000/svg";
const PX_PER_M = 25;
const PUSH_TIME = 0.8;      // длительность толчка, с
const FLOOR = 262;
const CART_W = 60;
const CART_Y = 204;
const CART1_X = 190;
const CART2_X = 270;

const lab = { phase: "ready", t: 0, last: 0, revealed: false, frame: 0 };

function readParams() {
  const m1 = Number($("#m1Input").value);
  const m2 = Number($("#m2Input").value);
  const force = Number($("#forceInput").value);
  const a1 = force / m1;
  const a2 = force / m2;
  return { m1, m2, force, a1, a2, v1: a1 * PUSH_TIME, v2: a2 * PUSH_TIME };
}

function displacement(a, v, t) {
  if (t <= PUSH_TIME) return a * t * t / 2;
  return a * PUSH_TIME * PUSH_TIME / 2 + v * (t - PUSH_TIME);
}

function springPath(x1, x2) {
  const y = CART_Y + 22;
  const turns = 8;
  const parts = [`M${x1} ${y}`];
  for (let i = 0; i < turns; i += 1) {
    const x = x1 + (x2 - x1) * (i + 0.5) / turns;
    parts.push(`L${x.toFixed(1)} ${y + (i % 2 === 0 ? -14 : 14)}`);
  }
  parts.push(`L${x2} ${y}`);
  return parts.join(" ");
}

function setLine(line, label, x1, y1, x2, y2, labelX, labelY) {
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("visibility", "visible");
  label.setAttribute("x", labelX);
  label.setAttribute("y", labelY);
  label.setAttribute("visibility", "visible");
}

function hide(...ids) {
  ids.forEach(id => $(id).setAttribute("visibility", "hidden"));
}

function drawScene() {
  const p = readParams();
  const s1 = displacement(p.a1, p.v1, lab.phase === "ready" ? 0 : lab.t) * PX_PER_M;
  const s2 = displacement(p.a2, p.v2, lab.phase === "ready" ? 0 : lab.t) * PX_PER_M;
  const x1 = CART1_X - s1;
  const x2 = CART2_X + s2;
  $("#cart1").setAttribute("x", x1);
  $("#cart2").setAttribute("x", x2);
  [["#w1a", x1 + 14], ["#w1b", x1 + 46], ["#w2a", x2 + 14], ["#w2b", x2 + 46]].forEach(([id, cx]) => $(id).setAttribute("cx", cx));
  $("#mass1").setAttribute("x", x1 + CART_W / 2);
  $("#mass2").setAttribute("x", x2 + CART_W / 2);
  $("#mass1").textContent = `${format(p.m1, 0)} кг`;
  $("#mass2").textContent = `${format(p.m2, 0)} кг`;

  const pushing = lab.phase === "push" || lab.phase === "ready";
  $("#spring").setAttribute("d", pushing ? springPath(x1 + CART_W, x2) : "");
  $("#spring").setAttribute("visibility", pushing ? "visible" : "hidden");

  if (lab.phase === "push") {
    const length = 14 + p.force * 5;
    setLine($("#vecF1"), $("#labelF1"), x1 + CART_W / 2, CART_Y - 16, x1 + CART_W / 2 - length, CART_Y - 16, x1 + CART_W / 2 - length / 2 - 12, CART_Y - 26);
    setLine($("#vecF2"), $("#labelF2"), x2 + CART_W / 2, CART_Y - 16, x2 + CART_W / 2 + length, CART_Y - 16, x2 + CART_W / 2 + length / 2 - 12, CART_Y - 26);
  } else {
    hide("#vecF1", "#vecF2", "#labelF1", "#labelF2");
  }
  if (lab.phase === "coast") {
    const l1 = Math.min(110, 12 + p.v1 * 10);
    const l2 = Math.min(110, 12 + p.v2 * 10);
    setLine($("#vecV1"), $("#labelV1"), x1 + CART_W / 2, CART_Y - 16, x1 + CART_W / 2 - l1, CART_Y - 16, x1 + CART_W / 2 - l1 / 2 - 6, CART_Y - 26);
    setLine($("#vecV2"), $("#labelV2"), x2 + CART_W / 2, CART_Y - 16, x2 + CART_W / 2 + l2, CART_Y - 16, x2 + CART_W / 2 + l2 / 2 - 6, CART_Y - 26);
  } else {
    hide("#vecV1", "#vecV2", "#labelV1", "#labelV2");
  }

  const text = { ready: "Тележки покоятся: равнодействующая равна нулю", push: "Толчок: на каждую тележку действует сила, они равны по модулю", coast: "После толчка сил нет: тележки движутся равномерно (первый закон)", done: "Тележка добралась до края площадки" }[lab.phase];
  $("#phaseText").textContent = text;

  $("#m1Label").textContent = format(p.m1, 0);
  $("#m2Label").textContent = format(p.m2, 0);
  $("#forceLabel").textContent = format(p.force, 0);
  $("#m1Meter").textContent = `${format(p.m1, 0)} кг`;
  $("#m2Meter").textContent = `${format(p.m2, 0)} кг`;
  $("#fMeter").textContent = `${format(p.force, 0)} Н`;
  // Расчётные величины скрыты, пока ученик не проверил прогноз.
  $("#a1Meter").textContent = lab.revealed ? `${format(p.a1, 2)} м/с²` : "?";
  $("#a2Meter").textContent = lab.revealed ? `${format(p.a2, 2)} м/с²` : "?";
  $("#v1Meter").textContent = lab.revealed ? `${format(p.v1, 2)} м/с` : "?";
  $("#v2Meter").textContent = lab.revealed ? `${format(p.v2, 2)} м/с` : "?";
}

function resetExperiment(message) {
  cancelAnimationFrame(lab.frame);
  lab.phase = "ready";
  lab.t = 0;
  lab.revealed = false;
  $("#runBtn").textContent = "Толкнуть";
  drawScene();
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = message || "Сосчитай a₁ и a₂ сам, запиши прогноз и нажми «Проверить прогноз»: значения на табло откроются после верного ответа.";
  $("#verdict").textContent = "Силы на обе тележки одинаковы по модулю, а ускорения разные: у лёгкой тележки оно больше.";
}

function run() {
  if (lab.phase !== "ready") resetExperiment();
  const p = readParams();
  lab.phase = "push";
  lab.t = 0;
  $("#runBtn").textContent = "Повторить";
  lab.last = performance.now();
  const frame = now => {
    lab.t += Math.min(.05, (now - lab.last) / 1000);
    lab.last = now;
    lab.phase = lab.t < PUSH_TIME ? "push" : "coast";
    const x1 = CART1_X - displacement(p.a1, p.v1, lab.t) * PX_PER_M;
    const x2 = CART2_X + displacement(p.a2, p.v2, lab.t) * PX_PER_M;
    if (x1 < 12 || x2 + CART_W > 548) {
      lab.phase = "done";
      drawScene();
      const feedback = $("#labFeedback");
      feedback.className = "feedback success";
      feedback.textContent = "Сила толчка действовала на обе тележки одинаковое время и была одинаковой по модулю. Лёгкая тележка набрала большую скорость. Нажми «Повторить» или измени параметры.";
      return;
    }
    drawScene();
    lab.frame = requestAnimationFrame(frame);
  };
  lab.frame = requestAnimationFrame(frame);
}

function checkPrediction() {
  const p = readParams();
  const pa1 = numberValue($("#predA1").value);
  const pa2 = numberValue($("#predA2").value);
  const feedback = $("#labFeedback");
  if (!Number.isFinite(pa1) || !Number.isFinite(pa2)) {
    feedback.className = "feedback error";
    feedback.textContent = "Сначала сосчитай и запиши оба прогноза: ускорения a₁ и a₂ в м/с².";
    return;
  }
  const ok1 = near(pa1, p.a1, .05);
  const ok2 = near(pa2, p.a2, .05);
  if (ok1 && ok2) {
    lab.revealed = true;
    drawScene();
    feedback.className = "feedback success";
    feedback.textContent = `Прогноз верный: по третьему закону сила на обе тележки ${format(p.force, 0)} Н, поэтому a₁ = F/m₁ = ${format(p.a1, 2)} м/с², a₂ = F/m₂ = ${format(p.a2, 2)} м/с². После толчка длительностью t = ${format(PUSH_TIME, 1)} с скорость v = a·t: v₁ = ${format(p.a1, 2)} · ${format(PUSH_TIME, 1)} = ${format(p.v1, 2)} м/с, v₂ = ${format(p.a2, 2)} · ${format(PUSH_TIME, 1)} = ${format(p.v2, 2)} м/с. Значения на табло открыты.`;
    return;
  }
  const parts = [];
  if (!ok1) parts.push("a₁: на левую тележку действует сила F, a₁ = F/m₁");
  if (!ok2) parts.push("a₂: на правую тележку действует такая же по модулю сила F (третий закон), a₂ = F/m₂");
  feedback.className = "feedback error";
  feedback.textContent = `Пока не сходится — ${parts.join("; ")}. Исправь прогноз и проверь ещё раз; если застрял, нажми «Показать значения».`;
}

function initExperiment() {
  ["m1Input", "m2Input", "forceInput"].forEach(id => {
    $(`#${id}`).addEventListener("input", () => resetExperiment("Параметры изменились. Сделай новый прогноз."));
  });
  $("#runBtn").addEventListener("click", run);
  $("#resetBtn").addEventListener("click", () => resetExperiment());
  $("#checkBtn").addEventListener("click", checkPrediction);
  $("#revealBtn").addEventListener("click", () => {
    lab.revealed = true;
    drawScene();
    $("#labFeedback").className = "feedback";
    $("#labFeedback").textContent = "Значения открыты. Разбери, как они получаются, и реши заново с другими массами и силой.";
  });
  resetExperiment();
}

// ===== Калькулятор =====
const calcModes = {
  accel: { x: ["Сила F, Н", 20], y: ["Масса m, кг", 4], z: null },
  force: { x: ["Масса m, кг", 5], y: ["Ускорение a, м/с²", 3], z: null },
  carts: { x: ["Сила F, Н", 8], y: ["Масса m₁, кг", 1], z: ["Масса m₂, кг", 4] },
  rope: { x: ["Сила F, Н", 12], y: ["Масса m₁, кг", 2], z: ["Масса m₂, кг", 4] }
};

function setCalcMode() {
  const mode = calcModes[$("#calcMode").value];
  $("#calcXLabel").textContent = mode.x[0];
  $("#calcX").value = mode.x[1];
  $("#calcYLabel").textContent = mode.y[0];
  $("#calcY").value = mode.y[1];
  $("#calcZLabel").hidden = !mode.z;
  $("#calcZ").hidden = !mode.z;
  if (mode.z) {
    $("#calcZLabel").textContent = mode.z[0];
    $("#calcZ").value = mode.z[1];
  }
  $("#calculationResult").replaceChildren();
}

function calculate() {
  const key = $("#calcMode").value;
  const x = Number($("#calcX").value);
  const y = Number($("#calcY").value);
  const z = Number($("#calcZ").value);
  const result = $("#calculationResult");
  if (!(x > 0) || !(y > 0) || (calcModes[key].z && !(z > 0))) {
    result.textContent = "Введите положительные значения.";
    return;
  }
  const lines = [];
  let answer;
  if (key === "accel") {
    const a = x / y;
    lines.push(`Второй закон: a = F / m = ${format(x)} / ${format(y)} = ${format(a, 3)} м/с².`);
    lines.push("Ускорение направлено так же, как равнодействующая сила.");
    answer = `a = ${format(a, 3)} м/с²`;
  } else if (key === "force") {
    const f = x * y;
    lines.push(`Второй закон: F = ma = ${format(x)} · ${format(y)} = ${format(f, 3)} Н.`);
    answer = `F = ${format(f, 3)} Н`;
  } else if (key === "carts") {
    const a1 = x / y;
    const a2 = x / z;
    lines.push(`Третий закон: на каждую тележку действует сила ${format(x)} Н, направленная противоположно.`);
    lines.push(`Первая: a₁ = F / m₁ = ${format(x)} / ${format(y)} = ${format(a1, 3)} м/с².`);
    lines.push(`Вторая: a₂ = F / m₂ = ${format(x)} / ${format(z)} = ${format(a2, 3)} м/с².`);
    lines.push(`Проверка: m₁a₁ = ${format(y * a1, 3)} Н, m₂a₂ = ${format(z * a2, 3)} Н — равны.`);
    answer = `a₁ = ${format(a1, 3)} м/с²; a₂ = ${format(a2, 3)} м/с²`;
  } else {
    const a = x / (y + z);
    const t = z * a;
    lines.push(`Нить нерастяжима: ускорение общее, a = F / (m₁ + m₂) = ${format(x)} / ${format(y + z)} = ${format(a, 3)} м/с².`);
    lines.push(`Второй брусок: T = m₂a = ${format(z)} · ${format(a, 3)} = ${format(t, 3)} Н.`);
    lines.push(`Проверка для первого бруска: F − T = ${format(x - t, 3)} Н, m₁a = ${format(y * a, 3)} Н.`);
    answer = `a = ${format(a, 3)} м/с²; T = ${format(t, 3)} Н`;
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
  initExperiment();
  renderExamples();
  initCalculator();
  initTasks();
});
