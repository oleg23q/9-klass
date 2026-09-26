/* ============================================================
   Тренажёр: Знаковые и табличные модели — 9 класс
   Логика: генерация графов, визуализация, матрицы, проверка,
   пошаговое решение, блоки ОГЭ и повышенной сложности в стиле ЕГЭ
   ============================================================ */

'use strict';

// ==================== STATE ====================
const state = {
  graphType: 'undirected-unweighted', // undirected-unweighted | directed-unweighted | undirected-weighted | directed-weighted
  answerMode: 'adjacency', // adjacency | weight
  vertexCount: 5,
  vertices: [],
  edges: [],
  currentTask: null,
  isDirected: false,
  isWeighted: false,
};

// ==================== UTILS ====================
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// ==================== GRAPH GENERATION ====================
function generateGraph() {
  const n = state.vertexCount;
  state.vertices = LETTERS.slice(0, n);
  state.isDirected = state.graphType.startsWith('directed');
  state.isWeighted = state.graphType.includes('-weighted');

  // Generate edges — ensure connected graph with some extra edges
  const allPairs = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        allPairs.push([i, j]);
      }
    }
  }

  // For undirected: only consider i < j
  const candidatePairs = state.isDirected
    ? allPairs
    : allPairs.filter(([i, j]) => i < j);

  // Number of edges: enough to be connected + some extra
  const minEdges = n - 1; // spanning tree
  const maxEdges = Math.min(candidatePairs.length, Math.floor(n * (n - 1) / 2));
  const edgeCount = randInt(minEdges, Math.max(minEdges + 1, Math.min(maxEdges, minEdges + n)));

  const shuffled = shuffle(candidatePairs);
  const selected = shuffled.slice(0, edgeCount);

  // Ensure graph is connected (add missing tree edges)
  // Build adjacency for connectivity check
  const adj = Array.from({ length: n }, () => []);
  selected.forEach(([i, j]) => {
    adj[i].push(j);
    adj[j].push(i);
  });

  // BFS to check connectivity
  const visited = new Array(n).fill(false);
  const queue = [0];
  visited[0] = true;
  while (queue.length > 0) {
    const v = queue.shift();
    adj[v].forEach(u => {
      if (!visited[u]) {
        visited[u] = true;
        queue.push(u);
      }
    });
  }

  // If not connected, add edges to connect components
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      // Find a visited vertex to connect to
      for (let j = 0; j < n; j++) {
        if (visited[j]) {
          const pair = state.isDirected ? [j, i] : [Math.min(j, i), Math.max(j, i)];
          selected.push(pair);
          adj[j].push(i);
          adj[i].push(j);
          visited[i] = true;
          // Mark component of i as visited
          const q2 = [i];
          while (q2.length > 0) {
            const v = q2.shift();
            adj[v].forEach(u => {
              if (!visited[u]) {
                visited[u] = true;
                q2.push(u);
              }
            });
          }
          break;
        }
      }
    }
  }

  // Build edge objects
  state.edges = selected.map(([i, j]) => {
    const weight = state.isWeighted ? randInt(2, 20) : 1;
    return { from: i, to: j, weight };
  });

  // Build correct matrix
  state.currentTask = buildMatrix();
}

function buildMatrix() {
  const n = state.vertexCount;
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));

  state.edges.forEach(edge => {
    matrix[edge.from][edge.to] = state.isWeighted ? edge.weight : 1;
    if (!state.isDirected) {
      matrix[edge.to][edge.from] = state.isWeighted ? edge.weight : 1;
    }
  });

  return matrix;
}

// ==================== GRAPH VISUALIZATION ====================
function getVertexPositions(n) {
  const cx = 200, cy = 200, r = 140;
  const positions = [];
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    positions.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    });
  }
  return positions;
}

function renderGraph(svgEl, vertices, edges, isDirected, isWeighted, highlightEdge) {
  const n = vertices.length;
  const positions = getVertexPositions(n);
  const cx = 200, cy = 200;

  let svgContent = '';

  // Arrow marker
  svgContent += `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-text-muted)" />
      </marker>
      <marker id="arrowhead-highlight" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-primary)" />
      </marker>
    </defs>
  `;

  // Draw edges
  edges.forEach((edge, idx) => {
    const from = positions[edge.from];
    const to = positions[edge.to];

    // Shorten edge to not overlap with vertex circles
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const nodeR = 22;
    const ux = dx / dist;
    const uy = dy / dist;

    const x1 = from.x + ux * nodeR;
    const y1 = from.y + uy * nodeR;
    const x2 = to.x - ux * nodeR;
    const y2 = to.y - uy * nodeR;

    const isHighlight = highlightEdge === idx;
    const edgeClass = isHighlight ? 'graph-edge graph-edge-directed' : 'graph-edge';
    const marker = isDirected ? ` marker-end="url(#${isHighlight ? 'arrowhead-highlight' : 'arrowhead'})"` : '';

    // For undirected with both directions, draw a single line
    // For directed, check if reverse edge exists
    let isDoubleDirected = false;
    if (isDirected) {
      const reverseExists = edges.some(e => e.from === edge.to && e.to === edge.from);
      if (reverseExists) {
        // Draw curved line
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const perpX = -(y2 - y1) / dist * 20;
        const perpY = (x2 - x1) / dist * 20;
        svgContent += `<path d="M ${x1} ${y1} Q ${mx + perpX} ${my + perpY} ${x2} ${y2}" class="${edgeClass}" stroke="${isHighlight ? 'var(--color-primary)' : 'var(--color-text-muted)'}" stroke-width="${isHighlight ? 3 : 2}"${marker} />`;
        isDoubleDirected = true;
      }
    }

    if (!isDoubleDirected) {
      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${edgeClass}" stroke="${isHighlight ? 'var(--color-primary)' : 'var(--color-text-muted)'}" stroke-width="${isHighlight ? 3 : 2}"${marker} />`;
    }

    // Edge weight label
    if (isWeighted && edge.weight) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const offset = isDoubleDirected ? 20 : 0;
      const perpX = -(y2 - y1) / dist * offset;
      const perpY = (x2 - x1) / dist * offset;
      const labelX = mx + perpX;
      const labelY = my + perpY;

      svgContent += `<rect x="${labelX - 14}" y="${labelY - 10}" width="28" height="20" rx="4" class="graph-edge-label-bg" />`;
      svgContent += `<text x="${labelX}" y="${labelY}" class="graph-edge-label" text-anchor="middle" dominant-baseline="central">${edge.weight}</text>`;
    }
  });

  // Draw vertices
  vertices.forEach((v, i) => {
    const pos = positions[i];
    svgContent += `<circle cx="${pos.x}" cy="${pos.y}" r="20" class="graph-vertex" />`;
    svgContent += `<text x="${pos.x}" y="${pos.y}" class="graph-vertex-label">${v}</text>`;
  });

  svgEl.innerHTML = svgContent;
}

