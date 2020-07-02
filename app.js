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
  });
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
