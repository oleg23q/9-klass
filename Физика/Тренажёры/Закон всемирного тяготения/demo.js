document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#theory");
  const demo = document.createElement("article");
  demo.className = "theory-card";
  demo.innerHTML = `<h3>Как меняется притяжение с высотой</h3>
    <p>Высота измеряется в радиусах планеты. Сравни ускорение с его значением на поверхности.</p>
    <label for="gravity-height">Высота h / R</label>
    <input id="gravity-height" type="range" min="0" max="3" value="0" step="0.25">
    <p><output id="gravity-result" for="gravity-height" aria-live="polite"></output></p>
    <label for="gravity-meter">Доля ускорения на поверхности</label>
    <meter id="gravity-meter" min="0" max="1" value="1"></meter>`;
  section.append(demo);
  const input = demo.querySelector("input");
  const output = demo.querySelector("output");
  const meter = demo.querySelector("meter");
  const format = new Intl.NumberFormat("ru", { maximumFractionDigits: 2 });
  function update() {
    const height = Number(input.value);
    const distance = 1 + height;
    const ratio = 1 / distance ** 2;
    output.textContent = `h = ${format.format(height)} R. r = ${format.format(distance)} R. g = ${format.format(100 * ratio)} % от g₀.`;
    meter.value = ratio;
  }
  input.addEventListener("input", update);
  update();
});