function renderGraphLegend() {
  const legend = document.getElementById('graphLegend');
  let html = `<strong>Тип:</strong> ${state.isDirected ? 'Ориентированный' : 'Неориентированный'} граф`;
  html += `, ${state.isWeighted ? 'взвешенный' : 'невзвешенный'}`;
  html += `<br><strong>Вершин:</strong> ${state.vertexCount}, <strong>Рёбер:</strong> ${state.edges.length}`;
  if (state.isDirected) {
    html += `<br><em>Стрелки показывают направление рёбер</em>`;
  }
  legend.innerHTML = html;
}

// ==================== MATRIX TABLE ====================
function renderMatrixTable(tableEl, vertices, matrix, editable, n) {
  let html = '';
  // Header row
  html += '<thead><tr>';
  html += '<th class="corner-cell"></th>';
  vertices.forEach(v => {
    html += `<th>${v}</th>`;
  });
  html += '</tr></thead><tbody>';

  for (let i = 0; i < n; i++) {
    html += '<tr>';
    html += `<th>${vertices[i]}</th>`;
    for (let j = 0; j < n; j++) {
      const isDiagonal = i === j;
      if (editable) {
        const cellClass = isDiagonal ? 'diagonal-cell' : '';
        const val = isDiagonal ? '0' : '';
        html += `<td class="${cellClass}"><input type="text" maxlength="3" value="${val}" data-row="${i}" data-col="${j}" ${isDiagonal ? 'readonly' : ''} /></td>`;
      } else {
        const val = matrix[i][j];
        html += `<td>${val}</td>`;
      }
    }
    html += '</tr>';
  }
  html += '</tbody>';
  tableEl.innerHTML = html;
}

// ==================== TASK TEXT ====================
function generateTaskText() {
  const typeStr = state.isDirected ? 'ориентированный' : 'неориентированный';
  const weightStr = state.isWeighted ? 'взвешенный' : 'невзвешенный';
  const modeStr = state.answerMode === 'adjacency' ? 'матрицу смежности' : 'весовую матрицу';

  let task = `На рисунке изображён ${typeStr} ${weightStr} граф с ${state.vertexCount} вершинами: ${state.vertices.join(', ')}. `;
  task += `Заполните ${modeStr} для этого графа. `;

  if (state.answerMode === 'adjacency') {
    task += `В ячейке ставьте 1, если между вершинами есть ребро, и 0 — если нет. По диагонали всегда 0.`;
  } else {
    task += `В ячейке ставьте вес ребра (число), если ребро есть, и 0 — если нет. По диагонали всегда 0.`;
  }

  if (!state.isDirected) {
    task += ` Граф неориентированный — матрица должна быть симметричной.`;
  } else {
    task += ` Граф ориентированный — учитывайте направление рёбер: строка — откуда, столбец — куда.`;
  }

  return task;
}

// ==================== CHECK ANSWERS ====================
function checkAnswers() {
  const table = document.getElementById('matrixTable');
  const inputs = table.querySelectorAll('input');
  const correctMatrix = state.currentTask;
  const n = state.vertexCount;
  let correct = 0;
  let total = 0;
  const errors = [];

  // Clear previous classes
  inputs.forEach(inp => {
    inp.classList.remove('cell-correct', 'cell-wrong');
  });

  inputs.forEach(inp => {
    const row = parseInt(inp.dataset.row);
    const col = parseInt(inp.dataset.col);
    if (row === col) return; // skip diagonal

    total++;
    const userVal = inp.value.trim();
    const correctVal = correctMatrix[row][col];

    if (userVal === String(correctVal)) {
      correct++;
      inp.classList.add('cell-correct');
    } else {
      inp.classList.add('cell-wrong');
      const fromV = state.vertices[row];
      const toV = state.vertices[col];
      const correctDisplay = correctVal === 0 ? '0' : String(correctVal);
      let reason;
      if (correctVal === 0) {
        reason = `Между ${fromV} и ${toV} нет ребра → 0`;
      } else if (state.answerMode === 'adjacency') {
        reason = `Между ${fromV} и ${toV} есть ребро → 1`;
      } else {
        reason = `Между ${fromV} и ${toV} есть ребро весом ${correctVal}`;
      }
      errors.push({
        cell: `${fromV}→${toV}`,
        user: userVal || '—',
        correct: correctDisplay,
        reason
      });
    }
  });

  const resultBox = document.getElementById('resultBox');
  if (correct === total) {
    resultBox.className = 'result-box success';
    resultBox.innerHTML = `Отлично! Все ${total} ячеек заполнены верно!`;
  } else {
    resultBox.className = 'result-box error';
    let html = `Верно: ${correct} из ${total}. Ошибки:<br>`;
    errors.slice(0, 5).forEach(err => {
      html += `<div style="margin-top:4px"><strong>${err.cell}</strong>: ваш ответ «${err.user}», правильно «${err.correct}». ${err.reason}</div>`;
    });
    if (errors.length > 5) {
      html += `<div style="margin-top:4px">...и ещё ${errors.length - 5} ошибок</div>`;
    }
    resultBox.innerHTML = html;
  }
}

