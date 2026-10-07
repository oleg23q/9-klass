"use strict";

const STORAGE_PREFIX = "grade9-graph-paths";

// Координаты вершин заданы в процентах рисунка. Рёбра: [откуда, куда].
const GRAPHS = {
  triangle: {
    name: "Три вершины", directed: true,
    nodes: { "А": [14, 72], "Б": [50, 20], "В": [86, 72] },
    edges: [["А", "Б"], ["Б", "В"], ["А", "В"]]
  },
  g1: {
    name: "Граф 1 (4 вершины)", directed: true,
    nodes: { "А": [12, 50], "Б": [42, 18], "В": [42, 82], "Г": [86, 50] },
    edges: [["А", "Б"], ["А", "В"], ["Б", "В"], ["Б", "Г"], ["В", "Г"]]
  },
  g2: {
    name: "Граф 2 (6 вершин)", directed: true,
    nodes: { "А": [8, 50], "Б": [30, 18], "В": [30, 82], "Г": [58, 22], "Д": [58, 78], "Е": [90, 50] },
    edges: [["А", "Б"], ["А", "В"], ["Б", "Г"], ["В", "Г"], ["В", "Д"], ["Г", "Е"], ["Д", "Е"]]
  },
  g3: {
    name: "Граф 3 (6 вершин, подписи растут)", directed: true,
    nodes: { "А": [7, 50], "Б": [27, 18], "В": [42, 82], "Г": [60, 18], "Д": [74, 82], "Е": [93, 50] },
    edges: [["А", "Б"], ["А", "В"], ["Б", "В"], ["Б", "Г"], ["В", "Г"], ["В", "Д"], ["Г", "Д"], ["Г", "Е"], ["Д", "Е"]]
  },
  g4: {
    name: "Граф 4 (7 вершин)", directed: true,
    nodes: { "А": [7, 50], "Б": [33, 16], "В": [33, 50], "Г": [33, 84], "Д": [62, 28], "Е": [62, 72], "Ж": [92, 50] },
    edges: [["А", "Б"], ["А", "В"], ["А", "Г"], ["Б", "Д"], ["В", "Д"], ["В", "Е"], ["Г", "Е"], ["Д", "Ж"], ["Е", "Ж"]]
  },
  g5: {
    name: "Граф для разбора (5 вершин)", directed: true,
    nodes: { "А": [8, 50], "Б": [30, 18], "В": [30, 82], "Г": [58, 50], "Д": [92, 50] },
    edges: [["А", "Б"], ["А", "В"], ["Б", "Г"], ["В", "Г"], ["Г", "Д"], ["Б", "Д"]]
  },
  g6: {
    name: "Граф задания 12 (4 вершины)", directed: true,
    nodes: { "А": [10, 62], "Б": [38, 20], "В": [62, 78], "Г": [90, 40] },
    edges: [["А", "Б"], ["Б", "В"], ["А", "В"], ["В", "Г"], ["Б", "Г"]]
  },
  undirected: {
    name: "Неориентированный граф", directed: false,
    nodes: { "А": [12, 50], "Б": [44, 18], "В": [44, 82], "Г": [86, 50] },
    edges: [["А", "Б"], ["А", "В"], ["Б", "В"], ["Б", "Г"], ["В", "Г"]]
  },
  noin: {
    name: "Граф с вершиной без входящих стрелок", directed: true,
    nodes: { "А": [8, 50], "Б": [32, 50], "В": [58, 50], "Г": [45, 14], "Д": [90, 50] },
    edges: [["А", "Б"], ["Б", "В"], ["Г", "В"], ["В", "Д"]]
  },
  h1: {
    name: "Граф с узким местом", directed: true,
    nodes: { "А": [8, 50], "Б": [33, 15], "В": [33, 50], "Г": [33, 85], "Д": [65, 50], "Е": [92, 50] },
    edges: [["А", "Б"], ["А", "В"], ["А", "Г"], ["Б", "Д"], ["В", "Д"], ["Г", "Д"], ["Д", "Е"]]
  },
  h2: {
    name: "Граф из двух ромбов", directed: true,
    nodes: { "А": [8, 50], "Б": [30, 18], "В": [30, 82], "Г": [62, 18], "Д": [62, 82], "Е": [92, 50] },
    edges: [["А", "Б"], ["А", "В"], ["Б", "Г"], ["В", "Г"], ["Б", "Д"], ["В", "Д"], ["Г", "Е"], ["Д", "Е"]]
  },
  u2: {
    name: "Неориентированный граф из пяти вершин", directed: false,
    nodes: { "А": [8, 50], "Б": [34, 16], "В": [34, 84], "Г": [68, 16], "Д": [92, 50] },
    edges: [["А", "Б"], ["А", "В"], ["Б", "В"], ["Б", "Г"], ["В", "Д"], ["Г", "Д"]]
  }
};
const LAB_GRAPHS = ["g1", "g2", "g3", "g4"];

