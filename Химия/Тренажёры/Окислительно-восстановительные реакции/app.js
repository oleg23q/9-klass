const reactions = [
  {
    label: 'CuO + H₂ → Cu + H₂O',
    donor: { from: 'H₂: 0', to: 'H: +1', electrons: 'Молекула H₂ отдаёт 2e⁻', role: 'H₂ — восстановитель' },
    acceptor: { from: 'Cu: +2', to: 'Cu: 0', electrons: 'Cu²⁺ принимает 2e⁻', role: 'CuO — окислитель' },
    count: 'передано 2 электрона',
    hint: 'Водород окисляется, а медь восстанавливается. Наличие кислорода само по себе не определяет название процесса.'
  },
  {
    label: 'Zn + 2HCl → ZnCl₂ + H₂',
    donor: { from: 'Zn: 0', to: 'Zn: +2', electrons: 'Zn отдаёт 2e⁻', role: 'Zn — восстановитель' },
    acceptor: { from: '2H: +1', to: 'H₂: 0', electrons: 'Два H⁺ принимают 2e⁻', role: 'H⁺ в HCl — окислитель' },
    count: 'передано 2 электрона',
    hint: 'Хлор сохраняет степень окисления −1 и в электронном обмене не участвует.'
  },
  {
    label: '2Al + 3CuO → Al₂O₃ + 3Cu',
    donor: { from: 'Al: 0', to: 'Al: +3', electrons: 'Два Al отдают 6e⁻', role: 'Al — восстановитель' },
    acceptor: { from: 'Cu: +2', to: 'Cu: 0', electrons: 'Три Cu²⁺ принимают 6e⁻', role: 'CuO — окислитель' },
    count: 'передано 6 электронов',
    hint: 'Один Al отдаёт 3e⁻, один Cu²⁺ принимает 2e⁻. Наименьшее общее кратное равно 6.'
  }
];

const balances = [
  {
    name: 'Al + CuO → Al₂O₃ + Cu',
    substances: ['Al', 'CuO', 'Al₂O₃', 'Cu'],
    split: 2,
    expected: [2, 3, 1, 3],
    halves: ['Al⁰ − 3e⁻ → Al⁺³   | ×2', 'Cu⁺² + 2e⁻ → Cu⁰   | ×3'],
    lcm: 'НОК(3, 2) = 6. Значит, атомов Al нужно 2, а атомов Cu — 3.',
    explanation: '2Al + 3CuO → Al₂O₃ + 3Cu. Все атомы: Al 2, Cu 3, O 3.'
  },
  {
    name: 'Fe₂O₃ + CO → Fe + CO₂',
    substances: ['Fe₂O₃', 'CO', 'Fe', 'CO₂'],
    split: 2,
    expected: [1, 3, 2, 3],
    halves: ['Fe⁺³ + 3e⁻ → Fe⁰   | ×2', 'C⁺² − 2e⁻ → C⁺⁴   | ×3'],
    lcm: 'НОК(3, 2) = 6. Два атома Fe принимают 6e⁻, три атома C отдают 6e⁻.',
    explanation: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂. Fe восстанавливается, C окисляется.'
  },
  {
    name: 'Ca + O₂ → CaO',
    substances: ['Ca', 'O₂', 'CaO'],
    split: 2,
    expected: [2, 1, 2],
    halves: ['Ca⁰ − 2e⁻ → Ca⁺²   | ×2', 'O₂⁰ + 4e⁻ → 2O⁻²   | ×1'],
    lcm: 'Два атома Ca отдают 4e⁻, молекула O₂ принимает 4e⁻.',
    explanation: '2Ca + O₂ → 2CaO. Ca — восстановитель, O₂ — окислитель.'
  }
];