// ==================== HINT ====================
function showHint() {
  const hintPanel = document.getElementById('hintPanel');
  const hintContent = document.getElementById('hintContent');
  const n = state.vertexCount;
  const correctMatrix = state.currentTask;

  // Count edges in matrix
  let edgeCount = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (correctMatrix[i][j] !== 0) edgeCount++;
    }
  }

  let hints = [];
  hints.push(`<strong>Подсказки:</strong>`);
  hints.push(`• Граф ${state.isDirected ? 'ориентированный' : 'неориентированный'}${state.isWeighted ? ', взвешенный' : ', невзвешенный'}.`);
  hints.push(`• Вершин: ${n}, рёбер: ${state.edges.length}.`);
  hints.push(`• По диагонали везде 0 (путь из вершины в саму себя).`);

  if (!state.isDirected) {
    hints.push(`• Матрица симметрична: M[i][j] = M[j][i].`);
    hints.push(`• В матрице всего ${edgeCount} ненулевых ячеек (по 2 на каждое ребро).`);
  } else {
    hints.push(`• Каждое ориентированное ребро даёт одну ненулевую ячейку.`);
    hints.push(`• В матрице всего ${edgeCount} ненулевых ячеек.`);
  }

  if (state.isWeighted) {
    hints.push(`• В ячейках стоят веса рёбер, а не единицы.`);
  }

  // Give one specific edge as hint
  const firstEdge = state.edges[0];
  if (firstEdge) {
    const from = state.vertices[firstEdge.from];
    const to = state.vertices[firstEdge.to];
    if (state.isWeighted) {
      hints.push(`• Например: ребро ${from}→${to} имеет вес ${firstEdge.weight}.`);
    } else {
      hints.push(`• Например: между ${from} и ${to} есть ребро → в ячейке стоит 1.`);
    }
  }

  hintContent.innerHTML = hints.map(h => `<p>${h}</p>`).join('');
  hintPanel.hidden = false;
}

// ==================== STEP-BY-STEP SOLUTION ====================
function showStepByStepSolution() {
  const stepsPanel = document.getElementById('stepsPanel');
  const stepsContent = document.getElementById('stepsContent');
  const correctMatrix = state.currentTask;
  const n = state.vertexCount;

  let steps = [];
  steps.push(`<strong>Шаг 1.</strong> Выписываем вершины: ${state.vertices.join(', ')}.`);
  steps.push(`Создаём таблицу ${n}×${n}. Строки и столбцы подписываем буквами вершин.`);

  steps.push(`<strong>Шаг 2.</strong> Заполняем диагональ нулями (путь из вершины в саму себя не учитывается).`);

  // List edges
  let edgeList = state.edges.map(e => {
    const from = state.vertices[e.from];
    const to = state.vertices[e.to];
    if (state.isWeighted) {
      return `${from}→${to} (вес ${e.weight})`;
    }
    return `${from}—${to}`;
  });
  steps.push(`<strong>Шаг 3.</strong> Рёбра графа: ${edgeList.join(', ')}.`);

  steps.push(`<strong>Шаг 4.</strong> Для каждой пары вершин проверяем наличие ребра:`);

  // Build step-by-step explanation for each edge
  let fillSteps = [];
  state.edges.forEach(edge => {
    const from = state.vertices[edge.from];
    const to = state.vertices[edge.to];
    const val = state.isWeighted ? edge.weight : 1;
    fillSteps.push(`Ребро ${from}→${to}: в ячейку [${from}, ${to}] ставим ${val}.`);
    if (!state.isDirected) {
      fillSteps.push(`Ребро ${to}→${from} (обратное): в ячейку [${to}, ${from}] ставим ${val} (симметрия).`);
    }
  });

  // Missing edges
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      if (correctMatrix[i][j] === 0) {
        // Check if this is a "missing" pair worth mentioning
        if (!state.isDirected && i < j) {
          fillSteps.push(`Между ${state.vertices[i]} и ${state.vertices[j]} нет ребра → 0.`);
        } else if (state.isDirected) {
          // Only mention some missing edges
        }
      }
    }
  }

  steps.push(fillSteps.map(s => `• ${s}`).join('<br>'));

  steps.push(`<strong>Шаг 5.</strong> ${state.isDirected ? 'Граф ориентированный — направление важно.' : 'Проверяем симметрию: M[i][j] = M[j][i] — выполняется.'}`);

  steps.push(`<strong>Шаг 6.</strong> Итоговая матрица:`);
  let matrixHtml = '<table class="matrix-table" style="margin-top:8px"><thead><tr><th class="corner-cell"></th>';
  state.vertices.forEach(v => matrixHtml += `<th>${v}</th>`);
  matrixHtml += '</tr></thead><tbody>';
  for (let i = 0; i < n; i++) {
    matrixHtml += '<tr>';
    matrixHtml += `<th>${state.vertices[i]}</th>`;
    for (let j = 0; j < n; j++) {
      matrixHtml += `<td>${correctMatrix[i][j]}</td>`;
    }
    matrixHtml += '</tr>';
  }
  matrixHtml += '</tbody></table>';
  steps.push(matrixHtml);

  stepsContent.innerHTML = steps.map(s => `<p>${s}</p>`).join('');
  stepsPanel.hidden = false;
}