const examples = [
  {
    id: "mult-add",
    level: "базовый уровень",
    title: "Правила умножения и сложения",
    text: "Из города А в город Б ведут 3 дороги, из Б в В — 2 дороги. Кроме того, из А в Г ведут 2 дороги, а из Г в В — 2 дороги. Сколько существует способов добраться из А в В?",
    steps: [
      { title: "Разделим маршруты", body: "Добраться из А в В можно либо через Б, либо через Г. Это два разных маршрута: выбираем один из них." },
      { title: "Маршрут через Б", body: "Сначала А→Б (3 дороги), потом Б→В (2 дороги). Части идут одна за другой, поэтому умножаем: 3 · 2 = 6. Для каждой из трёх дорог первой части есть две дороги второй: 2 + 2 + 2 = 6." },
      { title: "Маршрут через Г", body: "Так же: 2 · 2 = 4 способа." },
      { title: "Складываем маршруты", body: "Через Б или через Г — варианты исключают друг друга, поэтому складываем: 6 + 4 = 10." }
    ],
    answer: "10 способов: сначала умножаем этапы одного маршрута, затем складываем разные маршруты."
  },
  {
    id: "labels",
    level: "базовый уровень",
    title: "Метод подписей у вершин",
    graph: "g5",
    text: "Рёбра ориентированного графа: А→Б, А→В, Б→Г, В→Г, Г→Д, Б→Д. Сколько существует путей из А в Д?",
    steps: [
      { title: "Старт", body: "N(А) = 1: добраться до А из А можно одним способом — никуда не идти." },
      { title: "Вершины Б и В", body: "В Б входит стрелка только из А: N(Б) = N(А) = 1. В В тоже входит только А→В: N(В) = 1." },
      { title: "Вершина Г", body: "В Г входят стрелки из Б и из В. Последний шаг пути в Г — одна из этих стрелок, поэтому N(Г) = N(Б) + N(В) = 1 + 1 = 2." },
      { title: "Вершина Д", body: "В Д входят стрелки из Г и из Б: N(Д) = N(Г) + N(Б) = 2 + 1 = 3." },
      { title: "Проверка перечислением", body: "А-Б-Д; А-Б-Г-Д; А-В-Г-Д. Всего три пути — совпало с подписью N(Д) = 3." }
    ],
    answer: "3 пути: А-Б-Д, А-Б-Г-Д, А-В-Г-Д."
  },
  {
    id: "through",
    level: "средний уровень",
    title: "Через вершину и не через вершину",
    graph: "g2",
    text: "Рёбра: А→Б, А→В, Б→Г, В→Г, В→Д, Г→Е, Д→Е. Сколько путей из А в Е проходит через вершину Г и сколько не проходит?",
    steps: [
      { title: "Все пути", body: "Подписи: N(А) = 1, N(Б) = 1, N(В) = 1, N(Г) = N(Б) + N(В) = 2, N(Д) = N(В) = 1, N(Е) = N(Г) + N(Д) = 3. Всего 3 пути." },
      { title: "Путей до Г", body: "Из А в Г ведут N(Г) = 2 пути: А-Б-Г и А-В-Г." },
      { title: "Путей от Г до Е", body: "Из Г в Е ведёт одна стрелка: 1 путь." },
      { title: "Через Г", body: "Этапы идут один за другим: 2 · 1 = 2 пути." },
      { title: "Не через Г", body: "Все пути минус пути через Г: 3 − 2 = 1. Это путь А-В-Д-Е." }
    ],
    answer: "Через Г — 2 пути, не через Г — 1 путь (А-В-Д-Е)."
  },
  {
    id: "undirected",
    level: "повышенный уровень",
    title: "Неориентированный граф: перебор",
    graph: "undirected",
    text: "Неориентированные рёбра: А—Б, А—В, Б—В, Б—Г, В—Г. Сколько путей из А в Г, если вершины в пути не повторяются?",
    steps: [
      { title: "Почему не подписи", body: "Здесь нет стрелок: по ребру можно ходить в обе стороны, значит, можно ходить по кругу. Поэтому подписи не работают, и вершины запрещено повторять." },
      { title: "Первый шаг", body: "Из А можно пойти в Б или в В — две ветви." },
      { title: "Ветвь через Б", body: "А-Б. Дальше из Б можно в Г (путь А-Б-Г) или в В (А-Б-В), а из В — в Г: А-Б-В-Г." },
      { title: "Ветвь через В", body: "А-В. Дальше из В в Г (А-В-Г) или в Б (А-В-Б), а из Б — в Г: А-В-Б-Г." },
      { title: "Итог", body: "А-Б-Г, А-Б-В-Г, А-В-Г, А-В-Б-Г — четыре пути." }
    ],
    answer: "4 пути."
  }
];

