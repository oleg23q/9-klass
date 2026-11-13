document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#theory");
  const demo = document.createElement("article");
  demo.className = "theory-card";
  demo.innerHTML = `<h3>Весы в лифте</h3><p>Масса 50 кг, g = 10 м/с². Ось направлена вверх.</p>
    <label for="lift-acceleration">Ускорение лифта, м/с²</label>
    <input id="lift-acceleration" type="range" min="-10" max="10" step="1" value="0">
    <p><output id="lift-result" for="lift-acceleration" aria-live="polite"></output></p>`;
  section.append(demo);
  const slider = demo.querySelector("input");
  const output = demo.querySelector("output");
  function update() {
    const acceleration = Number(slider.value);
    const weight = 50 * (10 + acceleration);
    output.textContent = `aᵧ = ${acceleration} м/с². Весы: ${weight} Н. Сила тяжести: 500 Н.`;
  }
  slider.addEventListener("input", update);
  update();
});
