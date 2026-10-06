"use strict";

const STORAGE_PREFIX = "grade9-curvilinear-motion";

const examples = [
  {
    id: "puck-hit",
    level: "базовый уровень",
    title: "Шайба и удар клюшкой",
    text: "Шайба скользит по льду без трения. Игрок ударяет по ней клюшкой перпендикулярно скорости, удар мгновенный. Как будет двигаться шайба после удара?",
    steps: [
      { title: "Что было до удара", body: "Сил нет, лёд гладкий. По первому закону Ньютона шайба движется равномерно и прямолинейно." },
      { title: "Что сделал удар", body: "Удар мгновенный: он изменил скорость, но не действует на шайбу в дальнейшем движении." },
      { title: "Что происходит после удара", body: "После удара сил снова нет. Шайба движется по инерции равномерно по новой прямой." }
    ],
    answer: "движение остаётся прямолинейным, но под углом к прежнему направлению. Криволинейным оно стало бы только при силе, которая действует всё время."
  },
  {
    id: "velodrome",
    level: "базовый уровень",
    title: "Половина велотрека",
    text: "Велосипедист проехал половину круглого трека радиусом 50 м. Найди путь, модуль перемещения и сравни их. Принять π = 3,14.",
    steps: [
      { title: "Дано", body: "R = 50 м; π = 3,14." },
      { title: "Откуда формула пути", body: "Длина всей окружности равна π, умноженному на диаметр: C = 2πR. Половина окружности — половина этой длины: l = C / 2 = 2πR / 2 = πR." },
      { title: "Путь", body: "l = πR = 3,14 · 50 = 157 м." },
      { title: "Перемещение", body: "Начало и конец пути — концы диаметра. Модуль перемещения равен диаметру: s = 2R = 100 м." },
      { title: "Сравнение", body: "l / s = 157 / 100 = 1,57. Путь больше модуля перемещения: так всегда бывает на кривой." }
    ],
    answer: "l = 157 м; s = 100 м; путь в 1,57 раза больше перемещения."
  },
  {
    id: "rope-stone",
    level: "средний уровень",
    title: "Камень на нити",
    text: "Камень массой 2 кг раскручивают в горизонтальной плоскости. Нить всё время перпендикулярна скорости. Почему нить заставляет камень поворачивать, но не разгоняет его? Что будет, если нить оборвётся?",
    steps: [
      { title: "Направление силы", body: "Сила нити направлена к центру окружности, то есть поперёк скорости." },
      { title: "Модуль скорости", body: "Составляющей силы вдоль скорости нет, поэтому модуль скорости не меняется." },
      { title: "Направление скорости", body: "Составляющая силы поперёк скорости поворачивает вектор скорости, поэтому траектория искривляется." },
      { title: "Обрыв нити", body: "После обрыва сил нет. Камень по инерции летит по прямой — по касательной к окружности в точке обрыва." }
    ],
    answer: "перпендикулярная сила меняет направление скорости, но не модуль; после обрыва камень летит по касательной."
  },
  {
    id: "roof-throw",
    level: "повышенный уровень",
    title: "Бросок с крыши",
    text: "Со здания высотой 45 м бросили камень горизонтально со скоростью 8 м/с. Найди время падения, дальность по горизонтали и скорость в момент падения. g = 10 м/с², сопротивление воздуха не учитываем.",
    steps: [
      { title: "Почему траектория кривая", body: "Сила тяжести направлена вниз, а начальная скорость — горизонтально. Угол между ними 90°, поэтому траектория искривляется." },
      { title: "Разделяем движения", body: "По горизонтали сил нет — движение равномерное, x = v₀t. По вертикали — свободное падение, h = gt²/2." },
      { title: "Откуда формула времени", body: "По вертикали камень падает без начальной скорости (урок 08): h = gt²/2. Умножим на 2: 2h = gt². Разделим на g: t² = 2h/g. Извлечём корень: t = √(2h/g)." },
      { title: "Время", body: "t = √(2h/g) = √(2 · 45 / 10) = √9 = 3 с. Время не зависит от горизонтальной скорости." },
      { title: "Дальность", body: "l = v₀t = 8 · 3 = 24 м." },
      { title: "Скорость при падении", body: "Горизонтальная составляющая v₀ = 8 м/с, вертикальная vᵧ = gt = 30 м/с. Модуль v = √(8² + 30²) = √964 ≈ 31 м/с." }
    ],
    answer: "t = 3 с; l = 24 м; v ≈ 31 м/с."
  }
];

