"use strict";

const STORAGE_PREFIX = "grade9-circular-motion";

const examples = [
  {
    id: "wheel",
    level: "базовый уровень",
    title: "Колесо: период, частота, скорость, ускорение",
    text: "За 20 с колесо радиусом 0,3 м сделало 40 оборотов. Найди период, частоту, скорость точки обода и центростремительное ускорение. Принять π = 3,14.",
    steps: [
      { title: "Дано", body: "t = 20 с; N = 40; R = 0,3 м; π = 3,14. Все величины уже в СИ." },
      { title: "Период", body: "40 оборотов заняли 20 с, значит один оборот занимает в 40 раз меньше времени: T = t / N = 20 / 40 = 0,5 с." },
      { title: "Частота", body: "ν = 1 / T = 1 / 0,5 = 2 Гц. Проверка: N / t = 40 / 20 = 2 Гц." },
      { title: "Откуда формула скорости", body: "За один оборот точка проходит длину окружности 2πR, а время одного оборота — период T. Скорость — это путь, делённый на время: v = 2πR / T." },
      { title: "Скорость", body: "v = 2πR / T = 2 · 3,14 · 0,3 / 0,5 ≈ 3,77 м/с." },
      { title: "Откуда формула ускорения", body: "За малое время Δt тело проходит дугу vΔt, радиус поворачивается на угол φ = vΔt / R. Вектор скорости поворачивается на тот же угол, а модуль не меняется, поэтому Δv = vφ = v²Δt / R. Ускорение a = Δv / Δt = v² / R." },
      { title: "Ускорение", body: "a = v² / R = 3,77² / 0,3 ≈ 47 м/с². Проверка: 4π²R / T² = 4 · 3,14² · 0,3 / 0,5² ≈ 47 м/с²." }
    ],
    answer: "T = 0,5 с; ν = 2 Гц; v ≈ 3,8 м/с; a ≈ 47 м/с², направлено к центру."
  },
  {
    id: "car-turn",
    level: "средний уровень",
    title: "Автомобиль на повороте",
    text: "Автомобиль массой 1200 кг проходит закругление радиусом 60 м со скоростью 15 м/с. Найди центростремительное ускорение и силу, которая его создаёт. Что изменится, если скорость удвоить?",
    steps: [
      { title: "Ускорение", body: "a = v² / R = 15² / 60 = 225 / 60 = 3,75 м/с². Направлено к центру закругления." },
      { title: "Сила", body: "F = ma = 1200 · 3,75 = 4500 Н. На повороте её создаёт сила трения шин о дорогу, направленная к центру." },
      { title: "Удвоение скорости", body: "Ускорение и сила пропорциональны v². При 2v они вырастут в 4 раза: a = 15 м/с², F = 18 000 Н." },
      { title: "Вывод", body: "Если сила трения не может достичь нужного значения, автомобиль не удержится на дуге и начнёт скользить по касательной — произойдёт занос." }
    ],
    answer: "a = 3,75 м/с²; F = 4500 Н; при удвоении скорости a и F увеличатся в 4 раза."
  },
  {
    id: "rim-point",
    level: "средний уровень",
    title: "Точка на ободе диска",
    text: "Точка диска движется с угловой скоростью 10 рад/с на расстоянии 0,2 м от оси. Найди период, линейную скорость и центростремительное ускорение.",
    steps: [
      { title: "Что такое радиан", body: "1 радиан — угол, которому соответствует дуга длиной в радиус. Вся окружность содержит 2π таких дуг, поэтому полный оборот 360° = 2π рад. Угловая скорость 10 рад/с означает, что радиус за секунду поворачивается на 10 рад ≈ 573°." },
      { title: "Период", body: "За один период радиус поворачивается на 2π рад, а за секунду — на ω. Значит T = 2π / ω = 2 · 3,14 / 10 = 0,628 с." },
      { title: "Скорость", body: "Из v = 2πR / T = (2π / T) · R и ω = 2π / T получаем v = ωR = 10 · 0,2 = 2 м/с." },
      { title: "Ускорение", body: "Подставим v = ωR в a = v² / R: a = ω²R² / R = ω²R = 10² · 0,2 = 20 м/с²." },
      { title: "Проверка", body: "По другой формуле: a = v² / R = 2² / 0,2 = 20 м/с². Результаты совпали." }
    ],
    answer: "T ≈ 0,63 с; v = 2 м/с; a = 20 м/с²."
  },
  {
    id: "clock-hands",
    level: "повышенный уровень",
    title: "Стрелки часов",
    text: "Секундная стрелка часов имеет длину 3 см, минутная — 2,5 см. Во сколько раз скорость конца секундной стрелки больше скорости конца минутной?",
    steps: [
      { title: "Периоды", body: "Секундная стрелка делает оборот за T₁ = 60 с, минутная — за T₂ = 3600 с." },
      { title: "Скорости", body: "v₁ = 2π · 0,03 / 60 ≈ 3,1 · 10⁻³ м/с; v₂ = 2π · 0,025 / 3600 ≈ 4,4 · 10⁻⁵ м/с." },
      { title: "Отношение", body: "v₁ / v₂ = (0,03 / 60) / (0,025 / 3600) = 72." },
      { title: "Смысл", body: "Угловая скорость секундной стрелки больше в 60 раз, длина — в 1,2 раза. Поэтому линейная скорость больше в 60 · 1,2 = 72 раза." }
    ],
    answer: "скорость конца секундной стрелки больше в 72 раза."
  }
];

