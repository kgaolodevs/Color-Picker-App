// Elements & Variables
const colorSections = document.querySelectorAll(".app__colors--color");
const generateButton = document.querySelectorAll(".app__panel--generateButton");
const sliderInput = document.querySelectorAll(`input[type="range"]`);
const currentHexex = document.querySelectorAll(".app__colors--color h2");
let initialColors;

// Functions
function generateHex() {
  const chars = "0123456789ABCDEF";
  let hash = "#";
  for (let i = 0; i < 6; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
}

function randomColors() {
  colorSections.forEach((section, index) => {
    const hexText = section.children[0];
    const randomColor = generateHex();
  });
}
randomColors();
// Event listeners
document.querySelector(".app__colors--color").addEventListener("click", () => {
  changeBackground();
});