// ==================== CLEAR ====================
function clearMatrix() {
  const table = document.getElementById('matrixTable');
  const inputs = table.querySelectorAll('input');
  inputs.forEach(inp => {
    inp.classList.remove('cell-correct', 'cell-wrong', 'cell-hint');
    if (!inp.readOnly) {
      inp.value = '';
    }
  });
  document.getElementById('resultBox').className = '';
  document.getElementById('resultBox').innerHTML = '';
  document.getElementById('hintPanel').hidden = true;
  document.getElementById('stepsPanel').hidden = true;
}

// ==================== NEW TASK ====================
function newTask() {
  generateGraph();
  renderGraph(document.getElementById('graphSvg'), state.vertices, state.edges, state.isDirected, state.isWeighted);
  renderGraphLegend();
  renderMatrixTable(document.getElementById('matrixTable'), state.vertices, state.currentTask, true, state.vertexCount);
  document.getElementById('taskText').textContent = generateTaskText();
  document.getElementById('resultBox').className = '';
  document.getElementById('resultBox').innerHTML = '';
  document.getElementById('hintPanel').hidden = true;
  document.getElementById('stepsPanel').hidden = true;

  // Update matrix title
  const title = document.getElementById('matrixTitle');
  title.textContent = state.answerMode === 'adjacency' ? 'Матрица смежности' : 'Весовая матрица';

  // Update mode hint
  const hint = document.getElementById('modeHint');
  if (state.answerMode === 'adjacency') {
    hint.textContent = 'Заполняйте матрицу: 1 — есть ребро, 0 — нет ребра.';
  } else {
    hint.textContent = 'Заполняйте матрицу: вес ребра (число) — есть ребро, 0 — нет ребра.';
  }
}

// ==================== ALGORITHM DEMO ====================
const demoState = {
  currentStep: 0,
  steps: [],
};

function buildDemoSteps() {
  const n = state.vertexCount;
  const correctMatrix = state.currentTask;
  const steps = [];

  // Step 0: Intro
  steps.push({
    title: 'Начало',
    explanation: `Граф: ${state.isDirected ? 'ориентированный' : 'неориентированный'}${state.isWeighted ? ', взвешенный' : ', невзвешенный'}. Вершин: ${n}. Рёбер: ${state.edges.length}. Сейчас построим матрицу шаг за шагом.`,
    matrix: Array.from({ length: n }, () => new Array(n).fill(null)),
    highlightEdge: -1,
  });

  // Step 1: Fill diagonal with zeros
  const m1 = Array.from({ length: n }, () => new Array(n).fill(null));
  for (let i = 0; i < n; i++) m1[i][i] = 0;
  steps.push({
    title: 'Шаг 1: Диагональ',
    explanation: `Сначала заполняем диагональ нулями. Путь из вершины в саму себя не учитывается, поэтому M[i][i] = 0 для всех i.`,
    matrix: m1,
    highlightEdge: -1,
  });

  // Steps for each edge
  let currentMatrix = m1.map(row => [...row]);
  state.edges.forEach((edge, idx) => {
    const from = state.vertices[edge.from];
    const to = state.vertices[edge.to];
    const val = state.isWeighted ? edge.weight : 1;

    // Fill the edge
    currentMatrix[edge.from][edge.to] = val;
    if (!state.isDirected) {
      currentMatrix[edge.to][edge.from] = val;
    }

    let explanation;
    if (state.isWeighted) {
      explanation = `Ребро ${from}→${to} имеет вес ${val}. Ставим ${val} в ячейку [${from}, ${to}]`;
    } else {
      explanation = `Между ${from} и ${to} есть ребро. Ставим 1 в ячейку [${from}, ${to}]`;
    }
    if (!state.isDirected) {
      explanation += ` и ${val} в [${to}, ${from}] (симметрия неориентированного графа)`;
    }
    explanation += '.';

    steps.push({
      title: `Ребро ${from}→${to}`,
      explanation,
      matrix: currentMatrix.map(row => [...row]),
      highlightEdge: idx,
    });
  });

  // Step: Fill remaining zeros
  const finalMatrix = currentMatrix.map(row => [...row]);
  let zeroCount = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (finalMatrix[i][j] === null) {
        finalMatrix[i][j] = 0;
        zeroCount++;
      }
    }
  }
  steps.push({
    title: 'Заполняем нули',
    explanation: `Все оставшиеся ячейки заполняем нулями — между этими вершинами нет рёбер. Заполнено ${zeroCount} нулевых ячеек.`,
    matrix: finalMatrix,
    highlightEdge: -1,
  });

  // Final step
  steps.push({
    title: 'Готово!',
    explanation: `Матрица полностью заполнена. ${state.isDirected ? 'Граф ориентированный — направление учтено.' : 'Граф неориентированный — матрица симметрична.'} Количество ненулевых ячеек: ${state.edges.length * (state.isDirected ? 1 : 2)}.`,
    matrix: finalMatrix,
    highlightEdge: -1,
  });

  return steps;
}

