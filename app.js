// Elements & Variables
const colorSections = document.querySelectorAll(".app__colors--color");
const generateButton = document.querySelectorAll(".app__panel--generateButton");
const sliders = document.querySelectorAll(`input[type="range"]`);
const currentHexex = document.querySelectorAll(".app__colors--color h2");
let initialColors;

// Functions
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  initialColors = [];
  colorSections.forEach((section, index) => {
    const hexText = section.children[0];
    const randomColor = generateHex();

    // Add color to the colors array
    initialColors.push(chroma(randomColor).hex());

    // Add color to section background
    section.style.background = randomColor;
    hexText.textContent = randomColor;

    // Check contrast
    checkTextContrast(randomColor, hexText);

    // Initial colorize sliders
    const color = chroma(randomColor);
    const sliders = section.querySelectorAll(".app__colors--sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
  // Reset inputs
  resetInputs();
}
randomColors();

function colorizeSliders(color, hue, brightness, saturation) {
  // Saturation range (scale)
  const noSaturation = color.set("hsl.s", 0);
  const fullSaturation = color.set("hsl.s", 1);
  const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation]);

  // Brightness range (scale)
  const midBrightness = color.set("hsl.l", 0.5);
  const scaleBrightness = chroma.scale(["black", midBrightness, "white"]);

  // Update input background color
  // prettier-ignore
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(0)}, ${scaleSaturation(1)})`;
  // prettier-ignore
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0)}, ${scaleBrightness(0.5)} ,${scaleBrightness(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(204,75,75), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  luminance > 0.5 ? (text.style.color = "black") : (text.style.color = "white");
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-saturation") ||
    e.target.getAttribute("data-brightness");

  let sliders = e.target.parentElement.querySelectorAll(`input[type="range"]`);

  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColors[index];

  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value);

  colorSections[index].style.backgroundColor = color;
}

function updateTextUI(index) {
  const activeSection = colorSections[index];
  const color = chroma(activeSection.style.backgroundColor);
  const textHex = activeSection.querySelector("h2");
  const icons = activeSection.querySelectorAll(".app__colors--controls button");
  textHex.innerText = color.hex();
  checkTextContrast(color, textHex);
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".app__colors--sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
  });
}

// Event listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorSections.forEach((section, index) => {
  section.addEventListener("change", () => {
    updateTextUI(index);
  });
});
