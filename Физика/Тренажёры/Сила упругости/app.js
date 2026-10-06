"use strict";

const STORAGE_PREFIX = "grade9-elastic-force";
const G = 10;

const examples = [
  {
    id: "stiffness",
    level: "базовый уровень",
    title: "Жёсткость пружины по опыту с грузом",
    text: "Груз массой 300 г неподвижно висит на пружине и растянул её на 1,5 см. Найди жёсткость пружины. Принять g = 10 м/с².",
    steps: [
      { title: "Дано и СИ", body: "m = 300 г = 0,3 кг; Δl = 1,5 см = 0,015 м; g = 10 м/с². Сантиметры и граммы переводим сразу." },
      { title: "Модель", body: "Деформация упругая, пружина растянута вниз, значит сила упругости направлена вверх. Груз неподвижен, поэтому сила упругости уравновешивает силу тяжести." },
      { title: "Сила упругости", body: "F = mg = 0,3 · 10 = 3 Н." },
      { title: "Откуда формула жёсткости", body: "По закону Гука F = kΔl. Жёсткость — коэффициент пропорциональности: k = F / Δl. Она показывает, какая сила нужна для изменения длины на 1 м." },
      { title: "Жёсткость", body: "k = 3 / 0,015 = 200 Н/м. Проверка: 200 · 0,015 = 3 Н." }
    ],
    answer: "k = 200 Н/м: на каждый метр удлинения нужна сила 200 Н, то есть 2 Н на 1 см."
  },
  {
    id: "stretch",
    level: "базовый уровень",
    title: "Удлинение по известной силе",
    text: "К пружине жёсткостью 250 Н/м приложили силу 20 Н. Найди удлинение. Каким оно станет при силе 40 Н?",
    steps: [
      { title: "Дано", body: "k = 250 Н/м; F₁ = 20 Н; F₂ = 40 Н. Все величины в СИ." },
      { title: "Формула", body: "Из F = kΔl получаем Δl = F / k." },
      { title: "Удлинение при 20 Н", body: "Δl₁ = 20 / 250 = 0,08 м = 8 см." },
      { title: "Удлинение при 40 Н", body: "Сила выросла вдвое. Так как F ~ Δl, удлинение тоже вырастет вдвое: Δl₂ = 40 / 250 = 0,16 м = 16 см." },
      { title: "Оговорка", body: "Это верно, пока деформация упругая. Если 16 см больше предела упругости, пружина вытянется неупруго, и закон Гука перестанет работать." }
    ],
    answer: "Δl₁ = 8 см; при вдвое большей силе Δl₂ = 16 см (если предел упругости не превышен)."
  },
  {
    id: "block",
    level: "средний уровень",
    title: "Брусок на пружине",
    text: "Пружина жёсткостью 80 Н/м растянута на 5 см и тянет брусок массой 0,5 кг по гладкому горизонтальному столу. Найди ускорение бруска в этот момент и объясни, как оно будет меняться.",
    steps: [
      { title: "Дано и СИ", body: "k = 80 Н/м; Δl = 5 см = 0,05 м; m = 0,5 кг." },
      { title: "Сила упругости", body: "F = kΔl = 80 · 0,05 = 4 Н. Направлена к недеформированному положению пружины, то есть против растяжения." },
      { title: "Второй закон Ньютона", body: "Трения нет, вертикальные силы уравновешены. По горизонтали действует только сила упругости, поэтому a = F / m." },
      { title: "Ускорение", body: "a = 4 / 0,5 = 8 м/с². Проверка единиц: Н / кг = м/с²." },
      { title: "Как меняется ускорение", body: "Брусок движется к положению, где пружина не деформирована. Δl уменьшается, поэтому сила и ускорение тоже уменьшаются; в недеформированном положении они равны нулю." }
    ],
    answer: "a = 8 м/с², направлено против растяжения; по мере сокращения пружины ускорение убывает до нуля."
  },
  {
    id: "table",
    level: "повышенный уровень",
    title: "Таблица измерений: где нарушается закон Гука",
    text: "В опыте измерили удлинение пружины и силу: Δl = 1; 2; 3; 4; 5 см, F = 2; 4; 6; 8; 9,5 Н. Найди жёсткость и определи, при каком измерении закон Гука перестал выполняться.",
    steps: [
      { title: "Что проверяем", body: "Если закон Гука выполняется, отношение F / Δl одинаково для всех измерений и равно жёсткости." },
      { title: "Отношения", body: "2/1 = 2; 4/2 = 2; 6/3 = 2; 8/4 = 2 Н/см; 9,5/5 = 1,9 Н/см." },
      { title: "Жёсткость", body: "Для первых четырёх измерений k = 2 Н/см = 200 Н/м (1 Н/см = 100 Н/м)." },
      { title: "Вывод", body: "При Δl = 5 см отношение стало меньше, график перестал быть прямой. Пружина вышла за предел упругости: деформация перестала быть упругой, закон Гука не выполняется." },
      { title: "Как выглядит график", body: "Первые четыре точки лежат на прямой через начало координат с наклоном 200 Н/м, пятая точка лежит ниже этой прямой." }
    ],
    answer: "k = 200 Н/м; закон Гука нарушился при удлинении 5 см."
  }
];