function renderDemoStep() {
  const step = demoState.steps[demoState.currentStep];
  if (!step) return;

  document.getElementById('demoStepLabel').textContent = `${step.title} (${demoState.currentStep + 1}/${demoState.steps.length})`;
  document.getElementById('demoExplanation').innerHTML = `<strong>${step.title}.</strong> ${step.explanation}`;

  // Render matrix
  const tableEl = document.getElementById('demoMatrixTable');
  const n = state.vertexCount;
  let html = '<thead><tr><th class="corner-cell"></th>';
  state.vertices.forEach(v => html += `<th>${v}</th>`);
  html += '</tr></thead><tbody>';
  for (let i = 0; i < n; i++) {
    html += '<tr>';
    html += `<th>${state.vertices[i]}</th>`;
    for (let j = 0; j < n; j++) {
      const val = step.matrix[i][j];
      const isDiagonal = i === j;
      let cellClass = '';
      let cellStyle = '';
      if (val === null) {
        cellStyle = 'color: var(--color-text-faint)';
        html += `<td style="${cellStyle}">·</td>`;
      } else if (isDiagonal) {
        html += `<td class="diagonal-cell">${val}</td>`;
      } else if (val !== 0) {
        html += `<td style="background: var(--color-success-bg); color: var(--color-success); font-weight: 700">${val}</td>`;
      } else {
        html += `<td>${val}</td>`;
      }
    }
    html += '</tr>';
  }
  html += '</tbody>';
  tableEl.innerHTML = html;

  // Render graph with highlighted edge
  renderGraph(document.getElementById('demoSvg'), state.vertices, state.edges, state.isDirected, state.isWeighted, step.highlightEdge);
}

function startDemo() {
  if (!state.currentTask) {
    newTask();
  }
  demoState.steps = buildDemoSteps();
  demoState.currentStep = 0;
  document.getElementById('demoArea').hidden = false;
  renderDemoStep();
}

function demoNext() {
  if (demoState.currentStep < demoState.steps.length - 1) {
    demoState.currentStep++;
    renderDemoStep();
  }
}

function demoPrev() {
  if (demoState.currentStep > 0) {
    demoState.currentStep--;
    renderDemoStep();
  }
}

// ==================== OGE TASKS ====================
const ogeTasks = [
  {
    id: 1,
    badge: 'ОГЭ · Базовый',
    title: 'Матрица смежности по графу',
    text: 'На рисунке — неориентированный граф с 4 вершинами. Заполните матрицу смежности. Единица — ребро есть, ноль — нет.',
    graph: {
      vertices: ['A', 'B', 'C', 'D'],
      edges: [
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 2, weight: 1 },
        { from: 1, to: 3, weight: 1 },
        { from: 2, to: 3, weight: 1 },
      ],
      isDirected: false,
      isWeighted: false,
    },
    matrix: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ],
    type: 'matrix-input',
  },
  {
    id: 2,
    badge: 'ОГЭ · Базовый',
    title: 'Определите граф по матрице',
    text: 'Дана матрица смежности. Сколько рёбер в графе?',
    table: {
      headers: ['', 'A', 'B', 'C', 'D'],
      rows: [
        ['A', 0, 1, 0, 1],
        ['B', 1, 0, 1, 0],
        ['C', 0, 1, 0, 1],
        ['D', 1, 0, 1, 0],
      ],
    },
    answer: '4',
    explanation: 'В неориентированном графе каждое ребро даёт две единицы (симметричные). Считаем единицы: 8 единиц / 2 = 4 ребра.',
  },
  {
    id: 3,
    badge: 'ОГЭ · Повышенный',
    title: 'Кратчайший путь по таблице расстояний',
    text: 'Между населёнными пунктами A, B, C, D, E построены дороги. В таблице указаны протяжённости дорог. Найдите длину кратчайшего маршрута из A в E.',
    table: {
      headers: ['', 'A', 'B', 'C', 'D', 'E'],
      rows: [
        ['A', 0, 3, 0, 0, 0],
        ['B', 3, 0, 1, 4, 0],
        ['C', 0, 1, 0, 2, 0],
        ['D', 0, 4, 2, 0, 5],
        ['E', 0, 0, 0, 5, 0],
      ],
    },
    answer: '11',
    explanation: 'Возможные маршруты из A в E:<br>• A→B→D→E = 3+4+5 = 12<br>• A→B→C→D→E = 3+1+2+5 = 11<br>• A→B→C→D→E — кратчайший = <strong>11</strong><br>Сравниваем все маршруты, наименьший — 11.',
  },
  {
    id: 4,
    badge: 'ОГЭ · Повышенный',
    title: 'Кратчайший путь — выбор маршрута',
    text: 'На рисунке — схема дорог. Найдите длину кратчайшего пути из пункта A в пункт F. Веса рёбер — расстояния в километрах.',
    graph: {
      vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
      edges: [
        { from: 0, to: 1, weight: 2 },
        { from: 0, to: 2, weight: 5 },
        { from: 1, to: 3, weight: 3 },
        { from: 2, to: 3, weight: 1 },
        { from: 2, to: 4, weight: 6 },
        { from: 3, to: 5, weight: 4 },
        { from: 4, to: 5, weight: 2 },
      ],
      isDirected: false,
      isWeighted: true,
    },
    answer: '9',
    explanation: 'Маршруты из A в F:<br>• A→B→D→F = 2+3+4 = 9<br>• A→C→D→F = 5+1+4 = 10<br>• A→C→E→F = 5+6+2 = 13<br>• A→B→D→F — кратчайший = <strong>9</strong>',
  },
  {
    id: 5,
    badge: 'ОГЭ · Повышенный',
    title: 'Восстановите матрицу по ориентированному графу',
    text: 'На рисунке — ориентированный граф. Заполните матрицу смежности. Помните: строка — откуда, столбец — куда.',
    graph: {
      vertices: ['A', 'B', 'C', 'D'],
      edges: [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 1 },
        { from: 2, to: 0, weight: 1 },
        { from: 0, to: 3, weight: 1 },
        { from: 3, to: 2, weight: 1 },
      ],
      isDirected: true,
      isWeighted: false,
    },
    matrix: [
      [0, 1, 0, 1],
      [0, 0, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 1, 0],
    ],
    type: 'matrix-input',
  },
  {
    id: 6,
    badge: 'ОГЭ · Повышенный',
    title: 'Весовая матрица и кратчайший путь',
    text: 'Дана весовая матрица дорог между городами A, B, C, D. Найдите длину кратчайшего маршрута из A в D. 0 означает отсутствие прямой дороги.',
    table: {
      headers: ['', 'A', 'B', 'C', 'D'],
      rows: [
        ['A', 0, 7, 2, 0],
        ['B', 7, 0, 3, 5],
        ['C', 2, 3, 0, 6],
        ['D', 0, 5, 6, 0],
      ],
    },
    answer: '8',
    explanation: 'Маршруты из A в D:<br>• A→B→D = 7+5 = 12<br>• A→C→D = 2+6 = 8<br>• A→C→B→D = 2+3+5 = 10<br>• A→B→C→D = 7+3+6 = 16<br>Кратчайший: A→C→D = <strong>8</strong>',
  },
];

