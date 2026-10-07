"use strict";

const STORAGE_PREFIX = "grade9-table-paths";

// Неориентированные графы с весами. Рёбра: [A, B, вес]. Координаты вершин — проценты рисунка.
const GRAPHS = {
  t5: {
    name: "Таблица 1 (4 пункта)",
    nodes: { A: [10, 50], B: [38, 12], C: [62, 88], D: [90, 50] },
    edges: [["A", "B", 1], ["A", "C", 4], ["A", "D", 7], ["B", "C", 2], ["B", "D", 5], ["C", "D", 3]]
  },
  p4: {
    name: "Таблица 2 (5 пунктов)",
    nodes: { A: [8, 50], B: [35, 12], C: [42, 62], D: [65, 90], E: [92, 45] },
    edges: [["A", "B", 2], ["A", "C", 5], ["A", "D", 6], ["B", "C", 1], ["B", "E", 4], ["C", "D", 3], ["C", "E", 7], ["D", "E", 2]]
  },
  p3: {
    name: "Таблица 3 (6 пунктов)",
    nodes: { A: [8, 55], B: [30, 12], C: [56, 12], D: [46, 80], E: [80, 36], F: [92, 84] },
    edges: [["A", "B", 2], ["A", "D", 8], ["B", "C", 4], ["B", "D", 5], ["C", "D", 1], ["C", "E", 3], ["D", "E", 7], ["D", "F", 6], ["E", "F", 2]]
  },
  t6: {
    name: "Таблица 4 (6 пунктов)",
    nodes: { A: [8, 50], B: [30, 15], C: [30, 85], D: [58, 50], E: [78, 15], F: [92, 88] },
    edges: [["A", "B", 2], ["A", "C", 3], ["A", "D", 7], ["A", "F", 15], ["B", "D", 3], ["C", "D", 1], ["D", "E", 2], ["D", "F", 11], ["E", "F", 3]]
  },
  q2: {
    name: "Таблица 5 (5 пунктов)",
    nodes: { A: [8, 50], B: [35, 15], C: [35, 85], D: [65, 30], E: [92, 70] },
    edges: [["A", "B", 4], ["A", "C", 2], ["B", "C", 1], ["B", "D", 5], ["C", "D", 8], ["C", "E", 10], ["D", "E", 2]]
  },
  q3: {
    name: "Таблица 6 (6 пунктов)",
    nodes: { A: [8, 50], B: [30, 12], C: [36, 60], D: [66, 15], E: [92, 60], F: [48, 92] },
    edges: [["A", "B", 7], ["A", "C", 9], ["A", "F", 14], ["B", "C", 10], ["B", "D", 15], ["C", "D", 11], ["C", "F", 2], ["D", "E", 6], ["E", "F", 9]]
  },
  t7: {
    name: "Таблица 7 (4 пункта)",
    nodes: { A: [10, 50], B: [40, 15], C: [40, 85], D: [90, 50] },
    edges: [["A", "B", 3], ["A", "C", 5], ["B", "C", 2], ["B", "D", 4], ["C", "D", 6]]
  }
};
const LAB_GRAPHS = ["p4", "p3", "t6", "q3", "q2"];

