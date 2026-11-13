"use strict";
// Общий движок веб-тренажёров «9 класс». Содержимое берётся из window.TRAINER (файл data.js).
// Разметка и классы совпадают с прежними тренажёрами, поэтому используется тот же styles.css.

let T; // задаётся в data.js (подключается после engine.js)
const state = { studied: {}, solved: {} };

// ===== Вспомогательные функции (доступны и в data.js) =====
function $(selector, root = document) { return root.querySelector(selector); }
function $all(selector, root = document) { return [...root.querySelectorAll(selector)]; }
function normalize(value) { return String(value ?? "").trim().replaceAll("−", "-").replaceAll(",", "."); }
function num(value) {
  const match = normalize(value).replace(/\s+/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
}
function nums(value) { return (normalize(value).match(/-?\d+(?:\.\d+)?/g) || []).map(Number); }
function near(actual, expected, tolerance = 0.02) {
  return Number.isFinite(actual) && Math.abs(actual - expected) <= Math.max(1e-9, Math.abs(expected) * tolerance, 0.005);
}
function words(value) { return normalize(value).toLowerCase().replaceAll("ё", "е"); }
function compact(value) { return words(value).replace(/[\s*·×^]/g, ""); }
function format(value, digits = 2) {
  return Number(value).toLocaleString("ru-RU", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
function rnd(min, max, step = 1) {
  const count = Math.floor((max - min) / step);
  return +(min + step * Math.floor(Math.random() * (count + 1))).toFixed(6);
}
function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
function esc(text) { return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function code(text) { return `<pre><code>${esc(text.replace(/^\n|\n\s*$/g, ""))}</code></pre>`; }

function key(kind) { return `grade9-${T.id}-${kind}-v1`; }
function loadProgress(kind) {
  try {
    const value = JSON.parse(localStorage.getItem(key(kind)) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch { return {}; }
}
function saveProgress(kind, value) {
  try { localStorage.setItem(key(kind), JSON.stringify(value)); } catch { /* без сохранения */ }
}

// ===== Кабинет: результаты заданий ученика на сервере (PocketBase, /api) =====
const cabinet = { ids: {} };
function cabinetAuth() {
  try {
    const a = JSON.parse(localStorage.getItem("pocketbase_auth") || "null");
    if (!a || !a.token || !a.record || a.record.role !== "student") return null;
    const p = JSON.parse(atob(a.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return p.exp * 1000 > Date.now() ? a : null;
  } catch { return null; }
}
async function cabinetApi(path, method = "GET", body) {
  const r = await fetch("/api" + path, { method, headers: { "Content-Type": "application/json", Authorization: cabinetAuth().token }, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}
async function cabinetLoad() {
  const a = cabinetAuth();
  if (!a) return;
  try {
    const f = encodeURIComponent(`student="${a.record.id}" && kind="trainer" && page="${decodeURIComponent(location.pathname)}"`);
    (await cabinetApi(`/collections/progress/records?perPage=200&filter=${f}`)).items.forEach(it => { cabinet.ids[it.item] = it.id; });
  } catch { /* кабинет недоступен — работаем локально */ }
}
async function cabinetSave(index, answer, correct) {
  const a = cabinetAuth();
  if (!a) return;
  const task = T.tasks[index];
  const shown = task.options ? task.options[Number(answer)] ?? answer : answer;
  const body = { value: `${task.title}: ${shown}`.slice(0, 10000), correct, title: `${T.title} (тренажёр)` };
  try {
    if (cabinet.ids[index]) await cabinetApi(`/collections/progress/records/${cabinet.ids[index]}`, "PATCH", body);
    else cabinet.ids[index] = (await cabinetApi("/collections/progress/records", "POST", { ...body, student: a.record.id, kind: "trainer", page: decodeURIComponent(location.pathname), item: String(index) })).id;
  } catch { /* не критично */ }
}

// ===== Каркас страницы =====
function buildPage() {
  document.title = `${T.title} — тренажёр по предмету «${T.subject}»`;
  const sections = [["theory", "Теория"], ["examples", "Разборы задач"]];
  if (T.algorithm) sections.push(["algorithm", "Алгоритм"]);
  if (T.generators?.length) sections.push(["practice", "Генератор задач"]);
  sections.push(["tasks", "Задания"]);

  const theory = T.theory;
  document.body.innerHTML = `
  <header class="site-header"><div class="header-inner">
    <div class="brand">
      <svg class="brand-icon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" class="ball"/><path d="M20 34l8 8 16-18" class="arrow-line" fill="none"/></svg>
      <div><h1>${T.title}</h1><p>Интерактивный тренажёр · 9 класс · ${T.subject} · Урок ${String(T.lesson).padStart(2, "0")}</p></div>
    </div>
    <button class="theme-toggle" id="themeToggle" type="button" aria-label="Переключить цветовую тему">◐</button>
  </div></header>
  <nav class="section-nav" aria-label="Разделы тренажёра">
    ${sections.map(([id, name], i) => `<button class="nav-btn${i ? "" : " active"}" data-target="${id}" type="button">${name}</button>`).join("")}
  </nav>
  <main class="main-content">
    <section class="content-section active" id="theory">
      <div class="hero-card">
        <div><span class="eyebrow">Главная идея</span><h2>${theory.headline}</h2><p>${theory.lead}</p></div>
        <div class="formula-stack" aria-label="Главное">${theory.formulas.map(f => `<code>${f}</code>`).join("")}</div>
      </div>
      <article class="theory-card" aria-labelledby="formula-symbols">
        <h3 id="formula-symbols">Обозначения в формулах</h3>
        <dl>
          ${theory.symbols.map(([symbol, meaning]) => `<div><dt><b>${symbol}</b></dt><dd>${meaning}</dd></div>`).join("")}
        </dl>
      </article>
      <div class="theory-grid">
        ${theory.cards.map((c, i) => `<article class="theory-card"><span class="card-number">${String(i + 1).padStart(2, "0")}</span><h3>${c[0]}</h3><p>${c[1]}</p></article>`).join("")}
      </div>
      ${theory.notice ? `<div class="notice"><strong>Не путай:</strong> ${theory.notice}</div>` : ""}
    </section>
    <section class="content-section" id="examples">
      <div class="section-heading-row"><div><span class="eyebrow">Решаем вместе</span><h2>Разборы задач</h2></div>
        <div class="score-pill">Изучено: <strong id="exampleScore">0/0</strong></div></div>
      <p class="examples-intro">Сначала попробуй решить задачу сам. Затем открывай шаги разбора по одному и сравнивай свой ход мысли.</p>
      <div class="example-list" id="exampleList"></div>
    </section>
    ${T.algorithm ? `
    <section class="content-section" id="algorithm">
      <div class="section-heading-row"><div><span class="eyebrow">${T.algorithm.eyebrow || "Порядок действий"}</span><h2>Алгоритм решения</h2></div></div>
      <ol class="steps-list">${T.algorithm.steps.map((s, i) => `<li><span>${i + 1}</span><div><h3>${s[0]}</h3><p>${s[1]}</p></div></li>`).join("")}</ol>
    </section>` : ""}
    ${T.generators?.length ? `
    <section class="content-section" id="practice">
      <div class="section-heading-row"><div><span class="eyebrow">Бесконечная тренировка</span><h2>Генератор задач</h2></div>
        <div class="score-pill">Решено подряд: <strong id="streak">0</strong></div></div>
      <p class="tasks-intro">Каждый раз новые числа. Реши, введи ответ, проверь и при необходимости открой разбор.</p>
      <div class="task-grid" id="genGrid"></div>
    </section>` : ""}
    <section class="content-section" id="tasks">
      <div class="section-heading-row"><div><span class="eyebrow">Самостоятельная работа</span><h2>Задания с проверкой</h2></div>
        <div class="score-pill">Верно: <strong id="scoreValue">0/0</strong></div></div>
      <p class="tasks-intro">${T.tasksIntro || "Десятичную дробь можно вводить через запятую или точку. После первой проверки открывается полный разбор задачи."}</p>
      <div class="task-grid" id="taskGrid"></div>
      <div class="button-row final-actions"><button class="btn secondary" id="resetProgressBtn" type="button">Начать задания заново</button></div>
    </section>
  </main>
  <footer class="site-footer"><p>${cabinetAuth() ? "Результаты заданий сохраняются в кабинете ученика." : "Результат заданий хранится в этом браузере. Войди в <a href=\"/app/\">кабинет</a>, чтобы его видел учитель."}</p></footer>`;
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("grade9-theme"); } catch { saved = null; }
  const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) document.documentElement.dataset.theme = "dark";
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("grade9-theme", next); } catch { /* без сохранения темы */ }
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

// ===== Разборы =====
function renderExamples() {
  const list = $("#exampleList");
  T.examples.forEach((example, index) => {
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
    const steps = $(".example-steps", card), answer = $(".example-answer", card);
    const next = $(".example-next", card), all = $(".example-all", card), progress = $(".example-progress", card);
    let shown = 0;
    const update = () => {
      const finished = shown >= example.steps.length;
      progress.textContent = `Шагов: ${shown}/${example.steps.length}`;
      next.textContent = shown === 0 ? "Показать первый шаг" : "Показать следующий шаг";
      next.disabled = all.disabled = finished;
      answer.hidden = !finished;
      if (finished) {
        answer.innerHTML = `Ответ: ${example.answer}`;
        if (!state.studied[index]) { state.studied[index] = true; saveProgress("examples", state.studied); updateExampleScore(); }
      }
    };
    const showStep = () => {
      if (shown >= example.steps.length) return;
      const [title, body] = example.steps[shown];
      const item = document.createElement("li");
      item.innerHTML = `<b>${title}</b>${body}`;
      steps.append(item);
      shown += 1;
      update();
    };
    next.addEventListener("click", showStep);
    all.addEventListener("click", () => { while (shown < example.steps.length) showStep(); });
    update();
    list.append(card);
  });
  updateExampleScore();
}
function updateExampleScore() {
  $("#exampleScore").textContent = `${T.examples.filter((_, i) => state.studied[i]).length}/${T.examples.length}`;
}

// ===== Задания =====
function answerControl(task, index, value) {
  if (task.options) {
    return `<div class="choice-list" role="radiogroup" aria-label="Варианты ответа к задаче ${index + 1}">
      ${task.options.map((o, i) => `<label class="choice"><input type="radio" name="task${index}" value="${i}"${String(value) === String(i) ? " checked" : ""}><span>${o}</span></label>`).join("")}</div>`;
  }
  const safe = String(value ?? "").replaceAll('"', "&quot;");
  return `<input class="task-answer" aria-label="Ответ на задачу ${index + 1}" placeholder="${task.placeholder || "ответ"}" value="${safe}">`;
}
function readAnswer(task, card) {
  if (task.options) return $("input[type=radio]:checked", card)?.value ?? "";
  return $(".task-answer", card).value;
}
function isCorrect(task, value) {
  if (!String(value ?? "").trim()) return false;
  if (task.options) return Number(value) === task.correct;
  return task.check(value);
}
function renderTasks() {
  const grid = $("#taskGrid");
  grid.replaceChildren();
  T.tasks.forEach((task, index) => {
    const saved = state.solved[index];
    const card = document.createElement("article");
    card.className = `task-card${saved ? " completed" : ""}`;
    card.innerHTML = `
      <div class="task-topline"><span class="task-number">Задача ${index + 1}</span><span class="task-type">${task.type}</span></div>
      <h3>${task.title}</h3>
      <p>${task.text}</p>
      ${task.options ? `${answerControl(task, index, saved?.answer)}<div class="answer-row"><button class="btn primary task-check" type="button">Проверить</button></div>`
        : `<div class="answer-row">${answerControl(task, index, saved?.answer)}<button class="btn primary task-check" type="button">Проверить</button></div>`}
      <button class="hint-toggle" type="button">Показать подсказку</button>
      <button class="solution-toggle" type="button" ${saved ? "" : "disabled"}>Показать разбор</button>
      <p class="task-hint" hidden>${task.hint}</p>
      <div class="task-solution" hidden>${task.solution.map(l => `<p>${l}</p>`).join("")}</div>
      <div class="task-feedback${saved ? " success" : ""}" aria-live="polite">${saved ? `Верно. ${task.answerText}` : "Ответ ещё не проверен."}</div>`;
    const feedback = $(".task-feedback", card);
    const check = () => {
      const value = readAnswer(task, card);
      if (!String(value).trim()) {
        feedback.className = "task-feedback error";
        feedback.textContent = "Сначала запиши собственный ответ.";
        return;
      }
      $(".solution-toggle", card).disabled = false;
      if (isCorrect(task, value)) {
        state.solved[index] = { answer: value };
        card.classList.add("completed");
        feedback.className = "task-feedback success";
        feedback.textContent = `Верно. ${task.answerText}`;
      } else {
        delete state.solved[index];
        card.classList.remove("completed");
        feedback.className = "task-feedback error";
        feedback.textContent = "Пока неверно. Открой подсказку, проверь рассуждение и единицы, затем попробуй ещё раз. Полный разбор доступен по кнопке ниже.";
      }
      saveProgress("tasks", state.solved);
      updateScore();
      cabinetSave(index, value, isCorrect(task, value));
    };
    $(".task-check", card).addEventListener("click", check);
    $(".task-answer", card)?.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
    $(".hint-toggle", card).addEventListener("click", e => {
      const hint = $(".task-hint", card);
      hint.hidden = !hint.hidden;
      e.currentTarget.textContent = hint.hidden ? "Показать подсказку" : "Скрыть подсказку";
    });
    $(".solution-toggle", card).addEventListener("click", e => {
      const box = $(".task-solution", card);
      box.hidden = !box.hidden;
      e.currentTarget.textContent = box.hidden ? "Показать разбор" : "Скрыть разбор";
    });
    grid.append(card);
  });
  updateScore();
}
function updateScore() {
  $("#scoreValue").textContent = `${T.tasks.filter((_, i) => state.solved[i]).length}/${T.tasks.length}`;
}

// ===== Генератор задач =====
function renderGenerators() {
  const grid = $("#genGrid");
  if (!grid) return;
  let streak = 0;
  T.generators.forEach((gen, index) => {
    const card = document.createElement("article");
    card.className = "task-card";
    grid.append(card);
    const fresh = () => {
      const p = gen.make();
      card.classList.remove("completed");
      card.innerHTML = `
        <div class="task-topline"><span class="task-number">Тип ${index + 1}</span><span class="task-type">${gen.type}</span></div>
        <h3>${gen.title}</h3>
        <p>${p.text}</p>
        <div class="answer-row"><input class="task-answer" placeholder="${p.placeholder || "число"}" aria-label="Ответ"><button class="btn primary task-check" type="button">Проверить</button></div>
        <button class="solution-toggle" type="button" disabled>Показать разбор</button>
        <button class="hint-toggle gen-next" type="button">Новая задача</button>
        <div class="task-solution" hidden>${p.solution.map(l => `<p>${l}</p>`).join("")}</div>
        <div class="task-feedback" aria-live="polite">Реши и проверь ответ.</div>`;
      const input = $(".task-answer", card), feedback = $(".task-feedback", card);
      const ok = p.check || (v => near(num(v), p.answer, p.tol ?? 0.02));
      const check = () => {
        if (!input.value.trim()) { feedback.className = "task-feedback error"; feedback.textContent = "Сначала запиши ответ."; return; }
        $(".solution-toggle", card).disabled = false;
        if (ok(input.value)) {
          streak += 1;
          card.classList.add("completed");
          feedback.className = "task-feedback success";
          feedback.textContent = `Верно. Ответ: ${p.answerText}.`;
        } else {
          streak = 0;
          feedback.className = "task-feedback error";
          feedback.textContent = "Пока неверно. Проверь вычисления или открой разбор.";
        }
        $("#streak").textContent = streak;
      };
      $(".task-check", card).addEventListener("click", check);
      input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
      $(".solution-toggle", card).addEventListener("click", e => {
        const box = $(".task-solution", card);
        box.hidden = !box.hidden;
        e.currentTarget.textContent = box.hidden ? "Показать разбор" : "Скрыть разбор";
      });
      $(".gen-next", card).addEventListener("click", fresh);
    };
    fresh();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  T = window.TRAINER;
  state.studied = loadProgress("examples");
  state.solved = loadProgress("tasks");
  buildPage();
  initTheme();
  initNavigation();
  renderExamples();
  renderGenerators();
  renderTasks();
  cabinetLoad();
  $("#resetProgressBtn").addEventListener("click", () => {
    state.solved = {};
    saveProgress("tasks", state.solved);
    renderTasks();
  });
});