const egeTasks = [
  {
    id: 101,
    badge: 'ЕГЭ · Динамика по графу',
    title: 'Сколько маршрутов ведёт из A в F?',
    text: 'Двигаться можно только по стрелкам. Маршрут не обязан быть кратчайшим. Посчитайте все различные направленные пути из A в F.',
    graph: {
      vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
      edges: [
        { from: 0, to: 1, weight: 1 }, { from: 0, to: 2, weight: 1 },
        { from: 1, to: 3, weight: 1 }, { from: 1, to: 4, weight: 1 },
        { from: 2, to: 3, weight: 1 }, { from: 2, to: 4, weight: 1 },
        { from: 3, to: 5, weight: 1 }, { from: 4, to: 5, weight: 1 },
      ],
      isDirected: true,
      isWeighted: false,
    },
    answer: '4',
    explanation: 'Число путей: A=1; B=1; C=1; D=B+C=2; E=B+C=2; F=D+E=4. Ответ: <strong>4</strong>.',
  },
  {
    id: 102,
    badge: 'ЕГЭ · Условие на маршрут',
    title: 'Через D, но не через C',
    text: 'Сколько существует путей из A в F, которые проходят через D и не проходят через C?',
    graph: {
      vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
      edges: [
        { from: 0, to: 1, weight: 1 }, { from: 0, to: 2, weight: 1 },
        { from: 1, to: 3, weight: 1 }, { from: 1, to: 4, weight: 1 },
        { from: 2, to: 3, weight: 1 }, { from: 2, to: 4, weight: 1 },
        { from: 3, to: 4, weight: 1 }, { from: 3, to: 5, weight: 1 },
        { from: 4, to: 5, weight: 1 },
      ],
      isDirected: true,
      isWeighted: false,
    },
    answer: '2',
    explanation: 'Запрещаем ветку через C. До D остаётся только A→B→D. После D два продолжения: D→F и D→E→F. Итого <strong>2</strong>.',
  },
  {
    id: 103,
    badge: 'ЕГЭ · Взвешенный граф',
    title: 'Кратчайший маршрут обязательно через C',
    text: 'Найдите длину кратчайшего маршрута из A в F, который обязательно проходит через C. Числа у рёбер — длины дорог.',
    graph: {
      vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
      edges: [
        { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 7 },
        { from: 1, to: 2, weight: 2 }, { from: 1, to: 3, weight: 6 },
        { from: 2, to: 3, weight: 3 }, { from: 2, to: 4, weight: 5 },
        { from: 3, to: 5, weight: 4 }, { from: 4, to: 5, weight: 2 },
      ],
      isDirected: false,
      isWeighted: true,
    },
    answer: '13',
    explanation: 'Кратчайший путь A→C: A→B→C = 4+2=6. От C до F минимум 7: C→D→F = 3+4 или C→E→F = 5+2. Всего 6+7=<strong>13</strong>.',
  },
  {
    id: 104,
    badge: 'ЕГЭ · Таблица значений',
    title: 'Дойди до G без перебора маршрутов',
    text: 'Посчитайте число различных направленных путей из A в G. Используйте подписи-количества у вершин, а не полный список маршрутов.',
    graph: {
      vertices: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      edges: [
        { from: 0, to: 1, weight: 1 }, { from: 0, to: 2, weight: 1 },
        { from: 1, to: 3, weight: 1 }, { from: 1, to: 4, weight: 1 },
        { from: 2, to: 3, weight: 1 }, { from: 2, to: 4, weight: 1 },
        { from: 3, to: 5, weight: 1 }, { from: 4, to: 5, weight: 1 },
        { from: 4, to: 6, weight: 1 }, { from: 5, to: 6, weight: 1 },
      ],
      isDirected: true,
      isWeighted: false,
    },
    answer: '6',
    explanation: 'A=1; B=1; C=1; D=2; E=2; F=D+E=4; G=E+F=2+4=<strong>6</strong>.',
  },
];