const examples = [
  {
    id: "read",
    level: "базовый уровень",
    title: "Читаем таблицу и записываем дороги",
    graph: "t5",
    text: "Таблица 1 дана выше. Выпиши все дороги и скажи, сколько их. Есть ли дорога между B и D?",
    steps: [
      { title: "Как читать клетку", body: "Строка — один пункт, столбец — другой. Число на пересечении — длина дороги между ними. Пустая клетка — дороги нет." },
      { title: "Читаем выше диагонали", body: "Таблица зеркальна: клетка B–D и клетка D–B содержат одно число. Чтобы не записать дорогу дважды, читаем только клетки выше диагонали." },
      { title: "Строка A", body: "A–B = 1, A–C = 4, A–D = 7." },
      { title: "Строки B и C", body: "B–C = 2, B–D = 5; C–D = 3." },
      { title: "Итог", body: "Дорог шесть: A–B 1, A–C 4, A–D 7, B–C 2, B–D 5, C–D 3. Дорога между B и D есть, её длина 5." }
    ],
    answer: "6 дорог; B–D = 5."
  },
  {
    id: "length-count",
    level: "базовый уровень",
    title: "Длина пути и количество путей — разные вопросы",
    graph: "t5",
    text: "В таблице 1: а) найди длину пути A→B→D; б) найди количество различных путей из A в D (вершины не повторяются).",
    steps: [
      { title: "Вопрос а: длина", body: "Длина пути — сумма весов. A–B = 1, B–D = 5, поэтому длина A→B→D равна 1 + 5 = 6." },
      { title: "Вопрос б: количество", body: "Здесь веса не нужны: считаем, сколько существует разных путей. Перебираем по порядку." },
      { title: "Прямой путь", body: "A→D — один путь." },
      { title: "Через одну вершину", body: "A→B→D и A→C→D — ещё два пути." },
      { title: "Через две вершины", body: "A→B→C→D и A→C→B→D — ещё два пути." },
      { title: "Итог", body: "Всего 1 + 2 + 2 = 5 путей. Число 6 из пункта а — длина одного пути; число 5 из пункта б — количество путей. Это разные величины." }
    ],
    answer: "а) длина 6; б) 5 путей."
  },
  {
    id: "shortest",
    level: "средний уровень",
    title: "Кратчайший путь подписями расстояний",
    graph: "t6",
    text: "По таблице 4 найди длину кратчайшего пути из A в F. Каждый пункт можно посетить один раз.",
    steps: [
      { title: "Старт", body: "d(A) = 0." },
      { title: "Ближайшие вершины", body: "Соседи A: B (2), C (3), D (7), F (15). Подписываем в порядке возрастания: d(B) = 2, d(C) = 3." },
      { title: "Вершина D", body: "До D можно добраться так: из A — 7, из B — 2 + 3 = 5, из C — 3 + 1 = 4. Минимум 4, поэтому d(D) = 4." },
      { title: "Вершина E", body: "E соединена с D: d(E) = 4 + 2 = 6." },
      { title: "Вершина F", body: "Из A — 15; из D — 4 + 11 = 15; из E — 6 + 3 = 9. Минимум 9, d(F) = 9." },
      { title: "Путь", body: "A→C→D→E→F: 3 + 1 + 2 + 3 = 9." }
    ],
    answer: "9 (путь A–C–D–E–F)."
  },
  {
    id: "banned",
    level: "повышенный уровень",
    title: "Кратчайший путь не через запрещённый пункт",
    graph: "p4",
    text: "По таблице 2 найди длину кратчайшего пути из A в E, не проходящего через B. Сравни с кратчайшим путём без запрета.",
    steps: [
      { title: "Путь без запрета", body: "Для сравнения: A→B→E = 2 + 4 = 6. Это самый короткий путь вообще, но он проходит через B." },
      { title: "Вычёркиваем B", body: "Убираем B и все дороги, в которых она участвует: A–B, B–C, B–E. Остаются A–C 5, A–D 6, C–D 3, C–E 7, D–E 2." },
      { title: "Пути в остатке", body: "A→D→E = 6 + 2 = 8; A→C→E = 5 + 7 = 12; A→C→D→E = 5 + 3 + 2 = 10; A→D→C→E = 6 + 3 + 7 = 16." },
      { title: "Минимум", body: "Наименьшая длина — 8 (путь A→D→E)." },
      { title: "Вывод", body: "Если запрет не учесть, получится 6 — ответ другой задачи. Запрещённый пункт нужно вычеркнуть до расчёта." }
    ],
    answer: "8; без запрета было бы 6."
  }
];