const tasks = [
  { q: 'Степень окисления Fe в простом веществе Fe', options: ['0', '+2', '+3'], answer: 0, why: 'В простом веществе степень окисления элемента равна 0.' },
  { q: 'Степень окисления S в SO₃', options: ['+3', '+6', '−2'], answer: 1, why: 'x + 3·(−2) = 0, поэтому x = +6.' },
  { q: 'Что происходит при отдаче электронов?', options: ['Восстановление', 'Окисление', 'Нейтрализация'], answer: 1, why: 'Отдача электронов — окисление; степень окисления повышается.' },
  { q: 'Кто принимает электроны?', options: ['Окислитель', 'Восстановитель', 'Катализатор'], answer: 0, why: 'Окислитель принимает электроны и сам восстанавливается.' },
  { q: 'Какая реакция является ОВР?', options: ['HCl + NaOH → NaCl + H₂O', '2Mg + O₂ → 2MgO', 'AgNO₃ + NaCl → AgCl + NaNO₃'], answer: 1, why: 'Mg: 0→+2, O: 0→−2. В остальных вариантах степени окисления не меняются.' },
  { q: 'В Zn + 2HCl → ZnCl₂ + H₂ цинк…', options: ['принимает 2e⁻', 'отдаёт 2e⁻', 'не меняется'], answer: 1, why: 'Zn: 0→+2, поэтому он отдаёт 2e⁻ и окисляется.' },
  { q: 'Множители для переходов Al − 3e⁻ и Cu + 2e⁻', options: ['Al ×2, Cu ×3', 'Al ×3, Cu ×2', 'оба ×1'], answer: 0, why: 'НОК(3,2)=6: 3·2=6 и 2·3=6.' },
  { q: 'Верное законченное уравнение Al + CuO', options: ['Al + CuO → AlO + Cu', '2Al + 3CuO → Al₂O₃ + 3Cu', '3Al + 2CuO → Al₃O₂ + 2Cu'], answer: 1, why: 'Баланс электронов даёт 2 Al и 3 Cu; формулы веществ не изменяются.' }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function showSection(id) {
  $$('.nav-btn').forEach(button => button.classList.toggle('active', button.dataset.target === id));
  $$('.content-section').forEach(section => section.classList.toggle('active', section.id === id));
}

$$('.nav-btn').forEach(button => button.addEventListener('click', () => showSection(button.dataset.target)));

const storedTheme = localStorage.getItem('redox-theme');
if (storedTheme === 'dark') document.documentElement.dataset.theme = 'dark';
$('#themeToggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('redox-theme', next);
});

function fillReactionSelect() {
  $('#reactionSelect').innerHTML = reactions.map((reaction, index) => `<option value="${index}">${reaction.label}</option>`).join('');
  $('#reactionSelect').addEventListener('change', renderTransfer);
  renderTransfer();
}

function renderTransfer() {
  const reaction = reactions[Number($('#reactionSelect').value || 0)];
  $('#reactionLine').textContent = reaction.label;
  $('#donorFrom').textContent = reaction.donor.from;
  $('#donorTo').textContent = reaction.donor.to;
  $('#donorElectrons').textContent = reaction.donor.electrons;
  $('#donorRole').textContent = reaction.donor.role;
  $('#acceptorFrom').textContent = reaction.acceptor.from;
  $('#acceptorTo').textContent = reaction.acceptor.to;
  $('#acceptorElectrons').textContent = reaction.acceptor.electrons;
  $('#acceptorRole').textContent = reaction.acceptor.role;
  $('#electronCount').textContent = reaction.count;
  $('#transferHint').textContent = reaction.hint;
}

function fillBalanceSelect() {
  $('#balanceSelect').innerHTML = balances.map((balance, index) => `<option value="${index}">${balance.name}</option>`).join('');
  $('#balanceSelect').addEventListener('change', renderBalance);
  $('#checkBalance').addEventListener('click', checkBalance);
  $('#showBalanceHint').addEventListener('click', () => {
    const balance = balances[Number($('#balanceSelect').value || 0)];
    setBalanceFeedback(balance.lcm, 'neutral');
  });
  renderBalance();
}