const tasks = [
  {
    id: "listing", type: "что такое путь", title: "Выпиши пути", graph: "triangle",
    text: "Рёбра: А→Б, Б→В, А→В. Сколько существует путей из А в В?",
    placeholder: "число путей",
    hint: "Выпиши последовательности вершин, идя по стрелкам: есть ли прямой путь? есть ли путь через Б?",
    check: v => near(numberValue(v), 2),
    answerText: "2 пути: А-В и А-Б-В.",
    solution: ["<b>Разбор.</b> Путь А→В состоит из одной стрелки, путь А→Б→В — из двух. Это разные последовательности вершин, значит, два пути.", "<b>Ответ:</b> 2."]
  },
  {
    id: "mult", type: "правило умножения", title: "Две части маршрута",
    text: "Из А в Б ведут 4 дороги, из Б в В — 3 дороги. Сколько способов проехать из А в В через Б?",
    placeholder: "способов",
    hint: "Части маршрута идут одна за другой: умножаем или складываем?",
    check: v => near(numberValue(v), 12),
    answerText: "12 способов.",
    solution: ["<b>Разбор.</b> Для каждой из 4 дорог первой части есть 3 дороги второй: 3 + 3 + 3 + 3 = 4 · 3 = 12.", "<b>Ответ:</b> 12."]
  },
  {
    id: "add", type: "правило сложения", title: "Два маршрута",
    text: "Из А в В можно добраться через Б или через Г. Из А в Б 2 дороги, из Б в В — 3 дороги; из А в Г 1 дорога, из Г в В — 4 дороги. Сколько всего способов?",
    placeholder: "способов",
    hint: "Сначала посчитай каждый маршрут отдельно (умножь этапы), затем сложи маршруты.",
    check: v => near(numberValue(v), 10),
    answerText: "10 способов.",
    solution: ["<b>Через Б:</b> 2 · 3 = 6. <b>Через Г:</b> 1 · 4 = 4.", "Маршруты исключают друг друга, поэтому складываем: 6 + 4 = 10.", "<b>Ответ:</b> 10."]
  },
  {
    id: "g1", type: "метод подписей", title: "Четыре вершины", graph: "g1",
    text: "Рёбра: А→Б, А→В, Б→В, Б→Г, В→Г. Сколько путей из А в Г?",
    placeholder: "число путей",
    hint: "N(А) = 1; в каждую следующую вершину входят стрелки — сложи подписи вершин, из которых они идут.",
    check: v => near(numberValue(v), 3),
    answerText: "3 пути.",
    solution: ["<b>Подписи:</b> N(А) = 1; N(Б) = 1; N(В) = N(А) + N(Б) = 2; N(Г) = N(Б) + N(В) = 3.", "<b>Проверка:</b> А-Б-Г, А-Б-В-Г, А-В-Г.", "<b>Ответ:</b> 3."]
  },
  {
    id: "g5", type: "метод подписей", title: "Пять вершин", graph: "g5",
    text: "Рёбра: А→Б, А→В, Б→Г, В→Г, Г→Д, Б→Д. Сколько путей из А в Д?",
    placeholder: "число путей",
    hint: "Д получает стрелки из Г и из Б: N(Д) = N(Г) + N(Б).",
    check: v => near(numberValue(v), 3),
    answerText: "3 пути.",
    solution: ["<b>Подписи:</b> N(А) = 1; N(Б) = 1; N(В) = 1; N(Г) = N(Б) + N(В) = 2; N(Д) = N(Г) + N(Б) = 3.", "<b>Ответ:</b> 3."]
  },
  {
    id: "g2", type: "метод подписей", title: "Шесть вершин", graph: "g2",
    text: "Рёбра: А→Б, А→В, Б→Г, В→Г, В→Д, Г→Е, Д→Е. Сколько путей из А в Е?",
    placeholder: "число путей",
    hint: "Подписывай А, Б, В, Г, Д, Е по порядку.",
    check: v => near(numberValue(v), 3),
    answerText: "3 пути.",
    solution: ["<b>Подписи:</b> N(А) = N(Б) = N(В) = 1; N(Г) = N(Б) + N(В) = 2; N(Д) = N(В) = 1; N(Е) = N(Г) + N(Д) = 3.", "<b>Ответ:</b> 3."]
  },
  {
    id: "g3", type: "быстрый рост", title: "Подписи растут", graph: "g3",
    text: "Рёбра: А→Б, А→В, Б→В, Б→Г, В→Г, В→Д, Г→Д, Г→Е, Д→Е. Сколько путей из А в Е?",
    placeholder: "число путей",
    hint: "Выписывать все пути долго. Подпиши вершины: 1, 1, 2, … каждая новая — сумма двух предыдущих.",
    check: v => near(numberValue(v), 8),
    answerText: "8 путей.",
    solution: ["<b>Подписи:</b> N(А) = 1; N(Б) = 1; N(В) = N(А) + N(Б) = 2; N(Г) = N(Б) + N(В) = 3; N(Д) = N(В) + N(Г) = 5; N(Е) = N(Г) + N(Д) = 8.", "<b>Смысл:</b> числа 1, 1, 2, 3, 5, 8 — ряд Фибоначчи; перебор вручную был бы долгим, подписи короткие.", "<b>Ответ:</b> 8."]
  },
  {
    id: "g4", type: "метод подписей", title: "Семь вершин", graph: "g4",
    text: "Рёбра: А→Б, А→В, А→Г, Б→Д, В→Д, В→Е, Г→Е, Д→Ж, Е→Ж. Сколько путей из А в Ж?",
    placeholder: "число путей",
    hint: "Д получает стрелки из Б и В; Е — из В и Г; Ж — из Д и Е.",
    check: v => near(numberValue(v), 4),
    answerText: "4 пути.",
    solution: ["<b>Подписи:</b> N(Б) = N(В) = N(Г) = 1; N(Д) = N(Б) + N(В) = 2; N(Е) = N(В) + N(Г) = 2; N(Ж) = N(Д) + N(Е) = 4.", "<b>Ответ:</b> 4."]
  },
  {
    id: "through-g", type: "через вершину", title: "Через вершину Г", graph: "g3",
    text: "В графе задачи 7 (рёбра А→Б, А→В, Б→В, Б→Г, В→Г, В→Д, Г→Д, Г→Е, Д→Е) найди число путей из А в Е, проходящих через вершину Г.",
    placeholder: "число путей",
    hint: "Умножь число путей из А в Г на число путей из Г в Е.",
    check: v => near(numberValue(v), 6),
    answerText: "6 путей.",
    solution: ["<b>До Г:</b> N(Г) = 3 пути.", "<b>От Г до Е:</b> Г-Е и Г-Д-Е — 2 пути.", "<b>Через Г:</b> 3 · 2 = 6.", "<b>Ответ:</b> 6."]
  },
  {
    id: "not-through", type: "не через вершину", title: "Не через вершину В", graph: "g3",
    text: "В том же графе найди число путей из А в Е, которые не проходят через вершину В.",
    placeholder: "число путей",
    hint: "Из всех путей (8) вычти пути через В: N(В) · (пути из В в Е).",
    check: v => near(numberValue(v), 2),
    answerText: "2 пути.",
    solution: ["<b>Всего:</b> 8 путей.", "<b>Через В:</b> до В — 2 пути; от В до Е: В-Г-Е, В-Г-Д-Е, В-Д-Е — 3 пути; 2 · 3 = 6.", "<b>Не через В:</b> 8 − 6 = 2 (А-Б-Г-Е и А-Б-Г-Д-Е).", "<b>Ответ:</b> 2."]
  },
  {
    id: "undirected-task", type: "неориентированный граф", title: "Перебор путей", graph: "undirected",
    text: "Неориентированные рёбра: А—Б, А—В, Б—В, Б—Г, В—Г. Сколько путей из А в Г, если вершины в пути не повторяются?",
    placeholder: "число путей",
    hint: "Подписи здесь не нужны: выпиши пути перебором, как ветви дерева, из А в Б и из А в В.",
    check: v => near(numberValue(v), 4),
    answerText: "4 пути.",
    solution: ["<b>Перебор:</b> А-Б-Г; А-Б-В-Г; А-В-Г; А-В-Б-Г.", "<b>Ответ:</b> 4."]
  },
  {
    id: "mistake", type: "исправь ошибку", title: "Рёбра и пути", graph: "g6",
    text: "Рёбра: А→Б, Б→В, А→В, В→Г, Б→Г. Ученик написал: «Рёбер 5, значит, из А в Г ведут 5 путей». Найди правильное число путей из А в Г.",
    placeholder: "число путей",
    hint: "Число рёбер не равно числу путей. Подпиши вершины А, Б, В, Г.",
    check: v => near(numberValue(v), 3),
    answerText: "3 пути.",
    solution: ["<b>Ошибка:</b> число рёбер графа не равно числу путей.", "<b>Подписи:</b> N(А) = 1; N(Б) = 1; N(В) = N(А) + N(Б) = 2; N(Г) = N(В) + N(Б) = 3.", "<b>Ответ:</b> 3."]
  },
  {
    id: "matrix", type: "матрица → граф", title: "Граф по матрице",
    text: "Двоичная матрица ориентированного графа (строка — «откуда», столбец — «куда»):<table class=\"mini-table\"><tr><th></th><th>А</th><th>Б</th><th>В</th><th>Г</th></tr><tr><th>А</th><td>0</td><td>1</td><td>1</td><td>0</td></tr><tr><th>Б</th><td>0</td><td>0</td><td>1</td><td>1</td></tr><tr><th>В</th><td>0</td><td>0</td><td>0</td><td>1</td></tr><tr><th>Г</th><td>0</td><td>0</td><td>0</td><td>0</td></tr></table>Сколько путей из А в Г?",
    placeholder: "число путей",
    hint: "Выпиши стрелки: единица в строке X и столбце Y означает X→Y. Потом подпиши вершины.",
    check: v => near(numberValue(v), 3),
    answerText: "3 пути.",
    solution: ["<b>Стрелки:</b> А→Б, А→В, Б→В, Б→Г, В→Г.", "<b>Подписи:</b> N(А) = 1; N(Б) = 1; N(В) = 2; N(Г) = N(Б) + N(В) = 3.", "<b>Ответ:</b> 3."]
  },
  {
    id: "no-incoming", type: "вершина без входящих", title: "Лишняя вершина", graph: "noin",
    text: "Рёбра: А→Б, Б→В, Г→В, В→Д. Сколько путей из А в Д?",
    placeholder: "число путей",
    hint: "В Г не входит ни одна стрелка, а Г не старт. Чему равна подпись N(Г)?",
    check: v => near(numberValue(v), 1),
    answerText: "1 путь.",
    solution: ["<b>Разбор.</b> Считаем только пути из А. В Г из А попасть нельзя: N(Г) = 0.", "<b>Подписи:</b> N(А) = 1; N(Б) = 1; N(В) = N(Б) + N(Г) = 1 + 0 = 1; N(Д) = N(В) = 1.", "<b>Ответ:</b> 1 (путь А-Б-В-Д)."]
  },
  {
    id: "via-b-not-g", type: "два условия", title: "Через Б, но не через Г", graph: "g3",
    text: "В графе задачи 7 (А→Б, А→В, Б→В, Б→Г, В→Г, В→Д, Г→Д, Г→Е, Д→Е) сколько путей из А в Е проходят через Б и не проходят через Г?",
    placeholder: "число путей",
    hint: "Выпиши пути через Б, а затем вычеркни те, где есть Г. Путей из А в Е всего 8.",
    check: v => near(numberValue(v), 1),
    answerText: "1 путь.",
    solution: ["<b>Через Б:</b> А-Б-Г-Е, А-Б-Г-Д-Е, А-Б-В-Г-Е, А-Б-В-Г-Д-Е, А-Б-В-Д-Е.", "<b>Без Г:</b> остаётся только А-Б-В-Д-Е.", "<b>Ответ:</b> 1."]
  },
  {
    id: "bottleneck", type: "метод подписей", title: "Узкое место", graph: "h1",
    text: "Рёбра: А→Б, А→В, А→Г, Б→Д, В→Д, Г→Д, Д→Е. Сколько путей из А в Е?",
    placeholder: "число путей",
    hint: "Все пути проходят через Д. Сколько путей из А в Д?",
    check: v => near(numberValue(v), 3),
    answerText: "3 пути.",
    solution: ["<b>Подписи:</b> N(Б) = N(В) = N(Г) = 1; N(Д) = 1 + 1 + 1 = 3; N(Е) = N(Д) = 3.", "<b>Смысл:</b> после Д путь один, поэтому путей до Е столько же, сколько до Д.", "<b>Ответ:</b> 3."]
  },
  {
    id: "diamonds", type: "метод подписей", title: "Два ромба", graph: "h2",
    text: "Рёбра: А→Б, А→В, Б→Г, В→Г, Б→Д, В→Д, Г→Е, Д→Е. Сколько путей из А в Е?",
    placeholder: "число путей",
    hint: "Подпиши Б, В, затем Г и Д (в каждую входят стрелки из Б и В), затем Е.",
    check: v => near(numberValue(v), 4),
    answerText: "4 пути.",
    solution: ["<b>Подписи:</b> N(Б) = N(В) = 1; N(Г) = N(Б) + N(В) = 2; N(Д) = N(Б) + N(В) = 2; N(Е) = N(Г) + N(Д) = 4.", "<b>Ответ:</b> 4."]
  },
  {
    id: "through-g-diamonds", type: "через вершину", title: "Через Г", graph: "h2",
    text: "В графе предыдущей задачи найди число путей из А в Е, проходящих через Г.",
    placeholder: "число путей",
    hint: "Умножь число путей из А в Г на число путей из Г в Е.",
    check: v => near(numberValue(v), 2),
    answerText: "2 пути.",
    solution: ["<b>До Г:</b> N(Г) = 2 пути. <b>От Г до Е:</b> одна стрелка, 1 путь.", "<b>Через Г:</b> 2 · 1 = 2. Остальные 4 − 2 = 2 пути идут через Д.", "<b>Ответ:</b> 2."]
  },
  {
    id: "undirected-5", type: "неориентированный граф", title: "Перебор на пяти вершинах", graph: "u2",
    text: "Неориентированные рёбра: А—Б, А—В, Б—В, Б—Г, В—Д, Г—Д. Сколько путей из А в Д, если вершины в пути не повторяются?",
    placeholder: "число путей",
    hint: "Перебирай ветви: из А — в Б или в В. Подписи тут не работают.",
    check: v => near(numberValue(v), 4),
    answerText: "4 пути.",
    solution: ["<b>Перебор:</b> А-В-Д; А-Б-В-Д; А-Б-Г-Д; А-В-Б-Г-Д.", "<b>Ответ:</b> 4."]
  },
  {
    id: "sum-all", type: "исправь ошибку", title: "Сумма подписей", graph: "h2",
    text: "В графе из двух ромбов ученик сложил все подписи: 1 + 1 + 1 + 2 + 2 + 4 = 11 и ответил, что из А в Е 11 путей. Найди правильный ответ.",
    placeholder: "число путей",
    hint: "Ответ — подпись только финиша Е, а не сумма всех подписей.",
    check: v => near(numberValue(v), 4),
    answerText: "4 пути.",
    solution: ["<b>Ошибка:</b> подпись каждой вершины — число путей до неё. Сумма подписей всех вершин не есть число путей до Е.", "<b>Ответ:</b> число путей из А в Е равно подписи финиша N(Е) = 4."]
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
const NS = "http://www.w3.org/2000/svg";
const VIEW = { w: 560, h: 300, padX: 40, padY: 36, r: 20 };

function nodeXY(graph, id) {
  const [px, py] = graph.nodes[id];
  return { x: VIEW.padX + (VIEW.w - 2 * VIEW.padX) * px / 100, y: VIEW.padY + (VIEW.h - 2 * VIEW.padY) * py / 100 };
}

function graphVertices(graph) {
  return Object.keys(graph.nodes);
}

function incoming(graph, id) {
  return graph.edges.filter(edge => edge[1] === id).map(edge => edge[0]);
}

// Число путей из старта в каждую вершину (граф ориентированный, без циклов; вершины в порядке следования).
function countPaths(graph) {
  const order = graphVertices(graph);
  const counts = {};
  order.forEach((id, index) => {
    counts[id] = index === 0 ? 1 : incoming(graph, id).reduce((sum, from) => sum + counts[from], 0);
  });
  return counts;
}

function allPaths(graph, from, to) {
  const result = [];
  const neighbours = id => graph.edges.flatMap(([a, b]) => {
    if (a === id) return [b];
    if (!graph.directed && b === id) return [a];
    return [];
  });
  const walk = (current, path) => {
    if (current === to) { result.push(path); return; }
    neighbours(current).forEach(next => {
      if (!path.includes(next)) walk(next, [...path, next]);
    });
  };
  walk(from, [from]);
  return result;
}

function graphSvg(graph, options = {}) {
  const ids = graphVertices(graph);
  const start = ids[0];
  const finish = ids[ids.length - 1];
  const lines = graph.edges.map(([a, b]) => {
    const p = nodeXY(graph, a);
    const q = nodeXY(graph, b);
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const x1 = p.x + ux * VIEW.r;
    const y1 = p.y + uy * VIEW.r;
    const x2 = q.x - ux * (VIEW.r + (graph.directed ? 4 : 0));
    const y2 = q.y - uy * (VIEW.r + (graph.directed ? 4 : 0));
    const active = options.activeEdges?.some(edge => edge[0] === a && edge[1] === b);
    return `<line class="g-edge${active ? " active" : ""}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"${graph.directed ? ` marker-end="url(#arrow${active ? "A" : ""})"` : ""}/>`;
  }).join("");
  const nodes = ids.map(id => {
    const p = nodeXY(graph, id);
    const cls = `g-node${id === start ? " start" : ""}${id === finish ? " finish" : ""}${options.active === id ? " active" : ""}`;
    const label = options.labels && options.labels[id] !== undefined
      ? `<circle class="g-badge" cx="${(p.x + 17).toFixed(1)}" cy="${(p.y - 20).toFixed(1)}" r="13"/><text class="g-count" x="${(p.x + 17).toFixed(1)}" y="${(p.y - 15.5).toFixed(1)}">${options.labels[id]}</text>`
      : "";
    return `<circle class="${cls}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${VIEW.r}"/><text class="g-name" x="${p.x.toFixed(1)}" y="${(p.y + 6).toFixed(1)}">${id}</text>${label}`;
  }).join("");
  return `<svg class="graph-svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" role="img" aria-label="Граф: ${edgeText(graph)}">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z" fill="#5f7f89"/></marker>
      <marker id="arrowA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z" fill="#d6336c"/></marker>
    </defs>${lines}${nodes}</svg>`;
}

function edgeText(graph) {
  return graph.edges.map(([a, b]) => `${a}${graph.directed ? "→" : "—"}${b}`).join(", ");
}

// Рисунки добавляются к разборам и заданиям после их построения.
function addExamplePictures() {
  $all(".example-card").forEach((card, index) => {
    const key = examples[index]?.graph;
    if (!key) return;
    const box = document.createElement("div");
    box.className = "graph-box";
    box.innerHTML = graphSvg(GRAPHS[key]);
    $(".example-condition", card).after(box);
  });
}

function addTaskPictures() {
  $all(".task-card").forEach(card => {
    const task = tasks.find(item => item.id === card.dataset.taskId);
    if (!task?.graph) return;
    const box = document.createElement("div");
    box.className = "graph-box";
    box.innerHTML = graphSvg(GRAPHS[task.graph]);
    $("p", card).after(box);
  });
}

// ===== Подписи вершин =====
const lab = { key: LAB_GRAPHS[0], active: null, labels: {}, expected: {} };

function labGraph() { return GRAPHS[lab.key]; }

function drawLab(activeEdges) {
  const graph = labGraph();
  $("#labSvg").outerHTML = graphSvg(graph, { labels: lab.labels, active: lab.active, activeEdges }).replace("<svg ", '<svg id="labSvg" ');
  $("#graphEdges").textContent = `Рёбра: ${edgeText(graph)}.`;
}

function buildLab() {
  const graph = labGraph();
  lab.labels = {};
  lab.active = null;
  lab.expected = countPaths(graph);
  const grid = $("#labelGrid");
  grid.replaceChildren();
  graphVertices(graph).forEach((id, index) => {
    const label = document.createElement("label");
    label.innerHTML = `<span>N(${id})</span><input inputmode="numeric" data-vertex="${id}" aria-label="Подпись вершины ${id}" placeholder="?"${index === 0 ? "" : ""}>`;
    const input = $("input", label);
    input.addEventListener("focus", () => {
      lab.active = id;
      drawLab(incoming(graph, id).map(from => [from, id]));
    });
    input.addEventListener("input", () => input.classList.remove("ok", "bad"));
    grid.append(label);
  });
  $("#labPaths").hidden = true;
  $("#labPaths").replaceChildren();
  drawLab();
  $("#labFeedback").className = "feedback";
  $("#labFeedback").textContent = "Впиши числа и нажми «Проверить». Подсказка покажет, какие стрелки входят в вершину, но не число.";
  $("#verdict").textContent = "Подписывай вершины по порядку: у каждой подпись — сумма подписей вершин, из которых в неё входят стрелки.";
}

function checkLab() {
  const graph = labGraph();
  const inputs = $all("#labelGrid input");
  const filled = inputs.filter(input => input.value.trim() !== "");
  const feedback = $("#labFeedback");
  if (filled.length === 0) {
    feedback.className = "feedback error";
    feedback.textContent = "Сначала впиши хотя бы одну подпись. Начни со старта.";
    return;
  }
  lab.labels = {};
  let bad = 0;
  let missing = 0;
  inputs.forEach(input => {
    const id = input.dataset.vertex;
    if (input.value.trim() === "") { missing += 1; return; }
    const ok = near(numberValue(input.value), lab.expected[id], 0);
    input.classList.toggle("ok", ok);
    input.classList.toggle("bad", !ok);
    if (ok) lab.labels[id] = lab.expected[id]; else bad += 1;
  });
  drawLab();
  const ids = graphVertices(graph);
  const finish = ids[ids.length - 1];
  if (bad === 0 && missing === 0) {
    feedback.className = "feedback success";
    feedback.textContent = `Все подписи верны: из ${ids[0]} в ${finish} ведут ${lab.expected[finish]} путей. Нажми «Показать все пути в финиш» и сравни перечислением.`;
    return;
  }
  feedback.className = "feedback error";
  const wrong = inputs.filter(input => input.classList.contains("bad")).map(input => input.dataset.vertex);
  feedback.textContent = bad > 0
    ? `Неверно у вершин: ${wrong.join(", ")}. Подписывай по порядку: проверь, какие стрелки входят в вершину, и сложи подписи тех вершин. Подсказка поможет.`
    : "Верно пока всё, что вписано. Заполни остальные вершины.";
}

function hintLab() {
  const graph = labGraph();
  const inputs = $all("#labelGrid input");
  const target = inputs.find(input => !input.classList.contains("ok")) || inputs[0];
  const id = target.dataset.vertex;
  const ids = graphVertices(graph);
  lab.active = id;
  const from = incoming(graph, id);
  drawLab(from.map(source => [source, id]));
  const feedback = $("#labFeedback");
  feedback.className = "feedback";
  feedback.textContent = id === ids[0]
    ? `Вершина ${id} — старт: N(${id}) = 1, до неё можно «добраться» единственным способом — ничего не делать.`
    : `В вершину ${id} входят стрелки из: ${from.join(", ")}. Сложи подписи этих вершин: N(${id}) = ${from.map(item => `N(${item})`).join(" + ")}.`;
  target.focus();
}

function showLabPaths() {
  const graph = labGraph();
  const ids = graphVertices(graph);
  const paths = allPaths(graph, ids[0], ids[ids.length - 1]);
  const box = $("#labPaths");
  box.hidden = false;
  box.innerHTML = `<strong>Все пути из ${ids[0]} в ${ids[ids.length - 1]}: ${paths.length}</strong><ol class="paths-list">${paths.map(path => `<li>${path.join(" → ")}</li>`).join("")}</ol>
    <p>Число путей совпадает с подписью финиша: ${lab.expected[ids[ids.length - 1]]}.</p>`;
}

function initLab() {
  const select = $("#graphSelect");
  LAB_GRAPHS.forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = GRAPHS[key].name;
    select.append(option);
  });
  select.addEventListener("change", () => { lab.key = select.value; buildLab(); });
  $("#checkBtn").addEventListener("click", checkLab);
  $("#clearBtn").addEventListener("click", buildLab);
  $("#hintBtn").addEventListener("click", hintLab);
  $("#listBtn").addEventListener("click", showLabPaths);
  buildLab();
}