function renderEgeTasks() {
  const container = document.getElementById('egeTasks');
  container.innerHTML = egeTasks.map(task => `
    <div class="oge-task" data-task-id="${task.id}">
      <div class="oge-task-header"><span class="oge-task-badge">${task.badge}</span><h3>${task.title}</h3></div>
      <p class="oge-task-text">${task.text}</p>
      <svg id="ege-svg-${task.id}" viewBox="0 0 400 400" class="graph-svg" style="max-width:320px;margin-bottom:16px"></svg>
      <div class="oge-input-row"><span class="oge-input-label">Ваш ответ:</span><input type="text" class="oge-input" data-ege-answer="${task.id}" placeholder="Введите число"><button class="oge-check-btn" data-ege-check="${task.id}">Проверить</button></div>
      <div class="oge-feedback" id="ege-feedback-${task.id}"></div>
      <button class="oge-solution-btn" data-ege-solution="${task.id}">Показать решение</button>
      <div class="oge-solution" id="ege-solution-${task.id}">${task.explanation}</div>
    </div>`).join('');

  egeTasks.forEach(task => renderGraph(document.getElementById(`ege-svg-${task.id}`), task.graph.vertices, task.graph.edges, task.graph.isDirected, task.graph.isWeighted));
  container.querySelectorAll('[data-ege-check]').forEach(button => button.addEventListener('click', () => {
    const task = egeTasks.find(item => item.id === Number(button.dataset.egeCheck));
    const input = container.querySelector(`[data-ege-answer="${task.id}"]`);
    const feedback = document.getElementById(`ege-feedback-${task.id}`);
    const correct = input.value.trim() === task.answer;
    input.classList.toggle('correct', correct);
    input.classList.toggle('wrong', !correct);
    feedback.className = `oge-feedback show ${correct ? 'success' : 'error'}`;
    feedback.innerHTML = correct ? `Верно! Ответ: ${task.answer}.` : 'Пока неверно. Подпишите число способов у каждой вершины или разбейте обязательный маршрут на две части.';
  }));
  container.querySelectorAll('[data-ege-solution]').forEach(button => button.addEventListener('click', () => {
    const solution = document.getElementById(`ege-solution-${button.dataset.egeSolution}`);
    solution.classList.toggle('show');
    button.textContent = solution.classList.contains('show') ? 'Скрыть решение' : 'Показать решение';
  }));
}

function renderOgeTasks() {
  const container = document.getElementById('ogeTasks');
  let html = '';

  ogeTasks.forEach(task => {
    html += `<div class="oge-task" data-task-id="${task.id}">`;
    html += `<div class="oge-task-header">`;
    html += `<span class="oge-task-badge">${task.badge}</span>`;
    html += `<h3>${task.title}</h3>`;
    html += `</div>`;
    html += `<p class="oge-task-text">${task.text}</p>`;

    // Render graph if exists
    if (task.graph) {
      const svgId = `oge-svg-${task.id}`;
      html += `<svg id="${svgId}" viewBox="0 0 400 400" class="graph-svg" style="max-width:300px;margin-bottom:16px"></svg>`;
    }

    // Render table if exists
    if (task.table) {
      html += '<table class="oge-task-table"><thead><tr>';
      task.table.headers.forEach(h => {
        html += `<th>${h}</th>`;
      });
      html += '</tr></thead><tbody>';
      task.table.rows.forEach(row => {
        html += '<tr>';
        row.forEach((cell, ci) => {
          if (ci === 0) {
            html += `<th>${cell}</th>`;
          } else {
            const display = cell === 0 ? '0' : cell;
            html += `<td>${display}</td>`;
          }
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
    }

    // Matrix input type
    if (task.type === 'matrix-input') {
      const g = task.graph;
      html += '<table class="oge-task-table"><thead><tr><th></th>';
      g.vertices.forEach(v => html += `<th>${v}</th>`);
      html += '</tr></thead><tbody>';
      for (let i = 0; i < g.vertices.length; i++) {
        html += '<tr>';
        html += `<th>${g.vertices[i]}</th>`;
        for (let j = 0; j < g.vertices.length; j++) {
          if (i === j) {
            html += `<td class="diagonal-cell"><input type="text" class="oge-input oge-matrix-input" style="width:40px" value="0" readonly data-task="${task.id}" data-row="${i}" data-col="${j}"></td>`;
          } else {
            html += `<td><input type="text" class="oge-input oge-matrix-input" style="width:40px" data-task="${task.id}" data-row="${i}" data-col="${j}"></td>`;
          }
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      html += `<button class="oge-check-btn" data-check-matrix="${task.id}">Проверить матрицу</button>`;
    } else {
      // Single answer input
      html += '<div class="oge-input-row">';
      html += '<span class="oge-input-label">Ваш ответ:</span>';
      html += `<input type="text" class="oge-input" data-answer="${task.id}" placeholder="Введите ответ">`;
      html += `<button class="oge-check-btn" data-check="${task.id}">Проверить</button>`;
      html += '</div>';
    }

    html += `<div class="oge-feedback" id="feedback-${task.id}"></div>`;
    html += `<button class="oge-solution-btn" data-solution="${task.id}">Показать решение</button>`;
    html += `<div class="oge-solution" id="solution-${task.id}">${task.explanation}</div>`;
    html += '</div>';
  });

  container.innerHTML = html;

  // Render OGE graphs
  ogeTasks.forEach(task => {
    if (task.graph) {
      const svgEl = document.getElementById(`oge-svg-${task.id}`);
      renderGraph(svgEl, task.graph.vertices, task.graph.edges, task.graph.isDirected, task.graph.isWeighted);
    }
  });

  // Attach check handlers
  container.querySelectorAll('[data-check]').forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = parseInt(btn.dataset.check);
      checkOgeTask(taskId);
    });
  });

  container.querySelectorAll('[data-check-matrix]').forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = parseInt(btn.dataset.checkMatrix);
      checkOgeMatrixTask(taskId);
    });
  });

  // Solution toggles
  container.querySelectorAll('[data-solution]').forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = parseInt(btn.dataset.solution);
      const sol = document.getElementById(`solution-${taskId}`);
      sol.classList.toggle('show');
      btn.textContent = sol.classList.contains('show') ? 'Скрыть решение' : 'Показать решение';
    });
  });
}

