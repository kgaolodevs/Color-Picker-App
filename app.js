// Elements & Variables
const colorSections = document.querySelectorAll(".app__colors--color");
const generateButton = document.querySelectorAll(".app__panel--generateButton");
const sliderInput = document.querySelectorAll(`input[type="range"]`);
const currentHexex = document.querySelectorAll(".app__colors--color h2");
let initialColors;

// Functions
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  colorSections.forEach((section, index) => {
    const hexText = section.children[0];
    const randomColor = generateHex();
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
}

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

randomColors();

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  luminance > 0.5 ? (text.style.color = "black") : (text.style.color = "white");
}

// Event listeners
document.querySelectorAll(".app__colors").forEach((color) => {
  color.addEventListener("click", () => {
    randomColors();
  });
});