const tasks = [
  {
    id: "period",
    type: "период",
    title: "Период вращения колеса",
    text: "Колесо сделало 30 оборотов за 15 с. Найди период вращения в секундах.",
    placeholder: "с",
    hint: "Период — время одного оборота: T = t/N.",
    check: value => near(numberValue(value), 0.5),
    answerText: "T = 0,5 с.",
    solution: [
      "<b>Дано:</b> N = 30; t = 15 с.",
      "<b>Откуда формула.</b> 30 оборотов заняли 15 с. Один оборот занимает в 30 раз меньше времени, то есть T = t / N.",
      "<b>Решение.</b> T = 15 / 30 = 0,5 с.",
      "<b>Проверка:</b> за 0,5 с — один оборот, значит за 15 с получим 30 оборотов.",
      "<b>Ответ:</b> 0,5 с."
    ]
  },
  {
    id: "frequency",
    type: "перевод единиц",
    title: "Период по частоте",
    text: "Диск делает 90 оборотов в минуту. Найди период вращения в секундах. Ответ округли до сотых.",
    placeholder: "с",
    hint: "Сначала переведи частоту в герцы: ν = 90 / 60. Затем T = 1/ν.",
    check: value => near(numberValue(value), 0.67, .02),
    answerText: "T ≈ 0,67 с.",
    solution: [
      "<b>Переводим в СИ:</b> 90 об/мин = 90 / 60 = 1,5 Гц.",
      "<b>Период:</b> T = 1 / ν = 1 / 1,5 ≈ 0,67 с.",
      "<b>Ответ:</b> ≈ 0,67 с."
    ]
  },
  {
    id: "speed-rt",
    type: "линейная скорость",
    title: "Скорость точки на окружности",
    text: "Точка движется по окружности радиусом 0,5 м с периодом 2 с. Найди её скорость в м/с (π = 3,14).",
    placeholder: "м/с",
    hint: "За один оборот точка проходит 2πR. v = 2πR/T.",
    check: value => near(numberValue(value), 1.57),
    answerText: "v = 1,57 м/с.",
    solution: [
      "<b>Дано:</b> R = 0,5 м; T = 2 с.",
      "<b>Откуда формула.</b> За один оборот точка проходит длину окружности 2πR за время T. Скорость — путь, делённый на время: v = 2πR / T.",
      "<b>Решение.</b> v = 2 · 3,14 · 0,5 / 2 = 1,57 м/с.",
      "<b>Ответ:</b> 1,57 м/с."
    ]
  },
  {
    id: "omega",
    type: "угловая скорость",
    title: "Угловая скорость",
    text: "Найди угловую скорость точки при периоде вращения 2 с в рад/с (π = 3,14).",
    placeholder: "рад/с",
    hint: "ω = 2π / T.",
    check: value => near(numberValue(value), 3.14),
    answerText: "ω = 3,14 рад/с.",
    solution: [
      "<b>Напоминание о радиане.</b> 1 радиан — угол, которому соответствует дуга длиной в радиус. Вся окружность 2πR содержит 2π таких дуг, поэтому полный оборот 360° = 2π рад ≈ 6,28 рад (а 1 рад ≈ 57,3°).",
      "<b>Откуда формула.</b> За один период радиус поворачивается на полный угол 2π рад. Угловая скорость — угол, делённый на время: ω = 2π / T.",
      "<b>Решение.</b> ω = 2 · 3,14 / 2 = 3,14 рад/с.",
      "<b>Проверка:</b> для точки на расстоянии 0,5 м v = ωR = 3,14 · 0,5 = 1,57 м/с — совпадает с предыдущей задачей.",
      "<b>Ответ:</b> 3,14 рад/с."
    ]
  },
  {
    id: "v-omega",
    type: "связь v и ω",
    title: "Скорость через угловую",
    text: "Угловая скорость точки 4 рад/с, радиус окружности 0,5 м. Найди линейную скорость в м/с.",
    placeholder: "м/с",
    hint: "v = ωR.",
    check: value => near(numberValue(value), 2),
    answerText: "v = 2 м/с.",
    solution: [
      "<b>Откуда формула.</b> v = 2πR / T = (2π / T) · R, а 2π / T = ω, поэтому v = ωR.",
      "<b>Решение.</b> v = 4 · 0,5 = 2 м/с.",
      "<b>Ответ:</b> 2 м/с."
    ]
  },
  {
    id: "accel",
    type: "ускорение",
    title: "Центростремительное ускорение",
    text: "Тело движется по окружности радиусом 3 м со скоростью 6 м/с. Найди центростремительное ускорение в м/с².",
    placeholder: "м/с²",
    hint: "a = v² / R. Скорость нужно возвести в квадрат.",
    check: value => near(numberValue(value), 12),
    answerText: "a = 12 м/с².",
    solution: [
      "<b>Откуда формула.</b> За малое время Δt вектор скорости поворачивается на угол φ = vΔt / R, поэтому Δv = vφ = v²Δt / R, а a = Δv / Δt = v² / R.",
      "<b>Решение.</b> a = 6² / 3 = 36 / 3 = 12 м/с².",
      "<b>Частая ошибка:</b> писать a = v / R. Тогда единица получилась бы 1/с, а не м/с².",
      "<b>Ответ:</b> 12 м/с²."
    ]
  },
  {
    id: "direction",
    type: "направление вектора",
    title: "Куда направлено ускорение",
    text: "Куда направлено центростремительное ускорение при равномерном движении по окружности?",
    placeholder: "ответ словами",
    hint: "Ускорение поворачивает вектор скорости внутрь окружности.",
    check: value => /(к|в)\s*центр/.test(words(value)) && !/от\s*центр/.test(words(value)),
    answerText: "К центру окружности, перпендикулярно скорости.",
    solution: [
      "<b>Разбор.</b> Вектор скорости поворачивается. Изменение скорости за малое время направлено внутрь окружности, поэтому ускорение направлено по радиусу к центру.",
      "Скорость направлена по касательной, поэтому скорость и ускорение перпендикулярны.",
      "<b>Ответ:</b> к центру окружности."
    ]
  },
  {
    id: "second-hand",
    type: "малые скорости",
    title: "Секундная стрелка",
    text: "Конец секундной стрелки часов находится на расстоянии 5 см от оси. Найди его скорость в мм/с (π = 3,14).",
    placeholder: "мм/с",
    hint: "T = 60 с, R = 0,05 м = 50 мм. v = 2πR/T.",
    check: value => near(numberValue(value), 5.23, .02),
    answerText: "v ≈ 5,2 мм/с.",
    solution: [
      "<b>Дано:</b> T = 60 с; R = 5 см = 50 мм.",
      "<b>Откуда формула.</b> За оборот конец стрелки проходит 2πR за время T, поэтому v = 2πR / T.",
      "<b>Решение.</b> v = 2 · 3,14 · 50 / 60 ≈ 5,23 мм/с.",
      "<b>Проверка в метрах:</b> 2 · 3,14 · 0,05 / 60 ≈ 0,0052 м/с = 5,2 мм/с.",
      "<b>Ответ:</b> ≈ 5,2 мм/с."
    ]
  },
  {
    id: "car-accel",
    type: "ускорение на повороте",
    title: "Автомобиль на закруглении",
    text: "Автомобиль едет по закруглению радиусом 50 м со скоростью 10 м/с. Найди центростремительное ускорение в м/с².",
    placeholder: "м/с²",
    hint: "a = v² / R.",
    check: value => near(numberValue(value), 2),
    answerText: "a = 2 м/с².",
    solution: [
      "<b>Решение.</b> a = v² / R = 10² / 50 = 100 / 50 = 2 м/с².",
      "<b>Ответ:</b> 2 м/с², направлено к центру закругления."
    ]
  },
  {
    id: "car-force",
    type: "сила к центру",
    title: "Сила на повороте",
    text: "Масса автомобиля из предыдущей задачи 1000 кг. Какая сила, направленная к центру, удерживает его на дуге? Ответ в ньютонах.",
    placeholder: "Н",
    hint: "По второму закону Ньютона F = ma.",
    check: value => near(numberValue(value), 2000),
    answerText: "F = 2000 Н.",
    solution: [
      "<b>Разбор.</b> Центростремительное ускорение сообщает равнодействующая сила: F = ma.",
      "F = 1000 · 2 = 2000 Н. На практике её создаёт сила трения шин о дорогу.",
      "<b>Ответ:</b> 2000 Н."
    ]
  },
  {
    id: "radius-double",
    type: "качественная задача",
    title: "Удвоили радиус",
    text: "Тело движется по окружности с прежней скоростью, а радиус окружности увеличили в 2 раза. Как изменится центростремительное ускорение?",
    placeholder: "ответ словами",
    hint: "Ускорение обратно пропорционально радиусу: a = v²/R.",
    check: value => /(уменьш|меньш|убыв|упад)/.test(words(value)) && /(2|дв|пол)/.test(words(value)),
    answerText: "Ускорение уменьшится в 2 раза.",
    solution: [
      "<b>Разбор.</b> a = v² / R. При постоянной скорости и R₂ = 2R₁ получаем a₂ = v² / (2R₁) = a₁ / 2.",
      "<b>Ответ:</b> уменьшится в 2 раза."
    ]
  },
  {
    id: "satellite",
    type: "повышенный уровень",
    title: "Спутник на орбите",
    text: "Спутник движется по круговой орбите радиусом 7000 км со скоростью 7,5 км/с. Найди центростремительное ускорение в м/с². Сначала переведи всё в СИ.",
    placeholder: "м/с²",
    hint: "R = 7 000 000 м, v = 7500 м/с. Затем a = v²/R.",
    check: value => near(numberValue(value), 8.04, .03),
    answerText: "a ≈ 8 м/с².",
    solution: [
      "<b>СИ:</b> R = 7000 км = 7 · 10⁶ м; v = 7,5 км/с = 7500 м/с.",
      "<b>Решение.</b> a = v² / R = 7500² / (7 · 10⁶) = 56 250 000 / 7 000 000 ≈ 8,0 м/с².",
      "<b>Смысл:</b> на такой высоте ускорение свободного падения почти как у поверхности Земли. Спутник непрерывно «падает» к Земле, но из-за скорости постоянно промахивается мимо неё.",
      "<b>Ответ:</b> ≈ 8 м/с²."
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

// ===== Эксперимент: вращение по окружности =====
const PI = 3.14;
const CENTER = { x: 280, y: 200 };
const PX_PER_M = 38;
const NS = "http://www.w3.org/2000/svg";

const lab = {
  angle: 0,
  lastFrame: 0,
  released: false,
  revealed: false,
  flight: null,
  trail: []
};

function readParams() {
  const radius = Number($("#radiusInput").value);
  const period = Number($("#periodInput").value);
  const nu = 1 / period;
  const omega = 2 * PI / period;
  const speed = 2 * PI * radius / period;
  const accel = speed * speed / radius;
  return { radius, period, nu, omega, speed, accel };
}

function setArrow(line, label, from, ux, uy, length) {
  line.setAttribute("x1", from.x);
  line.setAttribute("y1", from.y);
  line.setAttribute("x2", from.x + ux * length);
  line.setAttribute("y2", from.y + uy * length);
  label.setAttribute("x", from.x + ux * (length + 18) - 4);
  label.setAttribute("y", from.y + uy * (length + 18) + 5);
}

function drawScene() {
  const p = readParams();
  const radiusPx = p.radius * PX_PER_M;
  const orbit = $("#orbit");
  orbit.setAttribute("r", radiusPx);

  const phi = lab.angle;
  const position = lab.released && lab.flight
    ? { x: lab.flight.x, y: lab.flight.y }
    : { x: CENTER.x + radiusPx * Math.cos(phi), y: CENTER.y - radiusPx * Math.sin(phi) };
  $("#ball").setAttribute("cx", position.x);
  $("#ball").setAttribute("cy", position.y);

  const radiusLine = $("#radiusLine");
  radiusLine.setAttribute("x2", position.x);
  radiusLine.setAttribute("y2", position.y);
  radiusLine.setAttribute("visibility", lab.released ? "hidden" : "visible");
  $("#labelR").setAttribute("x", CENTER.x + (position.x - CENTER.x) / 2 + 10 * Math.sin(phi) - 4);
  $("#labelR").setAttribute("y", CENTER.y + (position.y - CENTER.y) / 2 + 10 * Math.cos(phi) + 5);
  $("#labelR").setAttribute("visibility", lab.released ? "hidden" : "visible");

  // Направление скорости — по касательной (против часовой стрелки), ускорения — к центру.
  const vDir = lab.released && lab.flight ? lab.flight.dir : { x: -Math.sin(phi), y: -Math.cos(phi) };
  const vLen = Math.min(120, p.speed * 20);
  setArrow($("#vecV"), $("#labelV"), position, vDir.x, vDir.y, vLen);

  const vecA = $("#vecA");
  const labelA = $("#labelA");
  if (lab.released) {
    vecA.setAttribute("visibility", "hidden");
    labelA.setAttribute("visibility", "hidden");
  } else {
    const aLen = Math.max(30, Math.min(radiusPx - 22, 120, p.accel * 10));
    setArrow(vecA, labelA, position, -Math.cos(phi), Math.sin(phi), aLen);
    vecA.setAttribute("visibility", "visible");
    labelA.setAttribute("visibility", "visible");
  }

  $("#flight").setAttribute("d", lab.trail.length > 1
    ? lab.trail.map((q, index) => `${index === 0 ? "M" : "L"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ")
    : "");

  $("#radiusLabel").textContent = format(p.radius, 1);
  $("#periodLabel").textContent = format(p.period, 1);
  $("#tMeter").textContent = `${format(p.period, 1)} с`;
  // Расчётные величины скрыты, пока ученик не проверил прогноз: иначе нечего считать.
  $("#nuMeter").textContent = lab.revealed ? `${format(p.nu, 2)} Гц` : "?";
  $("#omegaMeter").textContent = lab.revealed ? `${format(p.omega, 2)} рад/с` : "?";
  $("#vMeter").textContent = lab.revealed ? `${format(p.speed, 2)} м/с` : "?";
  $("#aMeter").textContent = lab.revealed ? `${format(p.accel, 2)} м/с²` : "?";
  $("#turnsMeter").textContent = format(lab.angle / (2 * Math.PI), 2);
}

function resetExperiment(message) {
  cancelAnimationFrame(state.animationId);
  state.running = false;
  lab.angle = 0;
  lab.released = false;
  lab.revealed = false;
  lab.flight = null;
  lab.trail = [];
  $("#runBtn").textContent = "Запустить";
  $("#releaseBtn").disabled = false;
  drawScene();
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = message || "Сосчитай v и a сам, запиши прогноз и нажми «Проверить прогноз»: значения на табло откроются после верного ответа.";
  $("#verdict").textContent = "Постоянен только модуль скорости. Вектор скорости поворачивается, поэтому есть ускорение к центру.";
}

function animate() {
  const p = readParams();
  const tempo = Number($("#tempoSelect").value);
  const frame = now => {
    const dt = Math.min(.05, (now - lab.lastFrame) / 1000) * tempo;
    lab.lastFrame = now;
    if (lab.released && lab.flight) {
      lab.flight.x += lab.flight.dir.x * p.speed * PX_PER_M * dt;
      lab.flight.y += lab.flight.dir.y * p.speed * PX_PER_M * dt;
      lab.trail.push({ x: lab.flight.x, y: lab.flight.y });
      drawScene();
      if (lab.flight.x < -20 || lab.flight.x > 580 || lab.flight.y < -20 || lab.flight.y > 420) {
        state.running = false;
        $("#runBtn").textContent = "Запустить";
        $("#labFeedback").className = "feedback success";
        $("#labFeedback").textContent = "Тело улетело по касательной с прежней по модулю скоростью. Нить создавала силу к центру — без неё траектория стала прямой.";
        return;
      }
    } else {
      lab.angle += p.omega * dt;
      drawScene();
    }
    state.animationId = requestAnimationFrame(frame);
  };
  lab.lastFrame = performance.now();
  state.animationId = requestAnimationFrame(frame);
}

function toggleRun() {
  if (state.running) {
    cancelAnimationFrame(state.animationId);
    state.running = false;
    $("#runBtn").textContent = "Продолжить";
    return;
  }
  if (lab.released) resetExperiment();
  state.running = true;
  $("#runBtn").textContent = "Пауза";
  animate();
}

function releaseString() {
  const p = readParams();
  if (lab.released) return;
  if (!state.running) {
    state.running = true;
    $("#runBtn").textContent = "Пауза";
    animate();
  }
  const phi = lab.angle;
  const radiusPx = p.radius * PX_PER_M;
  lab.released = true;
  lab.flight = {
    x: CENTER.x + radiusPx * Math.cos(phi),
    y: CENTER.y - radiusPx * Math.sin(phi),
    dir: { x: -Math.sin(phi), y: -Math.cos(phi) }
  };
  lab.trail = [{ x: lab.flight.x, y: lab.flight.y }];
  $("#releaseBtn").disabled = true;
  $("#verdict").textContent = "Нить оборвана: центростремительной силы нет, ускорение равно нулю, тело движется по касательной.";
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = "Наблюдай: скорость направлена по касательной в точке, где нить оборвалась.";
}

function checkPrediction() {
  const p = readParams();
  const predictedSpeed = numberValue($("#predSpeed").value);
  const predictedAccel = numberValue($("#predAccel").value);
  const feedback = $("#labFeedback");
  if (!Number.isFinite(predictedSpeed) || !Number.isFinite(predictedAccel)) {
    feedback.className = "feedback error";
    feedback.textContent = "Сначала сосчитай и запиши оба прогноза: скорость v и ускорение a.";
    return;
  }
  const speedOk = near(predictedSpeed, p.speed, .05);
  const accelOk = near(predictedAccel, p.accel, .05);
  if (speedOk && accelOk) {
    feedback.className = "feedback success";
    lab.revealed = true;
    drawScene();
    feedback.textContent = `Прогноз верный: v = 2πR/T = ${format(p.speed, 2)} м/с, a = v²/R = ${format(p.accel, 2)} м/с². Значения на табло открыты.`;
    return;
  }
  const parts = [];
  if (!speedOk) parts.push("скорость: вспомни, что за один оборот тело проходит 2πR за время T, v = 2πR/T");
  if (!accelOk) parts.push("ускорение: a = v²/R, скорость нужно возвести в квадрат (используй свою верную скорость)");
  feedback.className = "feedback error";
  feedback.textContent = `Пока не сходится — ${parts.join("; ")}. Исправь прогноз и проверь ещё раз; если застрял, нажми «Показать значения».`;
}

function initExperiment() {
  ["radiusInput", "periodInput"].forEach(id => {
    $(`#${id}`).addEventListener("input", () => resetExperiment("Параметры изменились. Сделай новый прогноз."));
  });
  $("#runBtn").addEventListener("click", toggleRun);
  $("#resetBtn").addEventListener("click", () => resetExperiment());
  $("#releaseBtn").addEventListener("click", releaseString);
  $("#checkBtn").addEventListener("click", checkPrediction);
  $("#revealBtn").addEventListener("click", () => {
    lab.revealed = true;
    drawScene();
    $("#labFeedback").className = "feedback";
    $("#labFeedback").textContent = "Значения открыты. Разбери, как они получаются, и реши заново с другими R и T.";
  });
  resetExperiment();
}

// ===== Калькулятор =====
function setCalcMode() {
  const mode = $("#calcMode").value;
  const thirdVisible = mode === "nt";
  $("#calcYLabel").hidden = !thirdVisible;
  $("#calcY").hidden = !thirdVisible;
  if (mode === "rt") {
    $("#calcXLabel").textContent = "Период T, с";
    $("#calcX").value = "2";
  } else if (mode === "rv") {
    $("#calcXLabel").textContent = "Скорость v, м/с";
    $("#calcX").value = "3";
  } else {
    $("#calcXLabel").textContent = "Число оборотов N";
    $("#calcX").value = "40";
    $("#calcYLabel").textContent = "Время t, с";
    $("#calcY").value = "20";
  }
  $("#calculationResult").replaceChildren();
}

function calculate() {
  const mode = $("#calcMode").value;
  const R = Number($("#calcR").value);
  const x = Number($("#calcX").value);
  const y = Number($("#calcY").value);
  const result = $("#calculationResult");
  if (!(R > 0) || !(x > 0) || (mode === "nt" && !(y > 0))) {
    result.textContent = "Введите положительные значения.";
    return;
  }
  let T;
  let v;
  const lines = [];
  if (mode === "rt") {
    T = x;
    v = 2 * PI * R / T;
    lines.push(`Период известен: T = ${format(T)} с.`);
  } else if (mode === "rv") {
    v = x;
    T = 2 * PI * R / v;
    lines.push(`Период: T = 2πR/v = 2 · 3,14 · ${format(R)} / ${format(v)} = ${format(T, 3)} с.`);
  } else {
    T = y / x;
    v = 2 * PI * R / T;
    lines.push(`Период: T = t/N = ${format(y)} / ${format(x)} = ${format(T, 3)} с.`);
  }
  const nu = 1 / T;
  const omega = 2 * PI / T;
  const a = v * v / R;
  if (mode !== "rv") lines.push(`Скорость: v = 2πR/T = 2 · 3,14 · ${format(R)} / ${format(T, 3)} = ${format(v, 3)} м/с.`);
  lines.push(`Частота: ν = 1/T = 1 / ${format(T, 3)} = ${format(nu, 3)} Гц.`);
  lines.push(`Угловая скорость: ω = 2π/T = 2 · 3,14 / ${format(T, 3)} = ${format(omega, 3)} рад/с. Проверка: ωR = ${format(omega * R, 3)} м/с.`);
  lines.push(`Ускорение: a = v²/R = ${format(v, 3)}² / ${format(R)} = ${format(a, 3)} м/с², направлено к центру окружности.`);
  result.innerHTML = `<strong>Ответ: T = ${format(T, 3)} с; ν = ${format(nu, 3)} Гц; ω = ${format(omega, 3)} рад/с; v = ${format(v, 3)} м/с; a = ${format(a, 3)} м/с².</strong>
    <ol>${lines.map(line => `<li>${line}</li>`).join("")}</ol>`;
}

function initCalculator() {
  $("#calcMode").addEventListener("change", setCalcMode);
  $("#calculateBtn").addEventListener("click", calculate);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initExperiment();
  renderExamples();
  initCalculator();
  initTasks();
});