const tasks = [
  {
    id: "read-cell", type: "чтение таблицы", title: "Клетка таблицы", graph: "p3",
    text: "Таблица 3. Чему равна длина дороги между B и D?",
    placeholder: "длина",
    hint: "Найди строку B и столбец D: число стоит на их пересечении. Проверь по симметричной клетке (строка D, столбец B).",
    check: v => near(numberValue(v), 5, 0),
    answerText: "5.",
    solution: ["<b>Разбор.</b> Строка B, столбец D: 5. Симметричная клетка (строка D, столбец B) тоже 5.", "<b>Ответ:</b> 5."]
  },
  {
    id: "no-road", type: "чтение таблицы", title: "Пустая клетка", graph: "p3",
    text: "Таблица 3. Есть ли прямая дорога между A и C? Ответь «да» или «нет».",
    placeholder: "да или нет",
    hint: "Найди клетку на пересечении строки A и столбца C. Пустая клетка означает, что дороги нет.",
    check: v => /^\s*нет|не\s*т/.test(words(v)),
    answerText: "Нет.",
    solution: ["<b>Разбор.</b> Клетка A–C пустая, а значит прямой дороги нет. Добраться из A в C можно только через другие пункты (например, A→B→C).", "<b>Ответ:</b> нет."]
  },
  {
    id: "count-edges", type: "чтение таблицы", title: "Сколько дорог", graph: "t5",
    text: "Таблица 1 (пункты A, B, C, D). Сколько всего дорог в графе?",
    placeholder: "число дорог",
    hint: "Считай только клетки выше диагонали, чтобы не посчитать одну дорогу дважды.",
    check: v => near(numberValue(v), 6, 0),
    answerText: "6 дорог.",
    solution: ["<b>Разбор.</b> Выше диагонали: A–B, A–C, A–D, B–C, B–D, C–D — всего 6 клеток с числами.", "<b>Ответ:</b> 6."]
  },
  {
    id: "length", type: "длина пути", title: "Длина пути A→B→D", graph: "t5",
    text: "Таблица 1. Найди длину пути A→B→D.",
    placeholder: "длина",
    hint: "Длина пути — сумма весов его рёбер: A–B и B–D.",
    check: v => near(numberValue(v), 6, 0),
    answerText: "6.",
    solution: ["<b>Решение.</b> A–B = 1, B–D = 5. Длина пути 1 + 5 = 6.", "<b>Заметь:</b> это длина одного пути, а не количество путей.", "<b>Ответ:</b> 6."]
  },
  {
    id: "count-all", type: "количество путей", title: "Сколько путей из A в D", graph: "t5",
    text: "Таблица 1. Найди количество различных путей из A в D. Вершины в пути не повторяются, веса не нужны.",
    placeholder: "число путей",
    hint: "Перебирай по порядку: прямой путь, через одну вершину, через две вершины.",
    check: v => near(numberValue(v), 5, 0),
    answerText: "5 путей.",
    solution: ["<b>Перебор:</b> A→D; A→B→D; A→C→D; A→B→C→D; A→C→B→D.", "<b>Заметь:</b> веса не складывали — вопрос про количество.", "<b>Ответ:</b> 5."]
  },
  {
    id: "count-no-c", type: "количество, не через пункт", title: "Не через C", graph: "t5",
    text: "Таблица 1. Найди количество различных путей из A в D, которые не проходят через C (пути ненулевой длины).",
    placeholder: "число путей",
    hint: "Вычеркни C и её дороги, затем перебери пути в остатке.",
    check: v => near(numberValue(v), 2, 0),
    answerText: "2 пути.",
    solution: ["<b>Разбор.</b> Без C остаются дороги A–B, A–D, B–D. Пути из A в D: A→D и A→B→D.", "<b>Частая ошибка:</b> сложить веса пути A→B→D (1 + 5 = 6) и написать 6, а ещё пропустить прямой путь A→D.", "<b>Ответ:</b> 2."]
  },
  {
    id: "count-no-b", type: "количество, не через пункт", title: "Не через B", graph: "t5",
    text: "Таблица 1. Найди количество различных путей из A в D, которые не проходят через B.",
    placeholder: "число путей",
    hint: "Вычеркни B. Остаются A, C, D и дороги между ними.",
    check: v => near(numberValue(v), 2, 0),
    answerText: "2 пути.",
    solution: ["<b>Разбор.</b> Без B остаются дороги A–C, A–D, C–D. Пути: A→D и A→C→D.", "<b>Ответ:</b> 2."]
  },
  {
    id: "shortest-plain", type: "кратчайший путь", title: "Без условий", graph: "p4",
    text: "Таблица 2. Найди длину кратчайшего пути из A в E.",
    placeholder: "длина",
    hint: "Выпиши несколько путей и сложи веса: A→B→E, A→D→E, A→B→C→D→E.",
    check: v => near(numberValue(v), 6, 0),
    answerText: "6.",
    solution: ["<b>Пути:</b> A→B→E = 2 + 4 = 6; A→D→E = 6 + 2 = 8; A→B→C→D→E = 2 + 1 + 3 + 2 = 8; A→C→E = 12.", "<b>Ответ:</b> 6."]
  },
  {
    id: "shortest-t6", type: "кратчайший путь", title: "Шесть пунктов", graph: "t6",
    text: "Таблица 4. Найди длину кратчайшего пути из A в F. Каждый пункт можно посетить один раз.",
    placeholder: "длина",
    hint: "Подпиши вершины расстояниями от A: d(B) = 2, d(C) = 3, затем D, E, F. Для D выбери минимум по трём соседям.",
    check: v => near(numberValue(v), 9, 0),
    answerText: "9.",
    solution: ["<b>Подписи:</b> d(A) = 0; d(B) = 2; d(C) = 3; d(D) = min(7, 2 + 3, 3 + 1) = 4; d(E) = 4 + 2 = 6; d(F) = min(15, 4 + 11, 6 + 3) = 9.", "<b>Путь:</b> A→C→D→E→F.", "<b>Ответ:</b> 9."]
  },
  {
    id: "via-c", type: "через пункт", title: "Через обязательный пункт C", graph: "p3",
    text: "Таблица 3. Найди длину кратчайшего пути из A в F, проходящего через C.",
    placeholder: "длина",
    hint: "Найди отдельно кратчайший путь A→C и кратчайший путь C→F, затем сложи.",
    check: v => near(numberValue(v), 11, 0),
    answerText: "11.",
    solution: ["<b>A→C:</b> A→B→C = 2 + 4 = 6 (через D: 8 + 1 = 9 — длиннее).", "<b>C→F:</b> C→E→F = 3 + 2 = 5 (через D: 1 + 6 = 7 — длиннее).", "<b>Всего:</b> 6 + 5 = 11.", "<b>Ответ:</b> 11."]
  },
  {
    id: "not-b", type: "не через пункт", title: "Не через B", graph: "p4",
    text: "Таблица 2. Найди длину кратчайшего пути из A в E, не проходящего через B.",
    placeholder: "длина",
    hint: "Вычеркни B и её дороги, затем найди кратчайший путь в остатке.",
    check: v => near(numberValue(v), 8, 0),
    answerText: "8.",
    solution: ["<b>Без B:</b> остаются A–C 5, A–D 6, C–D 3, C–E 7, D–E 2.", "<b>Пути:</b> A→D→E = 8; A→C→D→E = 10; A→C→E = 12; A→D→C→E = 16.", "<b>Заметь:</b> 6 — длина A→B→E, но она проходит через запрещённую B.", "<b>Ответ:</b> 8."]
  },
  {
    id: "not-c-q2", type: "не через пункт", title: "Не через C", graph: "q2",
    text: "Таблица 5. Найди длину кратчайшего пути из A в E, не проходящего через C.",
    placeholder: "длина",
    hint: "Без C остаются дороги A–B, B–D, D–E.",
    check: v => near(numberValue(v), 11, 0),
    answerText: "11.",
    solution: ["<b>Без C:</b> A–B 4, B–D 5, D–E 2. Единственный путь A→B→D→E.", "<b>Длина:</b> 4 + 5 + 2 = 11.", "<b>Ответ:</b> 11."]
  },
  {
    id: "via-d", type: "через пункт", title: "Через D", graph: "q3",
    text: "Таблица 6. Найди длину кратчайшего пути из A в E, проходящего через D.",
    placeholder: "длина",
    hint: "Найди A→D и D→E по отдельности и сложи. Для A→D сравни A→C→D, A→B→D, A→F...",
    check: v => near(numberValue(v), 26, 0),
    answerText: "26.",
    solution: ["<b>A→D:</b> A→C→D = 9 + 11 = 20; A→B→D = 7 + 15 = 22; A→B→C→D = 7 + 10 + 11 = 28. Минимум 20.", "<b>D→E:</b> D–E = 6.", "<b>Всего:</b> 20 + 6 = 26.", "<b>Ответ:</b> 26."]
  },
  {
    id: "not-c-q3", type: "не через пункт", title: "Не через C", graph: "q3",
    text: "Таблица 6. Найди длину кратчайшего пути из A в E, не проходящего через C.",
    placeholder: "длина",
    hint: "Без C остаются дороги A–B, A–F, B–D, D–E, E–F.",
    check: v => near(numberValue(v), 23, 0),
    answerText: "23.",
    solution: ["<b>Без C:</b> A–B 7, A–F 14, B–D 15, D–E 6, E–F 9.", "<b>Пути:</b> A→F→E = 14 + 9 = 23; A→B→D→E = 7 + 15 + 6 = 28.", "<b>Ответ:</b> 23."]
  },
  {
    id: "count-t7", type: "количество, не через пункт", title: "Количество путей с запретом", graph: "t7",
    text: "Таблица 7. Найди количество различных путей из A в D, которые не проходят через C.",
    placeholder: "число путей",
    hint: "Без C остаются дороги A–B, B–D. Веса не нужны.",
    check: v => near(numberValue(v), 1, 0),
    answerText: "1 путь.",
    solution: ["<b>Без C:</b> A–B и B–D. Единственный путь A→B→D.", "<b>Для сравнения:</b> всего путей из A в D четыре: A→B→D, A→C→D, A→B→C→D, A→C→B→D.", "<b>Ответ:</b> 1."]
  },
  {
    id: "misread", type: "исправь ошибку", title: "Не та клетка", graph: "p4",
    text: "Таблица 2. Ученик в строке A и столбце C прочитал число 1 и записал «A→C = 1». Найди ошибку: какая в действительности длина дороги между A и C?",
    placeholder: "длина",
    hint: "Найди клетку на пересечении строки A и столбца C. Число 1 стоит в другой клетке.",
    check: v => near(numberValue(v), 5, 0),
    answerText: "5.",
    solution: ["<b>Разбор.</b> Строка A, столбец C: 5. Число 1 стоит в клетке B–C — ученик взял число из соседней строки.", "<b>Совет:</b> проверь по симметричной клетке: строка C, столбец A тоже 5.", "<b>Ответ:</b> 5."]
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


// ===== Работа с графами =====
const VIEW = { w: 560, h: 300, padX: 40, padY: 36, r: 20 };

function ids(graph) { return Object.keys(graph.nodes); }

function nodeXY(graph, id) {
  const [px, py] = graph.nodes[id];
  return { x: VIEW.padX + (VIEW.w - 2 * VIEW.padX) * px / 100, y: VIEW.padY + (VIEW.h - 2 * VIEW.padY) * py / 100 };
}

function neighbours(graph, id, banned) {
  const result = [];
  graph.edges.forEach(([a, b, w]) => {
    if (a === id && b !== banned) result.push([b, w]);
    if (b === id && a !== banned) result.push([a, w]);
  });
  return result;
}

function edgeWeight(graph, a, b) {
  const edge = graph.edges.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return edge ? edge[2] : null;
}

// Кратчайшие расстояния от source; запрещённая вершина вычёркивается из графа.
function distances(graph, source, banned) {
  const dist = { [source]: 0 };
  const done = new Set();
  for (;;) {
    let current = null;
    Object.keys(dist).forEach(id => {
      if (!done.has(id) && (current === null || dist[id] < dist[current])) current = id;
    });
    if (current === null) break;
    done.add(current);
    neighbours(graph, current, banned).forEach(([next, w]) => {
      if (dist[next] === undefined || dist[current] + w < dist[next]) dist[next] = dist[current] + w;
    });
  }
  return dist;
}

// Все простые пути (вершины не повторяются) с длинами.
function allPaths(graph, from, to, banned) {
  const result = [];
  const walk = (current, path, length) => {
    if (current === to) { result.push({ path, length }); return; }
    neighbours(graph, current, banned).forEach(([next, w]) => {
      if (!path.includes(next)) walk(next, [...path, next], length + w);
    });
  };
  walk(from, [from], 0);
  return result.sort((p, q) => p.length - q.length || p.path.length - q.path.length);
}

function matrixHtml(graph) {
  const names = ids(graph);
  const head = names.map(id => `<th>${id}</th>`).join("");
  const rows = names.map(row => `<tr><th>${row}</th>${names.map(col => {
    if (row === col) return `<td class="diag"></td>`;
    const w = edgeWeight(graph, row, col);
    return `<td>${w === null ? "" : w}</td>`;
  }).join("")}</tr>`).join("");
  return `<table class="dist-table" aria-label="Таблица дорог"><tr><th></th>${head}</tr>${rows}</table>`;
}

function graphSvg(graph, options = {}) {
  const names = ids(graph);
  const banned = options.banned;
  const source = options.source;
  const edges = graph.edges.map(([a, b, w]) => {
    const p = nodeXY(graph, a);
    const q = nodeXY(graph, b);
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const dead = a === banned || b === banned;
    const lx = p.x + dx * 0.42;
    const ly = p.y + dy * 0.42;
    return `<line class="g-edge${dead ? " banned" : ""}" x1="${(p.x + ux * VIEW.r).toFixed(1)}" y1="${(p.y + uy * VIEW.r).toFixed(1)}" x2="${(q.x - ux * VIEW.r).toFixed(1)}" y2="${(q.y - uy * VIEW.r).toFixed(1)}"/>
      <rect class="g-weight-bg" x="${(lx - 11).toFixed(1)}" y="${(ly - 10).toFixed(1)}" width="22" height="20" rx="6"/><text class="g-weight" x="${lx.toFixed(1)}" y="${(ly + 4.5).toFixed(1)}">${w}</text>`;
  }).join("");
  const nodes = names.map(id => {
    const p = nodeXY(graph, id);
    const cls = `g-node${id === source ? " start" : ""}${id === banned ? " banned" : ""}${options.active === id ? " active" : ""}`;
    const label = options.labels && options.labels[id] !== undefined
      ? `<circle class="g-badge" cx="${(p.x + 17).toFixed(1)}" cy="${(p.y - 20).toFixed(1)}" r="13"/><text class="g-count" x="${(p.x + 17).toFixed(1)}" y="${(p.y - 15.5).toFixed(1)}">${options.labels[id]}</text>`
      : "";
    return `<circle class="${cls}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${VIEW.r}"/><text class="g-name${id === banned ? " banned" : ""}" x="${p.x.toFixed(1)}" y="${(p.y + 6).toFixed(1)}">${id}</text>${label}`;
  }).join("");
  return `<svg class="graph-svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" role="img" aria-label="Граф по таблице дорог">${edges}${nodes}</svg>`;
}

// ===== Рисунки и таблицы в разборах и заданиях =====
function addExamplePictures() {
  $all(".example-card").forEach((card, index) => {
    const key = examples[index]?.graph;
    if (!key) return;
    const box = document.createElement("div");
    box.innerHTML = `${matrixHtml(GRAPHS[key])}<div class="graph-box">${graphSvg(GRAPHS[key])}</div>`;
    $(".example-condition", card).after(box);
  });
}

function addTaskPictures() {
  $all(".task-card").forEach(card => {
    const task = tasks.find(item => item.id === card.dataset.taskId);
    if (!task?.graph) return;
    const box = document.createElement("div");
    box.innerHTML = `${matrixHtml(GRAPHS[task.graph])}<button class="hint-toggle pic-toggle" type="button">Показать граф по таблице</button><div class="graph-box" hidden>${graphSvg(GRAPHS[task.graph])}</div>`;
    $("p", card).after(box);
    const toggle = $(".pic-toggle", box);
    toggle.addEventListener("click", () => {
      const picture = $(".graph-box", box);
      picture.hidden = !picture.hidden;
      toggle.textContent = picture.hidden ? "Показать граф по таблице" : "Скрыть граф";
    });
  });
}

// ===== Подписи расстояний =====
const lab = { key: LAB_GRAPHS[0], source: "A", banned: "", active: null, labels: {}, expected: {} };

function labGraph() { return GRAPHS[lab.key]; }

function drawLab() {
  $("#labTable").innerHTML = matrixHtml(labGraph());
  $("#labSvg").outerHTML = graphSvg(labGraph(), { labels: lab.labels, active: lab.active, banned: lab.banned || undefined, source: lab.source })
    .replace("<svg ", '<svg id="labSvg" ');
}

function fillSelect(select, values, withNone) {
  select.replaceChildren();
  if (withNone) {
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "нет";
    select.append(none);
  }
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function buildLab() {
  const graph = labGraph();
  lab.source = $("#sourceSelect").value || ids(graph)[0];
  lab.banned = $("#banSelect").value;
  if (lab.banned === lab.source) { lab.banned = ""; $("#banSelect").value = ""; }
  lab.labels = {};
  lab.active = null;
  lab.expected = distances(graph, lab.source, lab.banned || undefined);
  const grid = $("#labelGrid");
  grid.replaceChildren();
  ids(graph).forEach(id => {
    const label = document.createElement("label");
    const dead = id === lab.banned;
    label.innerHTML = `<span>d(${id})</span><input inputmode="numeric" data-vertex="${id}" aria-label="Расстояние до ${id}" placeholder="${dead ? "×" : "?"}"${dead ? " disabled" : ""}>`;
    const input = $("input", label);
    input.addEventListener("focus", () => { lab.active = id; drawLab(); });
    input.addEventListener("input", () => input.classList.remove("ok", "bad"));
    grid.append(label);
  });
  $("#labPaths").hidden = true;
  drawLab();
  $("#labFeedback").className = "feedback";
  $("#labFeedback").textContent = "Впиши расстояния и нажми «Проверить». Если до пункта добраться нельзя, поставь прочерк «-».";
  $("#verdict").textContent = lab.banned
    ? `Пункт ${lab.banned} запрещён: его дороги вычеркнуты, ищем расстояния в остатке графа.`
    : "Подписывай по порядку возрастания расстояния: d(X) — минимум из d(Y) + вес дороги Y—X по уже подписанным соседям.";
}

function parseDistance(text) {
  const value = words(text);
  if (/^[-–—∞]|нет/.test(value)) return null;
  return numberValue(value);
}

function checkLab() {
  const inputs = $all("#labelGrid input").filter(input => !input.disabled);
  const feedback = $("#labFeedback");
  if (!inputs.some(input => input.value.trim() !== "")) {
    feedback.className = "feedback error";
    feedback.textContent = `Сначала впиши хотя бы одно расстояние. Начни с d(${lab.source}) = 0.`;
    return;
  }
  lab.labels = {};
  let bad = 0;
  let missing = 0;
  inputs.forEach(input => {
    const id = input.dataset.vertex;
    if (input.value.trim() === "") { missing += 1; return; }
    const expected = lab.expected[id] === undefined ? null : lab.expected[id];
    const given = parseDistance(input.value);
    const ok = expected === null ? given === null : near(given, expected, 0);
    input.classList.toggle("ok", ok);
    input.classList.toggle("bad", !ok);
    if (ok) lab.labels[id] = expected === null ? "∞" : expected; else bad += 1;
  });
  drawLab();
  if (bad === 0 && missing === 0) {
    feedback.className = "feedback success";
    feedback.textContent = "Все расстояния верны. Нажми «Показать все пути с длинами» и сравни с перебором.";
    return;
  }
  feedback.className = "feedback error";
  const wrong = inputs.filter(input => input.classList.contains("bad")).map(input => input.dataset.vertex);
  feedback.textContent = bad > 0
    ? `Неверно у пунктов: ${wrong.join(", ")}. Проверь соседей: d(X) = минимум из d(Y) + вес дороги по всем подписанным соседям. Подсказка поможет.`
    : "Верно пока всё, что вписано. Заполни остальные пункты.";
}

function hintLab() {
  const graph = labGraph();
  const inputs = $all("#labelGrid input").filter(input => !input.disabled);
  const target = inputs.find(input => !input.classList.contains("ok") && input.dataset.vertex !== lab.source) || inputs[0];
  const id = target.dataset.vertex;
  lab.active = id;
  drawLab();
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  if (id === lab.source) {
    feedback.textContent = `Пункт ${id} — начало: d(${id}) = 0.`;
  } else {
    const known = neighbours(graph, id, lab.banned || undefined)
      .filter(([next]) => lab.expected[next] !== undefined && lab.expected[next] < (lab.expected[id] ?? Infinity));
    feedback.textContent = known.length === 0
      ? `До пункта ${id} добраться нельзя (дороги к нему ведут только через вычеркнутый пункт). Поставь прочерк «-».`
      : `Соседи пункта ${id} с уже известным расстоянием: ${known.map(([next, w]) => `${next} (d = ${lab.expected[next]}, дорога ${w}: ${lab.expected[next]} + ${w} = ${lab.expected[next] + w})`).join("; ")}. Выбери наименьшую сумму.`;
  }
  target.focus();
}

function showLabPaths() {
  const graph = labGraph();
  const candidates = ids(graph).filter(id => id !== lab.source && id !== lab.banned);
  const to = candidates[candidates.length - 1];
  const paths = allPaths(graph, lab.source, to, lab.banned || undefined);
  const box = $("#labPaths");
  box.hidden = false;
  box.innerHTML = paths.length === 0
    ? `<strong>Из ${lab.source} в ${to} добраться нельзя.</strong>`
    : `<strong>Все пути из ${lab.source} в ${to}: ${paths.length}. Кратчайший: ${paths[0].length}.</strong><ol class="paths-list">${paths.map(item => `<li>${item.path.join("→")} = ${item.length}</li>`).join("")}</ol>`;
}

function initLab() {
  fillSelect($("#graphSelect"), LAB_GRAPHS, false);
  $all("#graphSelect option").forEach(option => { option.textContent = GRAPHS[option.value].name; });
  const refill = () => {
    const names = ids(labGraph());
    fillSelect($("#sourceSelect"), names, false);
    fillSelect($("#banSelect"), names, true);
  };
  refill();
  $("#graphSelect").addEventListener("change", () => { lab.key = $("#graphSelect").value; refill(); buildLab(); });
  $("#sourceSelect").addEventListener("change", buildLab);
  $("#banSelect").addEventListener("change", buildLab);
  $("#checkBtn").addEventListener("click", checkLab);
  $("#clearBtn").addEventListener("click", buildLab);
  $("#hintBtn").addEventListener("click", hintLab);
  $("#listBtn").addEventListener("click", showLabPaths);
  buildLab();
}

// ===== Все пути =====
function initEnumeration() {
  const graphSelect = $("#enumGraph");
  const keys = ["t5", "p4", "p3", "t6", "q2", "q3", "t7"];
  fillSelect(graphSelect, keys, false);
  $all("#enumGraph option").forEach(option => { option.textContent = GRAPHS[option.value].name; });
  const refill = () => {
    const names = ids(GRAPHS[graphSelect.value]);
    fillSelect($("#enumFrom"), names, false);
    fillSelect($("#enumTo"), names, false);
    $("#enumTo").value = names[names.length - 1];
    const via = $("#enumVia");
    via.replaceChildren();
    [["", "без условия"], ...names.map(id => [`via:${id}`, `через ${id}`]), ...names.map(id => [`not:${id}`, `не через ${id}`])].forEach(([value, text]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      via.append(option);
    });
    $("#enumResult").replaceChildren();
  };
  graphSelect.addEventListener("change", refill);
  refill();
  $("#enumBtn").addEventListener("click", () => {
    const graph = GRAPHS[graphSelect.value];
    const from = $("#enumFrom").value;
    const to = $("#enumTo").value;
    const condition = $("#enumVia").value;
    const result = $("#enumResult");
    if (from === to) { result.textContent = "Выберите разные пункты."; return; }
    const [kind, vertex] = condition.split(":");
    if (vertex && (vertex === from || vertex === to)) { result.textContent = "Условие должно относиться к промежуточному пункту."; return; }
    let paths = allPaths(graph, from, to, kind === "not" ? vertex : undefined);
    if (kind === "via") paths = paths.filter(item => item.path.includes(vertex));
    const lines = [];
    const all = allPaths(graph, from, to);
    lines.push(`Без условий путей из ${from} в ${to}: ${all.length}.`);
    if (kind === "not") lines.push(`Пункт ${vertex} вычеркнут вместе с его дорогами. Остаются пути: ${paths.length}.`);
    if (kind === "via") lines.push(`Путей через ${vertex}: ${paths.length}.`);
    if (paths.length === 0) {
      result.innerHTML = `<strong>Ответ: нет путей.</strong><ol>${lines.map(line => `<li>${line}</li>`).join("")}</ol>`;
      return;
    }
    lines.push(`Список путей с длинами: ${paths.map(item => `${item.path.join("→")} = ${item.length}`).join("; ")}.`);
    lines.push(`Кратчайший путь: ${paths[0].path.join("→")} = ${paths[0].length}.`);
    result.innerHTML = `<strong>Количество путей: ${paths.length}. Длина кратчайшего: ${paths[0].length}.</strong><ol>${lines.map(line => `<li>${line}</li>`).join("")}</ol>
      <p>Вопрос «сколько путей» — это ${paths.length}, вопрос «длина кратчайшего» — ${paths[0].length}.</p>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initLab();
  renderExamples();
  initEnumeration();
  initTasks();
  addExamplePictures();
  addTaskPictures();
  $("#resetProgressBtn").addEventListener("click", () => setTimeout(addTaskPictures, 0));
});