function renderBalance() {
  const balance = balances[Number($('#balanceSelect').value || 0)];
  $('#halfReactions').innerHTML = balance.halves.map(text => `<div class="half-row">${text}</div>`).join('');
  $('#lcmHint').textContent = 'Сначала добейся равенства числа электронов.';
  const pieces = [];
  balance.substances.forEach((formula, index) => {
    if (index === balance.split) pieces.push('<span class="operator">→</span>');
    else if (index > 0) pieces.push('<span class="operator">+</span>');
    pieces.push(`<label class="coefficient-item"><span class="sr-only">Коэффициент перед ${formula}</span><input type="number" min="1" max="12" value="1" data-coefficient="${index}" aria-label="Коэффициент перед ${formula}"><strong>${formula}</strong></label>`);
  });
  $('#coefficientEditor').innerHTML = pieces.join('');
  setBalanceFeedback('Начни с равенства отданных и принятых электронов.', 'neutral');
}

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return Math.abs(a);
}

function normalized(values) {
  const divisor = values.reduce((result, value) => gcd(result, value));
  return values.map(value => value / divisor);
}

function checkBalance() {
  const balance = balances[Number($('#balanceSelect').value || 0)];
  const values = $$('[data-coefficient]').map(input => Number(input.value));
  if (values.some(value => !Number.isInteger(value) || value < 1)) {
    setBalanceFeedback('Все коэффициенты должны быть положительными целыми числами.', 'wrong');
    return;
  }
  const answer = normalized(values);
  const correct = answer.every((value, index) => value === balance.expected[index]);
  setBalanceFeedback(correct ? `Верно. ${balance.explanation}` : 'Пока не совпало. Сверь множители электронного баланса, затем проверь число атомов каждого элемента.', correct ? 'correct' : 'wrong');
}

function setBalanceFeedback(text, type) {
  const box = $('#balanceFeedback');
  box.textContent = text;
  box.className = `feedback ${type}`;
}

let answers = {};
try { answers = JSON.parse(localStorage.getItem('redox-answers') || '{}'); } catch { answers = {}; }

function renderTasks() {
  $('#taskGrid').innerHTML = tasks.map((task, index) => {
    const selected = answers[index];
    const options = task.options.map((option, optionIndex) => {
      let state = '';
      if (selected !== undefined) {
        if (optionIndex === task.answer) state = ' correct';
        else if (optionIndex === selected) state = ' wrong';
      }
      return `<button class="option${state}" type="button" data-task="${index}" data-option="${optionIndex}" ${selected !== undefined ? 'disabled' : ''}>${option}</button>`;
    }).join('');
    const feedback = selected === undefined ? 'Выбери один ответ.' : `${selected === task.answer ? 'Верно.' : 'Неверно.'} ${task.why}`;
    return `<article class="task-card"><span class="task-number">Задание ${index + 1}</span><h3>${task.q}</h3><div class="option-list">${options}</div><p class="task-feedback">${feedback}</p></article>`;
  }).join('');
  $$('[data-task]').forEach(button => button.addEventListener('click', answerTask));
  updateScore();
}

function answerTask(event) {
  const taskIndex = Number(event.currentTarget.dataset.task);
  answers[taskIndex] = Number(event.currentTarget.dataset.option);
  localStorage.setItem('redox-answers', JSON.stringify(answers));
  renderTasks();
}

function updateScore() {
  const score = tasks.reduce((total, task, index) => total + (answers[index] === task.answer ? 1 : 0), 0);
  $('#score').textContent = `${score}/${tasks.length}`;
}

$('#resetProgress').addEventListener('click', () => {
  answers = {};
  localStorage.removeItem('redox-answers');
  renderTasks();
});

fillReactionSelect();
fillBalanceSelect();
renderTasks();