// ===== Проверка перечислением =====
function initEnumeration() {
  const graphSelect = $("#enumGraph");
  [...LAB_GRAPHS, "g5", "undirected"].forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = GRAPHS[key].name;
    graphSelect.append(option);
  });
  const fillVia = () => {
    const graph = GRAPHS[graphSelect.value];
    const ids = graphVertices(graph);
    const via = $("#enumVia");
    via.replaceChildren();
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "без условия";
    via.append(none);
    ids.slice(1, -1).forEach(id => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `через вершину ${id}`;
      via.append(option);
    });
    $("#enumResult").replaceChildren();
  };
  graphSelect.addEventListener("change", fillVia);
  fillVia();
  $("#enumBtn").addEventListener("click", () => {
    const graph = GRAPHS[graphSelect.value];
    const ids = graphVertices(graph);
    const from = ids[0];
    const to = ids[ids.length - 1];
    const via = $("#enumVia").value;
    const paths = allPaths(graph, from, to);
    const lines = [];
    lines.push(`Рёбра: ${edgeText(graph)}.`);
    lines.push(`Все пути из ${from} в ${to}: ${paths.length}. ${paths.map(path => path.join("→")).join("; ")}.`);
    if (graph.directed) {
      const counts = countPaths(graph);
      lines.push(`Подписи: ${ids.map(id => `N(${id}) = ${counts[id]}`).join("; ")}. Подпись финиша ${counts[to]} совпала с перечислением.`);
    } else {
      lines.push("Граф неориентированный: подписи не применяются, поэтому считаем перебором без повторения вершин.");
    }
    let answer = `${paths.length} путей`;
    if (via) {
      const through = paths.filter(path => path.includes(via));
      const n1 = allPaths(graph, from, via).length;
      const n2 = allPaths(graph, via, to).length;
      lines.push(`Через ${via}: ${n1} путей до ${via} и ${n2} путей от ${via} до ${to}; ${n1} · ${n2} = ${n1 * n2}. Перечислением: ${through.length}.`);
      lines.push(`Не через ${via}: ${paths.length} − ${through.length} = ${paths.length - through.length}.`);
      answer = `через ${via} — ${through.length}, не через ${via} — ${paths.length - through.length}`;
    }
    $("#enumResult").innerHTML = `<strong>Ответ: ${answer}.</strong><ol>${lines.map(line => `<li>${line}</li>`).join("")}</ol>`;
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
  // После сброса заданий перерисовываются только карточки заданий.
  $("#resetProgressBtn").addEventListener("click", () => setTimeout(addTaskPictures, 0));
});
