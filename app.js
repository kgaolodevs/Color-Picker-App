// Elements & Variables
const colorSections = document.querySelectorAll(".app__colors--color");
const generateButton = document.querySelector(".app__panel--generate");
const sliders = document.querySelectorAll(`input[type="range"]`);
const currentHexes = document.querySelectorAll(".app__colors--color h2");
const popup = document.querySelector(".app__copyContainer");
const adjustButtons = document.querySelectorAll(".app__colors--adjust");
const lockButtons = document.querySelectorAll(".app__colors--lock");
const saveButton = document.querySelector(".app__panel--save");
const saveContainer = document.querySelector(".app__saveContainer");
const saveContainerPopup = document.querySelector(".app__saveContainer--popup");
const saveInput = document.querySelector(".saveContainer--input");
const submitSave = document.querySelector(".saveContainer--submitBtn");
const closeSave = document.querySelector(".saveContainer--closeBtn");
const libraryContainer = document.querySelector(".app__libraryContainer");
const libraryButton = document.querySelector(".app__panel--library");
// prettier-ignore
const closeLibraryButton = document.querySelector(".libraryContainer--closeBtn");
// prettier-ignore
const closeAdjustmentsButtons = document.querySelectorAll(".app__colors--closeAdjustment");
const sliderContainers = document.querySelectorAll(".app__colors--sliders");
let initialColors;

// For local storage
let savedPalettes = [];

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
    // Add it to the array
    if (section.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      // Add color to the colors array
      initialColors.push(chroma(randomColor).hex());
    }

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

  // Check button contrast
  adjustButtons.forEach((button, index) => {
    checkTextContrast(initialColors[index], button);
    checkTextContrast(initialColors[index], lockButtons[index]);
  });
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

  // colorize inputs/sliders
  colorizeSliders(color, hue, brightness, saturation);
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
    if (slider.name === "brightness") {
      const brightnessColor =
        initialColors[slider.getAttribute("data-brightness")];
      const brightnessValue = chroma(brightnessColor).hsl()[2];
      slider.value = Math.floor(brightnessValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const saturationColor =
        initialColors[slider.getAttribute("data-saturation")];
      const saturationValue = chroma(saturationColor).hsl()[1];
      slider.value = Math.floor(saturationValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const element = document.createElement("textarea");
  element.value = hex.innerText;
  document.body.appendChild(element);
  element.select();
  document.execCommand("copy");
  document.body.removeChild(element);
  // Pop up animation
  const popupBox = popup.children[0];
  popup.classList.add("copyContainerActive");
  popupBox.classList.add("copyPopupActive");
}

function openAdjustmentPanel(index) {
  sliderContainers[index].classList.toggle("slidersActive");
}

function closeAdjustmentPanel(index) {
  sliderContainers[index].classList.remove("slidersActive");
}

function lockLayer(e, index) {
  const lockSVG = e.target.children[0];
  const activeBackground = colorSections[index];
  activeBackground.classList.toggle("locked");

  if (activeBackground.classList.contains("locked")) {
    lockSVG.innerHTML = `<i class="fas fa-lock"></i>`;
  } else {
    lockSVG.innerHTML = `<i class="fas fa-lock-open"></i>`;
  }
}

function openPalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("saveContainerActive");
  popup.classList.add("savePopupActive");
}

function closePalette() {
  saveContainer.classList.remove("saveContainerActive");
}

function savePalettes(e) {
  saveContainer.classList.remove("saveContainerActive");
  // saveContainerPopup.classList.remove("savePopupActive");
  const paletteName = saveInput.value;
  const colors = [];
  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });

  // Create the palette object
  let paletteNumber = savedPalettes.length;
  const paletteObject = { name: paletteName, colors, no: paletteNumber };
  savedPalettes.push(paletteObject);

  // Save palettes to local storage
  saveToLocal(paletteObject);
  saveInput.value = "";

  // Generate the palette for library
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = paletteObject.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObject.colors.forEach((colorPreview) => {
    const colorDiv = document.createElement("div");
    colorDiv.style.background = colorPreview;
    preview.appendChild(colorDiv);
  });
  const paletteButton = document.createElement("button");
  paletteButton.classList.add("pickPalette-button");
  paletteButton.classList.add(paletteObject.no);
  paletteButton.innerText = "Select";

  // Append to the library
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteButton);
  libraryContainer.children[0].appendChild(palette);
}

function saveToLocal(paletteObject) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObject);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
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

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});

popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("copyContainerActive");
  popupBox.classList.remove("copyPopupActive");
});

adjustButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});

closeAdjustmentsButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});

lockButtons.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    lockLayer(e, index);
  });
});

function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("libraryContainerActive");
  popup.classList.add("libraryPopupActive");
}

function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("libraryContainerActive");
  popup.classList.add("libraryPopupActive");
}

generateButton.addEventListener("click", randomColors);

saveButton.addEventListener("click", openPalette);

closeSave.addEventListener("click", closePalette);

submitSave.addEventListener("click", savePalettes);

libraryButton.addEventListener("click", openLibrary);

closeLibraryButton.addEventListener("click", closeLibrary);