const tasks = [
  {
    id: "tangent",
    type: "направление скорости",
    title: "Куда направлена скорость",
    text: "Тело движется по окружности. Как направлена мгновенная скорость в любой точке траектории относительно окружности?",
    placeholder: "ответ словами",
    hint: "Вспомни искры от точильного камня.",
    check: value => /касат/.test(words(value)),
    answerText: "Скорость направлена по касательной к траектории.",
    solution: [
      "<b>Разбор.</b> В каждой точке траектории мгновенная скорость показывает, куда тело поехало бы без силы, которая его поворачивает.",
      "Это направление касательной: искры и брызги отрываются и летят по прямым, касающимся окружности.",
      "<b>Ответ:</b> по касательной."
    ]
  },
  {
    id: "straight-car",
    type: "условие траектории",
    title: "Разгон автомобиля",
    text: "Автомобиль разгоняется по прямой дороге. Сила тяги направлена вдоль скорости. Прямолинейным или криволинейным будет движение?",
    placeholder: "прямолинейное или криволинейное",
    hint: "Какой угол между силой и скоростью?",
    check: value => /прям/.test(words(value)) && !/крив/.test(words(value)),
    answerText: "Движение прямолинейное: сила лежит на одной прямой со скоростью.",
    solution: [
      "<b>Разбор.</b> Угол между силой и скоростью равен 0°. Направление скорости не меняется, меняется только её модуль.",
      "Поэтому траектория остаётся прямой.",
      "<b>Ответ:</b> прямолинейное ускоренное движение."
    ]
  },
  {
    id: "angle-30",
    type: "условие траектории",
    title: "Сила под углом 30°",
    text: "Постоянная сила действует на тело под углом 30° к его скорости. Какой будет траектория: прямой или кривой?",
    placeholder: "прямая или кривая",
    hint: "Сравни 30° с углами 0° и 180°.",
    check: value => /крив/.test(words(value)),
    answerText: "Траектория кривая: угол не равен 0° и 180°.",
    solution: [
      "<b>Разбор.</b> Разложим силу на две составляющие: F·cos 30° вдоль скорости и F·sin 30° поперёк.",
      "Вдоль скорости составляющая увеличивает модуль, а поперёк — поворачивает скорость.",
      "<b>Ответ:</b> криволинейное движение, модуль скорости растёт."
    ]
  },
  {
    id: "perpendicular-speed",
    type: "модуль и направление",
    title: "Сила под прямым углом",
    text: "Сила всё время перпендикулярна скорости. Меняется ли модуль скорости? Ответь «да» или «нет» и поясни.",
    placeholder: "да или нет + пояснение",
    hint: "Есть ли составляющая силы вдоль скорости?",
    check: value => /(^|\s)нет(\s|$|,|\.)|не\s+меня|не\s+измен|постоян/.test(words(value)),
    answerText: "Нет, модуль скорости не меняется; меняется только направление.",
    solution: [
      "<b>Разбор.</b> Если сила перпендикулярна скорости, то составляющей вдоль скорости нет. Значит, модуль скорости разгоняться или тормозиться не может.",
      "Сила только поворачивает вектор скорости. Так бывает при равномерном движении по окружности.",
      "<b>Ответ:</b> нет, модуль не меняется."
    ]
  },
  {
    id: "against-speed",
    type: "условие траектории",
    title: "Торможение шайбы",
    text: "Шайба скользит по льду, и на неё действует сила трения против скорости. Прямолинейным или криволинейным будет движение и что произойдёт со скоростью?",
    placeholder: "вид движения и что со скоростью",
    hint: "Угол между силой и скоростью равен 180°.",
    check: value => /прям/.test(words(value)) && !/крив/.test(words(value)),
    answerText: "Движение прямолинейное, модуль скорости уменьшается до остановки.",
    solution: [
      "<b>Разбор.</b> Сила трения направлена против скорости, то есть лежит на одной прямой с ней. Угол равен 180°.",
      "Направление скорости не меняется, поэтому траектория прямая. Модуль скорости убывает.",
      "<b>Ответ:</b> прямолинейное замедленное движение."
    ]
  },
  {
    id: "semicircle-path",
    type: "путь на дуге",
    title: "Путь по полуокружности",
    text: "Автомобиль проехал по половине круглой площади радиусом 20 м. Найди путь в метрах (π = 3,14).",
    placeholder: "м",
    hint: "Путь — длина половины окружности: l = πR.",
    check: value => near(numberValue(value), 62.8),
    answerText: "l = 62,8 м.",
    solution: [
      "<b>Дано:</b> R = 20 м; π = 3,14.",
      "<b>Откуда формула.</b> Длина всей окружности C = 2πR (π, умноженное на диаметр 2R). Половина окружности — половина этой длины: l = C/2 = πR.",
      "<b>Решение.</b> l = πR = 3,14 · 20 = 62,8 м.",
      "<b>Ответ:</b> 62,8 м."
    ]
  },
  {
    id: "semicircle-displacement",
    type: "перемещение",
    title: "Перемещение по полуокружности",
    text: "Для той же полуокружности радиусом 20 м найди модуль перемещения в метрах.",
    placeholder: "м",
    hint: "Начало и конец — концы диаметра.",
    check: value => near(numberValue(value), 40),
    answerText: "s = 40 м.",
    solution: [
      "<b>Разбор.</b> Начальная и конечная точки лежат на концах диаметра (диаметр — это два радиуса). Модуль перемещения равен длине этого отрезка: s = 2R = 40 м.",
      "Сравним: путь 62,8 м больше перемещения 40 м.",
      "<b>Ответ:</b> 40 м."
    ]
  },
  {
    id: "quarter-displacement",
    type: "перемещение",
    title: "Четверть окружности",
    text: "Тело прошло четверть окружности радиусом 5 м. Найди модуль перемещения в метрах (√2 ≈ 1,41).",
    placeholder: "м",
    hint: "Начало, конец и центр образуют прямоугольный равнобедренный треугольник.",
    check: value => near(numberValue(value), 7.07, .02),
    answerText: "s ≈ 7,07 м.",
    solution: [
      "<b>Разбор.</b> Четверть окружности — угол 90° при центре. Радиусы к началу и концу дуги перпендикулярны, поэтому вместе с перемещением s образуют прямоугольный треугольник: катеты равны R, перемещение — гипотенуза.",
      "<b>Теорема Пифагора:</b> квадрат гипотенузы равен сумме квадратов катетов, s² = R² + R² = 2R², откуда s = R√2.",
      "<b>Числа:</b> s = 5 · 1,41 ≈ 7,07 м. Путь при этом — четверть длины окружности: 2πR/4 = πR/2 = 7,85 м.",
      "<b>Ответ:</b> ≈ 7,07 м."
    ]
  },
  {
    id: "average-path-speed",
    type: "путевая скорость",
    title: "Скорость на закруглении",
    text: "Мотоциклист проехал по закруглению дороги путь 90 м за 6 с. Найди среднюю путевую скорость в м/с.",
    placeholder: "м/с",
    hint: "Путевая скорость равна пути, делённому на время.",
    check: value => near(numberValue(value), 15),
    answerText: "v = 15 м/с.",
    solution: [
      "<b>Разбор.</b> Средняя путевая скорость — это путь за единицу времени, а не перемещение за единицу времени.",
      "v = l / t = 90 / 6 = 15 м/с.",
      "<b>Ответ:</b> 15 м/с."
    ]
  },
  {
    id: "rope-break",
    type: "инерция и касательная",
    title: "Обрыв нити",
    text: "Камень раскручивали на нити по кругу, нить оборвалась. Как полетит камень сразу после обрыва (сопротивлением и тяжестью пренебречь)?",
    placeholder: "ответ словами",
    hint: "После обрыва нет силы, которая поворачивает скорость.",
    check: value => /касат|прям/.test(words(value)),
    answerText: "Камень полетит по прямой, по касательной к окружности в точке обрыва.",
    solution: [
      "<b>Разбор.</b> Пока нить натянута, её сила поворачивает скорость. После обрыва поворачивающей силы нет.",
      "Камень сохраняет скорость, которая была в момент обрыва, и движется равномерно прямолинейно по инерции.",
      "<b>Ответ:</b> по касательной."
    ]
  },
  {
    id: "throw-time",
    type: "горизонтальный бросок",
    title: "Время броска",
    text: "Камень бросили горизонтально со скоростью 5 м/с с высоты 80 м. Найди время падения в секундах (g = 10 м/с²).",
    placeholder: "с",
    hint: "Время определяет только вертикальное падение: t = √(2h/g).",
    check: value => near(numberValue(value), 4),
    answerText: "t = 4 с.",
    solution: [
      "<b>Модель.</b> По вертикали камень падает без начальной скорости, как свободно падающее тело: h = gt²/2.",
      "<b>Откуда формула.</b> Умножим обе части на 2: 2h = gt². Разделим на g: t² = 2h/g. Извлечём корень: t = √(2h/g).",
      "<b>Решение.</b> t = √(2 · 80 / 10) = √16 = 4 с.",
      "<b>Ответ:</b> 4 с. Горизонтальная скорость на время падения не влияет."
    ]
  },
  {
    id: "throw-range",
    type: "горизонтальный бросок",
    title: "Дальность броска",
    text: "Для того же броска (v₀ = 5 м/с, h = 80 м) найди расстояние по горизонтали от точки броска до точки падения в метрах.",
    placeholder: "м",
    hint: "По горизонтали движение равномерное: l = v₀t.",
    check: value => near(numberValue(value), 20),
    answerText: "l = 20 м.",
    solution: [
      "<b>Разбор.</b> По горизонтали сил нет, поэтому скорость остаётся 5 м/с. Время падения известно из предыдущей задачи: 4 с.",
      "l = v₀t = 5 · 4 = 20 м.",
      "<b>Ответ:</b> 20 м."
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

// ===== Эксперимент: сила и траектория =====
const SCALE = 32;            // пикселей в одном метре
const STEP = 1 / 120;        // шаг интегрирования, с
const TIME_FACTOR = 1.6;     // модельных секунд за одну реальную
const MAX_TIME = 6;          // длительность опыта, модельных секунд
const NS = "http://www.w3.org/2000/svg";

const lab = {
  body: null,
  trail: [],
  time: 0,
  released: false,
  finished: false,
  initialSpeed: 0,
  lastFrame: 0,
  settings: null
};

function readSettings() {
  const mode = $("#modeSelect").value;
  const angle = Number($("#angleInput").value);
  const accel = Number($("#accelInput").value);
  const speed = Number($("#speedInput").value);
  const direction = Number($("#dirInput").value);
  return { mode, angle, accel, speed, direction };
}

function origin(mode) {
  return mode === "grav" ? { x: 70, y: 235 } : { x: 150, y: 340 };
}

function toScreen(point, settings) {
  const o = origin(settings.mode);
  return { x: o.x + point.x * SCALE, y: o.y - point.y * SCALE };
}

function expectedStraight(settings) {
  if (settings.accel === 0) return true;
  if (settings.mode === "rel") return settings.angle === 0 || settings.angle === 180;
  return settings.direction === 90;
}

function newBody(settings) {
  const heading = settings.direction * Math.PI / 180;
  return {
    x: 0,
    y: 0,
    speed: settings.speed,
    heading,
    vx: settings.speed * Math.cos(heading),
    vy: settings.speed * Math.sin(heading)
  };
}

function velocityOf(body, settings) {
  if (settings.mode === "rel") return { x: body.speed * Math.cos(body.heading), y: body.speed * Math.sin(body.heading) };
  return { x: body.vx, y: body.vy };
}

function accelerationOf(body, settings) {
  const accel = lab.released ? 0 : settings.accel;
  if (accel === 0) return { x: 0, y: 0 };
  if (settings.mode === "grav") return { x: 0, y: -accel };
  const direction = body.heading + settings.angle * Math.PI / 180;
  return { x: accel * Math.cos(direction), y: accel * Math.sin(direction) };
}

function stepBody(body, settings, dt) {
  const accel = lab.released ? 0 : settings.accel;
  if (settings.mode === "rel") {
    const tangential = accel * Math.cos(settings.angle * Math.PI / 180);
    const normal = Math.abs(Math.sin(settings.angle * Math.PI / 180)) < 1e-9 ? 0 : accel * Math.sin(settings.angle * Math.PI / 180);
    const nextSpeed = body.speed + tangential * dt;
    if (nextSpeed <= 0) {
      body.speed = 0;
      return false;
    }
    const turn = normal / Math.max(body.speed, 1e-6) * dt;
    const mid = body.heading + turn / 2;
    body.x += body.speed * Math.cos(mid) * dt;
    body.y += body.speed * Math.sin(mid) * dt;
    body.heading += turn;
    body.speed = nextSpeed;
    return true;
  }
  const ay = accel === 0 ? 0 : -accel;
  body.x += body.vx * dt;
  body.y += body.vy * dt + .5 * ay * dt * dt;
  body.vy += ay * dt;
  body.speed = Math.hypot(body.vx, body.vy);
  body.heading = Math.atan2(body.vy, body.vx);
  return true;
}

function angleBetween(a, v) {
  const am = Math.hypot(a.x, a.y);
  const vm = Math.hypot(v.x, v.y);
  if (am < 1e-9 || vm < 1e-9) return null;
  const cosine = Math.max(-1, Math.min(1, (a.x * v.x + a.y * v.y) / (am * vm)));
  return Math.acos(cosine) * 180 / Math.PI;
}

function arrow(line, from, dx, dy) {
  line.setAttribute("x1", from.x);
  line.setAttribute("y1", from.y);
  line.setAttribute("x2", from.x + dx);
  line.setAttribute("y2", from.y + dy);
}

function drawScene() {
  const s = lab.settings;
  const body = lab.body;
  const p = toScreen(body, s);
  $("#ball").setAttribute("cx", p.x);
  $("#ball").setAttribute("cy", p.y);

  const v = velocityOf(body, s);
  const vm = Math.hypot(v.x, v.y);
  const vLen = Math.min(130, vm * 18);
  const vecV = $("#vecV");
  const labelV = $("#labelV");
  if (vm > 1e-6) {
    const ux = v.x / vm;
    const uy = -v.y / vm;
    arrow(vecV, p, ux * vLen, uy * vLen);
    vecV.setAttribute("visibility", "visible");
    labelV.setAttribute("x", p.x + ux * (vLen + 18) - 4);
    labelV.setAttribute("y", p.y + uy * (vLen + 18) + 5);
    labelV.setAttribute("visibility", "visible");
    const tangent = $("#tangent");
    tangent.setAttribute("x1", p.x - ux * 420);
    tangent.setAttribute("y1", p.y - uy * 420);
    tangent.setAttribute("x2", p.x + ux * 420);
    tangent.setAttribute("y2", p.y + uy * 420);
    tangent.setAttribute("visibility", $("#tangentToggle").checked ? "visible" : "hidden");
  } else {
    vecV.setAttribute("visibility", "hidden");
    labelV.setAttribute("visibility", "hidden");
    $("#tangent").setAttribute("visibility", "hidden");
  }

  const a = accelerationOf(body, s);
  const am = Math.hypot(a.x, a.y);
  const vecF = $("#vecF");
  const labelF = $("#labelF");
  if (am > 1e-6) {
    const fLen = Math.min(120, am * 22);
    const ux = a.x / am;
    const uy = -a.y / am;
    arrow(vecF, p, ux * fLen, uy * fLen);
    vecF.setAttribute("visibility", "visible");
    labelF.setAttribute("x", p.x + ux * (fLen + 18) - 4);
    labelF.setAttribute("y", p.y + uy * (fLen + 18) + 5);
    labelF.setAttribute("visibility", "visible");
  } else {
    vecF.setAttribute("visibility", "hidden");
    labelF.setAttribute("visibility", "hidden");
  }

  const angle = angleBetween(a, v);
  $("#timeMeter").textContent = `${format(lab.time, 1)} с`;
  $("#speedMeter").textContent = `${format(body.speed, 2)} м/с`;
  $("#angleMeter").textContent = angle === null ? "—" : `${format(angle, 0)}°`;

  // Вывод о траектории скрыт до конца опыта, чтобы он не подсказывал прогноз.
  const verdict = $("#verdict");
  if (!lab.finished) verdict.textContent = "Вывод о траектории появится после опыта. Наблюдай за стрелками.";
  else if (lab.released || s.accel === 0) verdict.textContent = "Силы нет — тело движется по инерции прямолинейно и равномерно.";
  else if (angle !== null && (angle < .5 || angle > 179.5)) verdict.textContent = "Сила на одной прямой со скоростью: траектория прямая.";
  else verdict.textContent = "Сила под углом к скорости: траектория искривляется.";

  const points = lab.trail.map((q, index) => `${index === 0 ? "M" : "L"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
  $("#trail").setAttribute("d", points);
}

function setupScene() {
  const s = lab.settings;
  $("#groundLine").setAttribute("visibility", s.mode === "grav" ? "visible" : "hidden");
  const o = origin(s.mode);
  $("#startDot").setAttribute("cx", o.x);
  $("#startDot").setAttribute("cy", o.y);
  $("#angleRow").hidden = s.mode !== "rel";
}

function resetExperiment(message) {
  cancelAnimationFrame(state.animationId);
  state.running = false;
  lab.settings = readSettings();
  lab.body = newBody(lab.settings);
  lab.time = 0;
  lab.released = false;
  lab.finished = false;
  lab.initialSpeed = lab.settings.speed;
  lab.trail = [toScreen(lab.body, lab.settings)];
  $("#runBtn").disabled = false;
  $("#releaseBtn").disabled = true;
  $("#angleLabel").textContent = lab.settings.angle;
  $("#accelLabel").textContent = format(lab.settings.accel, 1);
  $("#speedLabel").textContent = format(lab.settings.speed, 1);
  $("#dirLabel").textContent = lab.settings.direction;
  setupScene();
  drawScene();
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = message || "Сделай прогноз и нажми «Запустить».";
}

function speedTrend(initial, final) {
  const change = (final - initial) / Math.max(initial, 1e-6);
  if (change > .02) return "grow";
  if (change < -.02) return "fall";
  return "same";
}

const trendNames = { grow: "растёт", fall: "убывает", same: "не меняется" };
const pathNames = { straight: "прямая", curve: "кривая" };

function finishExperiment(reason) {
  lab.finished = true;
  drawScene();
  state.running = false;
  cancelAnimationFrame(state.animationId);
  $("#runBtn").disabled = false;
  $("#releaseBtn").disabled = true;
  const s = lab.settings;
  const path = expectedStraight(s) ? "straight" : "curve";
  const trend = speedTrend(lab.initialSpeed, lab.body.speed);
  const feedback = $("#labFeedback");
  const predictedPath = $("#predPath").value;
  const predictedSpeed = $("#predSpeed").value;
  const summary = `Опыт закончен (${reason}). Траектория: ${pathNames[path]}; модуль скорости ${trendNames[trend]} (было ${format(lab.initialSpeed, 1)} м/с, стало ${format(lab.body.speed, 1)} м/с).`;
  if (!predictedPath || !predictedSpeed) {
    feedback.className = "feedback error";
    feedback.textContent = `${summary} В следующий раз сначала выбери оба прогноза.`;
    return;
  }
  const pathOk = predictedPath === path;
  const speedOk = predictedSpeed === trend;
  if (lab.released) {
    feedback.className = "feedback success";
    feedback.textContent = `${summary} После снятия силы тело движется по касательной к прежней траектории.`;
  } else if (pathOk && speedOk) {
    feedback.className = "feedback success";
    feedback.textContent = `${summary} Оба прогноза верны.`;
  } else {
    const parts = [];
    if (!pathOk) parts.push("траектория: проверь угол между силой и скоростью");
    if (!speedOk) parts.push("скорость: смотри составляющую силы вдоль скорости");
    feedback.className = "feedback error";
    feedback.textContent = `${summary} Что перепроверить — ${parts.join("; ")}.`;
  }
}

function runExperiment() {
  if (state.running) return;
  resetExperiment("Опыт идёт. Следи за стрелками скорости и силы.");
  state.running = true;
  $("#runBtn").disabled = true;
  $("#releaseBtn").disabled = lab.settings.accel === 0;
  lab.lastFrame = performance.now();
  let counter = 0;

  const frame = now => {
    const elapsed = Math.min(.05, (now - lab.lastFrame) / 1000) * TIME_FACTOR;
    lab.lastFrame = now;
    const steps = Math.max(1, Math.round(elapsed / STEP));
    let reason = "";
    for (let index = 0; index < steps && !reason; index += 1) {
      const alive = stepBody(lab.body, lab.settings, elapsed / steps);
      lab.time += elapsed / steps;
      counter += 1;
      if (counter % 3 === 0) lab.trail.push(toScreen(lab.body, lab.settings));
      const p = toScreen(lab.body, lab.settings);
      if (!alive) reason = "тело остановилось";
      else if (lab.time >= MAX_TIME) reason = "прошло 6 с";
      else if (lab.settings.mode === "grav" && p.y >= 388) reason = "тело упало на землю";
      else if (p.x < -20 || p.x > 580 || p.y < -20 || p.y > 420) reason = "тело вышло за рамку";
    }
    lab.trail.push(toScreen(lab.body, lab.settings));
    drawScene();
    if (reason) {
      finishExperiment(reason);
      return;
    }
    state.animationId = requestAnimationFrame(frame);
  };
  state.animationId = requestAnimationFrame(frame);
}

function releaseForce() {
  if (!state.running || lab.released) return;
  lab.released = true;
  $("#releaseBtn").disabled = true;
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = "Силу убрали. Теперь тело движется по инерции по прямой — по касательной к прежней траектории.";
}

function initExperiment() {
  ["modeSelect", "angleInput", "accelInput", "speedInput", "dirInput"].forEach(id => {
    $(`#${id}`).addEventListener("input", () => resetExperiment("Условия изменились. Сделай новый прогноз."));
  });
  $("#tangentToggle").addEventListener("change", () => drawScene());
  $("#runBtn").addEventListener("click", runExperiment);
  $("#resetBtn").addEventListener("click", () => resetExperiment());
  $("#releaseBtn").addEventListener("click", releaseForce);
  resetExperiment();
}

// ===== Калькулятор дуги =====
function drawArc() {
  const angle = Number($("#arcAngle").value);
  $("#arcAngleLabel").textContent = angle;
  const cx = 150, cy = 75, r = 62;
  const start = (270 - angle / 2) * Math.PI / 180;
  const end = (270 + angle / 2) * Math.PI / 180;
  const a = { x: cx + r * Math.cos(start), y: cy - r * Math.sin(start) };
  const b = { x: cx + r * Math.cos(end), y: cy - r * Math.sin(end) };
  const svg = $("#arcPreview");
  svg.replaceChildren();
  const make = (tag, attrs) => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    svg.append(element);
  };
  make("circle", { cx, cy, r, class: "guide-circle" });
  make("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "chord-line" });
  make("path", { d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${r} ${r} 0 ${angle > 180 ? 1 : 0} 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`, class: "arc-line" });
  make("circle", { cx: a.x, cy: a.y, r: 5, class: "arc-dot" });
  make("circle", { cx: b.x, cy: b.y, r: 5, class: "arc-dot" });
  make("circle", { cx, cy, r: 3, class: "center-dot" });
  const label = document.createElementNS(NS, "text");
  label.setAttribute("x", "10");
  label.setAttribute("y", "181");
  label.setAttribute("class", "svg-label");
  label.textContent = "дуга — путь, пунктир — перемещение";
  label.setAttribute("font-size", "13");
  svg.append(label);
}

function calculateArc() {
  const radius = Number($("#arcRadius").value);
  const angle = Number($("#arcAngle").value);
  const result = $("#arcResult");
  if (!(radius > 0)) {
    result.textContent = "Введите положительный радиус.";
    return;
  }
  const path = Math.PI * radius * angle / 180;
  const displacement = 2 * radius * Math.sin(angle * Math.PI / 360);
  result.innerHTML = `<strong>Ответ: l = ${format(path, 2)} м, s = ${format(displacement, 2)} м.</strong>
    <ol><li>Путь — доля α/360° от длины окружности 2πR: l = 2πR · α/360° = πRα/180° = 3,14 · ${format(radius)} · ${angle} / 180 = ${format(path, 2)} м.</li>
    <li>Перемещение — хорда между концами дуги. Радиусы к концам дуги и хорда образуют равнобедренный треугольник с углом α при центре; опустив высоту, получаем s = 2R·sin(α/2) = 2 · ${format(radius)} · sin ${format(angle / 2)}° = ${format(displacement, 2)} м.</li>
    <li>Сравнение: l / s = ${format(path / displacement, 2)}. Путь больше перемещения; при α = 180° получаем s = 2R, при α = 90° получаем s = R√2.</li></ol>`;
}

function initArcCalculator() {
  $("#arcAngle").addEventListener("input", () => { drawArc(); $("#arcResult").replaceChildren(); });
  $("#arcRadius").addEventListener("input", () => $("#arcResult").replaceChildren());
  $("#arcBtn").addEventListener("click", calculateArc);
  drawArc();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initExperiment();
  renderExamples();
  initArcCalculator();
  initTasks();
});