const tasks = [
  {
    id: "stretching",
    type: "вид деформации",
    title: "Резиновый шнур",
    text: "Резиновый шнур тянут за концы в разные стороны. Какой вид деформации возникает?",
    placeholder: "вид деформации",
    hint: "Тело становится длиннее вдоль направления сил.",
    check: value => /растяж/.test(words(value)),
    answerText: "Растяжение.",
    solution: [
      "<b>Разбор.</b> Внешние силы направлены от тела в противоположные стороны, расстояния между частицами вдоль шнура увеличиваются, шнур становится длиннее.",
      "<b>Ответ:</b> растяжение."
    ]
  },
  {
    id: "bending",
    type: "вид деформации",
    title: "Прогнувшаяся полка",
    text: "Полка под тяжёлыми книгами прогнулась посередине. Какой вид деформации она испытывает?",
    placeholder: "вид деформации",
    hint: "Верхние слои полки растянуты, нижние сжаты.",
    check: value => /изгиб/.test(words(value)),
    answerText: "Изгиб.",
    solution: [
      "<b>Разбор.</b> При прогибе нижние слои полки растягиваются, а верхние сжимаются. Такое сочетание растяжения и сжатия называют изгибом.",
      "<b>Ответ:</b> изгиб."
    ]
  },
  {
    id: "plastic",
    type: "упругая или пластическая",
    title: "Пластилиновый шарик",
    text: "Пластилиновый шарик сдавили, и он остался сплющенным. Упругая или пластическая деформация произошла?",
    placeholder: "упругая или пластическая",
    hint: "Исчезла ли деформация после снятия нагрузки?",
    check: value => /(пластич|неупруг|не\s*упруг)/.test(words(value)),
    answerText: "Пластическая (неупругая).",
    solution: [
      "<b>Разбор.</b> Признак упругой деформации — тело полностью возвращает форму после снятия нагрузки. Пластилин форму не вернул.",
      "<b>Ответ:</b> пластическая (неупругая) деформация."
    ]
  },
  {
    id: "direction",
    type: "направление силы",
    title: "Груз на пружине",
    text: "Груз неподвижно висит на пружине, пружина растянута вниз. Куда направлена сила упругости, действующая на груз?",
    placeholder: "вверх или вниз",
    hint: "Сила упругости направлена против деформации и уравновешивает силу тяжести.",
    check: value => /вверх/.test(words(value)) && !/вниз/.test(words(value)),
    answerText: "Вертикально вверх.",
    solution: [
      "<b>Разбор.</b> Пружина растянута вниз и стремится сократиться, поэтому тянет груз вверх. Это сила упругости, направленная против деформации.",
      "<b>Проверка:</b> груз неподвижен, значит сила упругости равна по модулю силе тяжести и противоположна ей по направлению.",
      "<b>Ответ:</b> вверх."
    ]
  },
  {
    id: "hooke-force",
    type: "сила",
    title: "Сила по закону Гука",
    text: "Жёсткость пружины 300 Н/м. Её растянули на 4 см. Найди силу упругости в ньютонах.",
    placeholder: "Н",
    hint: "Сначала переведи 4 см в метры: Δl = 0,04 м. F = kΔl.",
    check: value => near(numberValue(value), 12),
    answerText: "F = 12 Н.",
    solution: [
      "<b>Дано:</b> k = 300 Н/м; Δl = 4 см = 0,04 м.",
      "<b>Формула.</b> Закон Гука: F = kΔl.",
      "<b>Решение.</b> F = 300 · 0,04 = 12 Н.",
      "<b>Проверка единиц:</b> Н/м · м = Н.",
      "<b>Ответ:</b> 12 Н."
    ]
  },
  {
    id: "compression",
    type: "сила при сжатии",
    title: "Сжатая пружина",
    text: "Пружину жёсткостью 800 Н/м сжали на 2,5 см. Найди модуль силы упругости в ньютонах.",
    placeholder: "Н",
    hint: "Сжатие — тоже деформация: F = k|Δl|. Переведи 2,5 см в метры.",
    check: value => near(numberValue(value), 20),
    answerText: "F = 20 Н.",
    solution: [
      "<b>Дано:</b> k = 800 Н/м; |Δl| = 2,5 см = 0,025 м.",
      "<b>Решение.</b> F = k|Δl| = 800 · 0,025 = 20 Н.",
      "<b>Направление:</b> при сжатии пружина толкает тело от себя, то есть против деформации.",
      "<b>Ответ:</b> 20 Н."
    ]
  },
  {
    id: "stiffness-weight",
    type: "жёсткость",
    title: "Жёсткость по грузу",
    text: "Груз массой 0,5 кг неподвижно висит на пружине и растягивает её на 2,5 см. Найди жёсткость пружины в Н/м (g = 10 м/с²).",
    placeholder: "Н/м",
    hint: "Груз неподвижен: F = mg. Затем k = F / Δl, Δl = 0,025 м.",
    check: value => near(numberValue(value), 200),
    answerText: "k = 200 Н/м.",
    solution: [
      "<b>Дано:</b> m = 0,5 кг; Δl = 2,5 см = 0,025 м.",
      "<b>Сила:</b> груз неподвижен, поэтому F = mg = 0,5 · 10 = 5 Н.",
      "<b>Откуда формула.</b> Из F = kΔl получаем k = F / Δl.",
      "<b>Решение.</b> k = 5 / 0,025 = 200 Н/м.",
      "<b>Ответ:</b> 200 Н/м."
    ]
  },
  {
    id: "stretch-length",
    type: "удлинение",
    title: "Удлинение под силой",
    text: "Какое удлинение получит пружина жёсткостью 600 Н/м под действием силы 18 Н? Ответ дай в сантиметрах.",
    placeholder: "см",
    hint: "Δl = F / k. Результат получится в метрах, затем переведи в сантиметры.",
    check: value => near(numberValue(value), 3) || near(numberValue(value), .03),
    answerText: "Δl = 3 см (0,03 м).",
    solution: [
      "<b>Формула.</b> Из закона Гука Δl = F / k.",
      "<b>Решение.</b> Δl = 18 / 600 = 0,03 м = 3 см.",
      "<b>Проверка:</b> 600 · 0,03 = 18 Н.",
      "<b>Ответ:</b> 3 см."
    ]
  },
  {
    id: "proportion",
    type: "пропорциональность",
    title: "Сила при другом удлинении",
    text: "При удлинении пружины на 4 см возникает сила упругости 10 Н. Какая сила возникнет при удлинении на 6 см (упругая деформация)? Ответ в ньютонах.",
    placeholder: "Н",
    hint: "Сила пропорциональна удлинению. Во сколько раз выросло удлинение?",
    check: value => near(numberValue(value), 15),
    answerText: "F = 15 Н.",
    solution: [
      "<b>Способ 1.</b> Удлинение выросло в 6 / 4 = 1,5 раза, значит и сила выросла в 1,5 раза: F = 10 · 1,5 = 15 Н.",
      "<b>Способ 2.</b> k = F / Δl = 10 / 0,04 = 250 Н/м; F = 250 · 0,06 = 15 Н.",
      "<b>Ответ:</b> 15 Н."
    ]
  },
  {
    id: "graph",
    type: "график",
    title: "Жёсткость по графику",
    text: "График зависимости силы упругости от удлинения — прямая, идущая от начала координат через точку (Δl = 5 см; F = 15 Н). Найди жёсткость пружины в Н/м.",
    placeholder: "Н/м",
    hint: "Жёсткость равна отношению F к Δl для любой точки прямой. Переведи 5 см в метры.",
    check: value => near(numberValue(value), 300),
    answerText: "k = 300 Н/м.",
    solution: [
      "<b>Откуда формула.</b> Для прямой через начало координат F = kΔl, значит k = F / Δl для любой её точки.",
      "<b>Решение.</b> k = 15 / 0,05 = 300 Н/м.",
      "<b>Проверка:</b> в точке Δl = 10 см сила была бы 300 · 0,1 = 30 Н, то есть вдвое больше.",
      "<b>Ответ:</b> 300 Н/м."
    ]
  },
  {
    id: "length",
    type: "длина и удлинение",
    title: "Длина пружины",
    text: "Длина недеформированной пружины 15 см. Под нагрузкой её длина стала 21 см. Жёсткость 250 Н/м. Найди силу упругости в ньютонах.",
    placeholder: "Н",
    hint: "В закон Гука входит удлинение Δl = l − l₀, а не длина пружины.",
    check: value => near(numberValue(value), 15),
    answerText: "F = 15 Н.",
    solution: [
      "<b>Удлинение:</b> Δl = l − l₀ = 21 − 15 = 6 см = 0,06 м.",
      "<b>Решение.</b> F = kΔl = 250 · 0,06 = 15 Н.",
      "<b>Частая ошибка:</b> подставить 0,21 м; получилось бы 52,5 Н, это неверно.",
      "<b>Ответ:</b> 15 Н."
    ]
  },
  {
    id: "acceleration",
    type: "второй закон Ньютона",
    title: "Брусок на гладком столе",
    text: "Пружина жёсткостью 200 Н/м растянута на 3 см и тянет брусок массой 1,5 кг по гладкому столу. Найди ускорение бруска в м/с².",
    placeholder: "м/с²",
    hint: "Сначала сила упругости F = kΔl (Δl = 0,03 м), затем a = F / m.",
    check: value => near(numberValue(value), 4),
    answerText: "a = 4 м/с².",
    solution: [
      "<b>Дано:</b> k = 200 Н/м; Δl = 0,03 м; m = 1,5 кг; трения нет.",
      "<b>Сила:</b> F = kΔl = 200 · 0,03 = 6 Н.",
      "<b>Второй закон Ньютона.</b> Сила упругости — единственная горизонтальная сила: a = F / m = 6 / 1,5 = 4 м/с².",
      "<b>Ответ:</b> 4 м/с², направлено к недеформированному положению пружины."
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


// ===== Эксперимент: груз на пружине =====
const NS = "http://www.w3.org/2000/svg";
const SPRING_X = 255;
const TOP_Y = 36;
const NATURAL_Y = 140;       // нижний конец недеформированной пружины
const PX_PER_M = 400;        // 1 см = 4 пикселя
const LIMIT = 0.15;          // предел упругости: удлинение 15 см
const WEIGHT_SIZE = 40;
const RULER_X = 410;

const lab = {
  extension: 0,       // текущее удлинение на экране, м
  residual: 0,        // остаточное удлинение после перегрузки, м
  deformed: false,    // пружина когда-либо выходила за предел упругости
  loaded: false,
  revealed: false,
  moving: false,
  points: []
};

function readParams() {
  const k = Number($("#kInput").value);
  const mass = Number($("#massInput").value);
  const force = mass * G;
  const hooke = force / k;
  const overload = hooke > LIMIT + 1e-9;
  // За пределом упругости пружина вытягивается сильнее, чем по закону Гука.
  const real = overload ? LIMIT + (hooke - LIMIT) * 1.5 : hooke;
  return { k, mass, force, hooke, overload, real };
}

function springPath(endY) {
  const bottom = endY;
  const turns = 12;
  const start = TOP_Y + 10;
  const stop = bottom - 10;
  const parts = [`M${SPRING_X} ${TOP_Y}`, `L${SPRING_X} ${start}`];
  for (let i = 0; i < turns; i += 1) {
    const y = start + (stop - start) * (i + 0.5) / turns;
    const x = SPRING_X + (i % 2 === 0 ? -22 : 22);
    parts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  parts.push(`L${SPRING_X} ${stop}`, `L${SPRING_X} ${bottom}`);
  return parts.join(" ");
}

function buildRuler() {
  const ruler = $("#ruler");
  ruler.replaceChildren();
  const make = (name, attrs) => {
    const el = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  };
  ruler.append(make("line", { class: "ruler-line", x1: RULER_X, y1: NATURAL_Y, x2: RULER_X, y2: NATURAL_Y + 38 * 4 }));
  for (let cm = 0; cm <= 37; cm += 1) {
    const y = NATURAL_Y + cm * 4;
    const long = cm % 5 === 0;
    ruler.append(make("line", { class: "ruler-tick", x1: RULER_X, y1: y, x2: RULER_X + (long ? 14 : 8), y2: y }));
    if (long) {
      const text = make("text", { class: "ruler-text", x: RULER_X + 20, y: y + 4 });
      text.textContent = cm === 0 ? "0" : `${cm} см`;
      ruler.append(text);
    }
  }
  const title = make("text", { class: "ruler-text", x: RULER_X - 40, y: NATURAL_Y - 8 });
  title.textContent = "Δl";
  ruler.append(title);
}

function setArrow(line, label, x, y1, y2, labelDy) {
  line.setAttribute("x1", x);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x);
  line.setAttribute("y2", y2);
  line.setAttribute("visibility", "visible");
  label.setAttribute("x", x - 14);
  label.setAttribute("y", y2 + labelDy);
  label.setAttribute("visibility", "visible");
}

function drawScene() {
  const p = readParams();
  const endY = NATURAL_Y + lab.extension * PX_PER_M;
  const spring = $("#spring");
  spring.setAttribute("d", springPath(endY));
  spring.classList.toggle("plastic", lab.deformed);
  const weight = $("#weight");
  const hasLoad = lab.loaded || lab.moving;
  weight.setAttribute("visibility", hasLoad ? "visible" : "hidden");
  weight.setAttribute("y", endY);
  $("#weightText").setAttribute("y", endY + 25);
  $("#weightText").setAttribute("visibility", hasLoad ? "visible" : "hidden");
  $("#weightText").textContent = `${format(p.mass, 1)} кг`;

  const arrows = lab.loaded && !lab.moving;
  if (arrows) {
    const mid = endY + WEIGHT_SIZE / 2;
    const length = Math.min(95, 24 + p.force * 6);
    setArrow($("#vecF"), $("#labelF"), SPRING_X - 36, mid, Math.max(mid - length, TOP_Y + 40), -6);
    setArrow($("#vecG"), $("#labelG"), SPRING_X + 36, mid, mid + length, 18);
  } else {
    ["#vecF", "#vecG", "#labelF", "#labelG"].forEach(id => $(id).setAttribute("visibility", "hidden"));
  }

  $("#kLabel").textContent = format(p.k, 0);
  $("#massLabel").textContent = format(p.mass, 1);
  $("#kMeter").textContent = `${format(p.k, 0)} Н/м`;
  $("#mMeter").textContent = `${format(p.mass, 1)} кг`;
  // Расчётные величины скрыты, пока ученик не проверил прогноз.
  $("#gMeter").textContent = lab.revealed ? `${format(p.force, 1)} Н` : "?";
  $("#dlMeter").textContent = lab.revealed ? `${format(p.real * 100, 1)} см` : "?";
  $("#fMeter").textContent = lab.revealed ? `${format(p.force, 1)} Н` : "?";
}

function drawGraph() {
  const svg = $("#graph");
  svg.replaceChildren();
  const make = (name, attrs, text) => {
    const el = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    if (text !== undefined) el.textContent = text;
    svg.append(el);
    return el;
  };
  const left = 52;
  const right = 540;
  const top = 14;
  const bottom = 238;
  const maxX = 40;
  const maxY = 16;
  const sx = value => left + (right - left) * value / maxX;
  const sy = value => bottom - (bottom - top) * value / maxY;

  for (let x = 0; x <= maxX; x += 5) {
    make("line", { class: "graph-grid", x1: sx(x), y1: top, x2: sx(x), y2: bottom });
    make("text", { class: "graph-text", x: sx(x) - 6, y: bottom + 18 }, x);
  }
  for (let y = 0; y <= maxY; y += 4) {
    make("line", { class: "graph-grid", x1: left, y1: sy(y), x2: right, y2: sy(y) });
    make("text", { class: "graph-text", x: left - 28, y: sy(y) + 4 }, y);
  }
  make("line", { class: "graph-axis", x1: left, y1: bottom, x2: right, y2: bottom });
  make("line", { class: "graph-axis", x1: left, y1: top, x2: left, y2: bottom });
  make("text", { class: "graph-text", x: right - 70, y: bottom + 34 }, "Δl, см");
  make("text", { class: "graph-text", x: 6, y: top + 2 }, "F, Н");

  const elastic = lab.points.filter(point => !point.over);
  if (elastic.length > 0) {
    const last = elastic.reduce((a, b) => (b.dl > a.dl ? b : a));
    make("line", { class: "graph-line", x1: sx(0), y1: sy(0), x2: sx(last.dl), y2: sy(last.force) });
  }
  lab.points.forEach(point => {
    make("circle", { class: `graph-point${point.over ? " over" : ""}`, cx: sx(point.dl), cy: sy(point.force), r: 6 });
  });
}

let animationId = 0;

function animateTo(target, onDone, settle) {
  cancelAnimationFrame(animationId);
  const from = lab.extension;
  const start = performance.now();
  lab.moving = true;
  const duration = settle ? 1800 : 700;
  const frame = now => {
    const t = (now - start) / 1000;
    if (now - start >= duration) {
      lab.extension = target;
      lab.moving = false;
      drawScene();
      if (onDone) onDone();
      return;
    }
    if (settle) {
      lab.extension = from + (target - from) * (1 - Math.exp(-3.5 * t) * Math.cos(9 * t));
    } else {
      lab.extension = from + (target - from) * (1 - Math.exp(-6 * t));
    }
    drawScene();
    animationId = requestAnimationFrame(frame);
  };
  animationId = requestAnimationFrame(frame);
}

function resetExperiment(message, keepPoints) {
  cancelAnimationFrame(animationId);
  lab.extension = 0;
  lab.residual = 0;
  lab.deformed = false;
  lab.loaded = false;
  lab.moving = false;
  lab.revealed = false;
  if (!keepPoints) lab.points = [];
  drawScene();
  drawGraph();
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = message || "Сосчитай Δl и F сам, запиши прогноз и нажми «Проверить прогноз»: значения на табло откроются после верного ответа.";
  $("#verdict").textContent = "Груз неподвижен: сила упругости уравновешивает силу тяжести. Подвесь груз и сравни с прогнозом.";
}

function hangLoad() {
  if (lab.moving) return;
  const p = readParams();
  lab.loaded = true;
  const done = () => {
    const over = p.overload;
    if (over) lab.deformed = true;
    const dl = p.real * 100;
    if (!lab.points.some(point => Math.abs(point.force - p.force) < 1e-6)) {
      lab.points.push({ dl, force: p.force, over });
    }
    drawScene();
    drawGraph();
    const verdict = $("#verdict");
    const feedback = $("#labFeedback");
    if (over) {
      verdict.textContent = "Предел упругости превышен: пружина растянулась сильнее, чем по закону Гука. После снятия груза она не вернётся к прежней длине.";
      feedback.className = "feedback error";
      feedback.textContent = `Деформация вышла за предел упругости (Δl > ${LIMIT * 100} см): формула Δl = F/k здесь уже не работает. Измерь удлинение по линейке и сравни с mg/k. Сила упругости при равновесии всё равно равна mg.`;
    } else {
      verdict.textContent = "Груз неподвижен: сила упругости равна силе тяжести и направлена против неё — вверх.";
      feedback.className = "feedback";
      feedback.textContent = "Измерь удлинение по линейке: пружина растянулась от пунктирной линии. Добавь точку на график другим грузом.";
    }
  };
  animateTo(p.real, done, true);
}

function unloadSpring() {
  if (lab.moving || !lab.loaded) return;
  const p = readParams();
  lab.loaded = false;
  if (p.overload) {
    lab.residual = Math.max(lab.residual, (p.real - LIMIT) * 0.8);
    lab.deformed = true;
  }
  animateTo(lab.residual, () => {
    const verdict = $("#verdict");
    const feedback = $("#labFeedback");
    if (lab.residual > 0) {
      verdict.textContent = `Остаточное удлинение ${format(lab.residual * 100, 1)} см: деформация пластическая, пружина испорчена.`;
      feedback.className = "feedback error";
      feedback.textContent = "Это и есть пластическая деформация: после снятия нагрузки форма не восстановилась. Нажми «Новая пружина и график», чтобы продолжить опыты.";
    } else {
      verdict.textContent = "Груз снят: деформация упругая, пружина вернулась к начальной длине.";
      feedback.className = "feedback";
      feedback.textContent = "Упругая деформация исчезает после снятия нагрузки. Попробуй другую массу.";
    }
  }, false);
}

function checkPrediction() {
  const p = readParams();
  const predictedDl = numberValue($("#predDl").value);
  const predictedF = numberValue($("#predF").value);
  const feedback = $("#labFeedback");
  if (!Number.isFinite(predictedDl) || !Number.isFinite(predictedF)) {
    feedback.className = "feedback error";
    feedback.textContent = "Сначала сосчитай и запиши оба прогноза: удлинение Δl в сантиметрах и силу F в ньютонах.";
    return;
  }
  const forceOk = near(predictedF, p.force, .05);
  if (p.overload) {
    // За пределом упругости закон Гука не позволяет предсказать удлинение, проверяем только силу.
    if (forceOk) {
      lab.revealed = true;
      drawScene();
      feedback.className = "feedback success";
      feedback.textContent = `Сила верна: F = mg = ${format(p.force, 1)} Н. Но mg/k = ${format(p.hooke * 100, 1)} см больше предела упругости ${LIMIT * 100} см, поэтому настоящее удлинение (${format(p.real * 100, 1)} см) определяется по линейке, а не по формуле Гука.`;
      return;
    }
    feedback.className = "feedback error";
    feedback.textContent = "Сила неверна: груз неподвижен, значит F = mg. Исправь прогноз и проверь ещё раз; если застрял, нажми «Показать значения».";
    return;
  }
  const dlOk = near(predictedDl, p.hooke * 100, .05);
  if (dlOk && forceOk) {
    lab.revealed = true;
    drawScene();
    feedback.className = "feedback success";
    feedback.textContent = `Прогноз верный: F = mg = ${format(p.force, 1)} Н, Δl = F/k = ${format(p.hooke * 100, 1)} см. Значения на табло открыты.`;
    return;
  }
  const parts = [];
  if (!forceOk) parts.push("сила: груз неподвижен, поэтому сила упругости равна силе тяжести, F = mg");
  if (!dlOk) parts.push("удлинение: Δl = F/k; не забудь перевести метры в сантиметры");
  feedback.className = "feedback error";
  feedback.textContent = `Пока не сходится — ${parts.join("; ")}. Исправь прогноз и проверь ещё раз; если застрял, нажми «Показать значения».`;
}

function initExperiment() {
  buildRuler();
  $("#kInput").addEventListener("input", () => resetExperiment("Новая пружина: график очищен. Сделай новый прогноз."));
  $("#massInput").addEventListener("input", () => {
    // Смена груза сохраняет точки графика одной и той же пружины, но снимает груз с неё.
    const keep = !lab.deformed;
    resetExperiment("Масса груза изменилась. Сделай новый прогноз.", keep);
  });
  $("#hangBtn").addEventListener("click", hangLoad);
  $("#unloadBtn").addEventListener("click", unloadSpring);
  $("#checkBtn").addEventListener("click", checkPrediction);
  $("#revealBtn").addEventListener("click", () => {
    lab.revealed = true;
    drawScene();
    $("#labFeedback").className = "feedback";
    $("#labFeedback").textContent = "Значения открыты. Разбери, как они получаются, и реши заново с другими k и m.";
  });
  $("#clearBtn").addEventListener("click", () => resetExperiment("Новая пружина, график очищен."));
  resetExperiment();
}

// ===== Калькулятор =====
const calcModes = {
  force: { x: ["Жёсткость k, Н/м", 200], y: ["Удлинение Δl, см", 5] },
  stiff: { x: ["Сила F, Н", 10], y: ["Удлинение Δl, см", 5] },
  stretch: { x: ["Сила F, Н", 20], y: ["Жёсткость k, Н/м", 250] },
  hang: { x: ["Масса груза m, кг", 0.5], y: ["Жёсткость k, Н/м", 200] }
};

function setCalcMode() {
  const mode = calcModes[$("#calcMode").value];
  $("#calcXLabel").textContent = mode.x[0];
  $("#calcX").value = mode.x[1];
  $("#calcYLabel").textContent = mode.y[0];
  $("#calcY").value = mode.y[1];
  $("#calculationResult").replaceChildren();
}

function calculate() {
  const mode = $("#calcMode").value;
  const x = Number($("#calcX").value);
  const y = Number($("#calcY").value);
  const result = $("#calculationResult");
  if (!(x > 0) || !(y > 0)) {
    result.textContent = "Введите положительные значения.";
    return;
  }
  const lines = [];
  let answer;
  if (mode === "force") {
    const dl = y / 100;
    lines.push(`Переводим удлинение: ${format(y)} см = ${format(dl, 4)} м.`);
    const force = x * dl;
    lines.push(`Закон Гука: F = kΔl = ${format(x)} · ${format(dl, 4)} = ${format(force, 3)} Н.`);
    answer = `F = ${format(force, 3)} Н`;
  } else if (mode === "stiff") {
    const dl = y / 100;
    lines.push(`Переводим удлинение: ${format(y)} см = ${format(dl, 4)} м.`);
    const k = x / dl;
    lines.push(`Жёсткость: k = F / Δl = ${format(x)} / ${format(dl, 4)} = ${format(k, 3)} Н/м.`);
    lines.push(`Проверка: kΔl = ${format(k, 3)} · ${format(dl, 4)} = ${format(k * dl, 3)} Н.`);
    answer = `k = ${format(k, 3)} Н/м`;
  } else if (mode === "stretch") {
    const dl = x / y;
    lines.push(`Закон Гука: Δl = F / k = ${format(x)} / ${format(y)} = ${format(dl, 4)} м = ${format(dl * 100, 2)} см.`);
    lines.push(`Проверка: kΔl = ${format(y)} · ${format(dl, 4)} = ${format(y * dl, 3)} Н.`);
    answer = `Δl = ${format(dl * 100, 2)} см`;
  } else {
    const force = x * G;
    const dl = force / y;
    lines.push(`Груз неподвижен, поэтому F = mg = ${format(x)} · 10 = ${format(force, 3)} Н.`);
    lines.push(`Закон Гука: Δl = F / k = ${format(force, 3)} / ${format(y)} = ${format(dl, 4)} м = ${format(dl * 100, 2)} см.`);
    answer = `F = ${format(force, 3)} Н; Δl = ${format(dl * 100, 2)} см`;
  }
  lines.push("Силу упругости направляем против деформации: растянутая пружина тянет тело к себе.");
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
