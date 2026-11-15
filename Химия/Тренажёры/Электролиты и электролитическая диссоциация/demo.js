document.addEventListener("DOMContentLoaded", () => {
  const rows = [["NaCl", "NaCl → Na⁺ + Cl⁻", "Заряд: +1 − 1 = 0."], ["CaCl₂", "CaCl₂ → Ca²⁺ + 2Cl⁻", "Заряд: +2 + 2·(−1) = 0."], ["Na₂SO₄", "Na₂SO₄ → 2Na⁺ + SO₄²⁻", "Заряд: 2·(+1) − 2 = 0."]];
  const card = document.createElement("article");
  card.className = "theory-card";
  card.innerHTML = '<h3>Модель уравнения</h3><label>Выбери пример <select></select></label><p><output aria-live="polite"></output></p>';
  document.querySelector("#theory").append(card);
  const select = card.querySelector("select");
  const output = card.querySelector("output");
  rows.forEach(([label], index) => select.add(new Option(label, index)));
  function update() {
    const [, equation, explanation] = rows[Number(select.value)];
    output.textContent = equation + " · " + explanation;
  }
  select.addEventListener("change", update);
  update();
});
