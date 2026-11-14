document.addEventListener("DOMContentLoaded", () => {
  const demo = document.createElement("article");
  demo.className = "theory-card";
  demo.innerHTML = `<h3>Как высота влияет на орбиту</h3>
    <img src="physics18-earth-orbit.svg" alt="Направления скорости и силы на орбите" style="max-width:100%;height:auto">
    <p><label>Высота над Землёй, км <input type="range" min="0" max="36000" step="100" value="400"></label></p>
    <p><output aria-live="polite"></output></p>
    <p>При нулевой высоте показана идеализированная орбита у поверхности.</p>`;
  document.querySelector("#theory").append(demo);
  const slider = demo.querySelector("input");
  const output = demo.querySelector("output");
  function update() {
    const height = slider.valueAsNumber;
    const radius = 6400 + height;
    const speed = Math.sqrt(400000 / radius);
    const minutes = 2 * Math.PI * radius / speed / 60;
    output.textContent = `h = ${height} км · r = ${radius} км · v = ${speed.toLocaleString("ru-RU", {maximumFractionDigits: 2})} км/с · T ≈ ${Math.round(minutes)} мин`;
  }
  slider.addEventListener("input", update);
  update();
});
