document.addEventListener("DOMContentLoaded", () => {
  const rows = [["Осадок", "Ba²⁺ + SO₄²⁻ → BaSO₄↓", "Ионы Na⁺ и Cl⁻ остаются в растворе."], ["Вода", "H⁺ + OH⁻ → H₂O", "Ионы Na⁺ и Cl⁻ сокращаются в примере HCl + NaOH."], ["Газ", "CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O", "Суммарный заряд слева и справа равен нулю."]];
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