function checkOgeTask(taskId) {
  const task = ogeTasks.find(t => t.id === taskId);
  const input = document.querySelector(`[data-answer="${taskId}"]`);
  const feedback = document.getElementById(`feedback-${taskId}`);

  const userVal = input.value.trim();
  if (userVal === task.answer) {
    input.classList.add('correct');
    input.classList.remove('wrong');
    feedback.className = 'oge-feedback show success';
    feedback.innerHTML = `Верно! Ответ: ${task.answer}.`;
  } else {
    input.classList.add('wrong');
    input.classList.remove('correct');
    feedback.className = 'oge-feedback show error';
    feedback.innerHTML = `Неверно. Правильный ответ: ${task.answer}.<div class="oge-feedback-explanation">${task.explanation}</div>`;
  }
}

function checkOgeMatrixTask(taskId) {
  const task = ogeTasks.find(t => t.id === taskId);
  const inputs = document.querySelectorAll(`.oge-matrix-input[data-task="${taskId}"]`);
  const feedback = document.getElementById(`feedback-${taskId}`);
  const correctMatrix = task.matrix;
  let correct = 0;
  let total = 0;
  const errors = [];

  inputs.forEach(inp => {
    const row = parseInt(inp.dataset.row);
    const col = parseInt(inp.dataset.col);
    if (row === col) return;
    total++;
    const userVal = inp.value.trim();
    const correctVal = correctMatrix[row][col];
    if (userVal === String(correctVal)) {
      correct++;
      inp.style.borderColor = 'var(--color-success)';
      inp.style.background = 'var(--color-success-bg)';
    } else {
      inp.style.borderColor = 'var(--color-error)';
      inp.style.background = 'var(--color-error-bg)';
      errors.push(`[${task.graph.vertices[row]}, ${task.graph.vertices[col]}]: ваш «${userVal || '—'}», правильно «${correctVal}»`);
    }
  });

  if (correct === total) {
    feedback.className = 'oge-feedback show success';
    feedback.innerHTML = `Верно! Все ${total} ячеек заполнены правильно!`;
  } else {
    feedback.className = 'oge-feedback show error';
    let html = `Верно: ${correct} из ${total}.<div class="oge-feedback-explanation">`;
    errors.slice(0, 4).forEach(e => html += `• ${e}<br>`);
    html += '</div>';
    feedback.innerHTML = html;
  }
}

// ==================== THEME TOGGLE ====================
function initTheme() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = prefersDark ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function updateIcon() {
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  updateIcon();

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    updateIcon();
    // Re-render graphs to update colors
    if (state.currentTask) {
      renderGraph(document.getElementById('graphSvg'), state.vertices, state.edges, state.isDirected, state.isWeighted);
    }
    // Re-render OGE graphs
    ogeTasks.forEach(task => {
      if (task.graph) {
        const svgEl = document.getElementById(`oge-svg-${task.id}`);
        if (svgEl) renderGraph(svgEl, task.graph.vertices, task.graph.edges, task.graph.isDirected, task.graph.isWeighted);
      }
    });
    egeTasks.forEach(task => {
      const svgEl = document.getElementById(`ege-svg-${task.id}`);
      if (svgEl) renderGraph(svgEl, task.graph.vertices, task.graph.edges, task.graph.isDirected, task.graph.isWeighted);
    });
  });
}

// ==================== NAV ====================
function initNav() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.content-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(target).classList.add('active');
    });
  });
}

// ==================== CONTROLS ====================
function initControls() {
  // Graph type buttons
  document.querySelectorAll('[data-graph-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-graph-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.graphType = btn.dataset.graphType;
      // Auto-switch answer mode based on graph type
      if (state.graphType.includes('-weighted')) {
        document.querySelectorAll('[data-answer-mode]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-answer-mode="weight"]').classList.add('active');
        state.answerMode = 'weight';
      } else {
        document.querySelectorAll('[data-answer-mode]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-answer-mode="adjacency"]').classList.add('active');
        state.answerMode = 'adjacency';
      }
      newTask();
    });
  });

  // Answer mode buttons
  document.querySelectorAll('[data-answer-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Only allow switching if graph type matches
      const wantWeight = btn.dataset.answerMode === 'weight';
      const isWeightedGraph = state.graphType.includes('-weighted');
      if (wantWeight && !isWeightedGraph) {
        // Auto switch to weighted graph type
        document.querySelectorAll('[data-graph-type]').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-graph-type="${state.graphType.replace('-unweighted', '-weighted')}"]`).classList.add('active');
        state.graphType = state.graphType.replace('-unweighted', '-weighted');
      } else if (!wantWeight && isWeightedGraph) {
        document.querySelectorAll('[data-graph-type]').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-graph-type="${state.graphType.replace('-weighted', '-unweighted')}"]`).classList.add('active');
        state.graphType = state.graphType.replace('-weighted', '-unweighted');
      }
      document.querySelectorAll('[data-answer-mode]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.answerMode = btn.dataset.answerMode;
      newTask();
    });
  });

  // Vertex count slider
  const slider = document.getElementById('vertexCount');
  const label = document.getElementById('vertexCountLabel');
  slider.addEventListener('input', () => {
    state.vertexCount = parseInt(slider.value);
    label.textContent = state.vertexCount;
  });
  slider.addEventListener('change', () => {
    newTask();
  });

  // Action buttons
  document.getElementById('newTaskBtn').addEventListener('click', newTask);
  document.getElementById('checkBtn').addEventListener('click', checkAnswers);
  document.getElementById('hintBtn').addEventListener('click', showHint);
  document.getElementById('solveBtn').addEventListener('click', showStepByStepSolution);
  document.getElementById('clearBtn').addEventListener('click', clearMatrix);

  // Demo buttons
  document.getElementById('demoStartBtn').addEventListener('click', startDemo);
  document.getElementById('demoNextBtn').addEventListener('click', demoNext);
  document.getElementById('demoPrevBtn').addEventListener('click', demoPrev);
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initControls();
  renderOgeTasks();
  renderEgeTasks();
  newTask();
});
