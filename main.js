/**
 * main.js — demo application entry point.
 *
 * Bundled by Vite. three.js and photon-editor are resolved from node_modules.
 * Run:  npm install && npm run dev
 */

import { PhotonEditor } from "photon-editor";

// ---------------------------------------------------------------------------
// Asset registry — demo app owns these paths, NOT the library
// ---------------------------------------------------------------------------
const MODEL_URLS = {
  Malcolm__Bored: "./assets/glb/Malcolm__Bored.glb",
  Malcolm__Talking: "./assets/glb/Malcolm__Talking.glb",
  Malcolm__Searching: "./assets/glb/Malcolm__Searching.glb",
  Wizard__Bored: "./assets/glb/Wizard__Bored.glb",
  Wizard__Taichi: "./assets/glb/Wizard__Taichi.glb",
  Wizard__Twerk: "./assets/glb/Wizard__Twerk.glb",
  Michelle__Bored: "./assets/glb/Michelle__Bored.glb",
  Michelle__Greeting: "./assets/glb/Michelle__Greeting.glb",
  Michelle__Party: "./assets/glb/Michelle__Party.glb",
};

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
const editor = new PhotonEditor(
  {
    path: MODEL_URLS.Wizard__Bored,
    scaleX: 10,
    scaleY: 10,
    scaleZ: 10,
    positionX: 0,
    positionY: -10,
    positionZ: -5,
  },
  {
    containerId: "world",
    loaderId: "js-loader",
  },
  {
    neckBoneNames: ["mixamorigNeck"],
    waistBoneNames: ["mixamorigSpine"],
  },
);

editor.render();

// ---------------------------------------------------------------------------
// Model selection
// ---------------------------------------------------------------------------
document.querySelectorAll(".dropdown-item a").forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const url = MODEL_URLS[anchor.getAttribute("name")];
    if (url) editor.loadModelFromUrl(url);
  });
});

// ---------------------------------------------------------------------------
// Camera perspective sliders
// ---------------------------------------------------------------------------
[
  { selector: "input[name='fov-input']", field: "fov" },
  { selector: "input[name='np-input']", field: "nearPlane" },
  { selector: "input[name='fp-input']", field: "farPlane" },
].forEach(({ selector, field }) => {
  document.querySelector(selector)?.addEventListener("input", (e) => {
    editor.perspective({ field, value: e.target.value });
  });
});

// ---------------------------------------------------------------------------
// Camera position sliders
// ---------------------------------------------------------------------------
[
  { selector: "input[name='camera-x']", field: "x" },
  { selector: "input[name='camera-y']", field: "y" },
  { selector: "input[name='camera-z']", field: "z" },
].forEach(({ selector, field }) => {
  document.querySelector(selector)?.addEventListener("input", (e) => {
    editor.cameraPosition({ field, value: e.target.value });
  });
});

// ---------------------------------------------------------------------------
// Interactivity toggle
// ---------------------------------------------------------------------------
document
  .querySelector("input[name='mi']")
  ?.addEventListener("change", () => editor.toggleInteractivity());

// ---------------------------------------------------------------------------
// Background helpers (referenced via onclick in HTML)
// ---------------------------------------------------------------------------
window.updateBackground = (useGradient) => {
  const world = document.getElementById("world");
  const input = document.getElementById("background");
  const label = document.getElementById("backgroundValue");

  if (useGradient) {
    world.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    label.textContent = "gradient";
  } else {
    world.style.background = input.value;
    label.textContent = input.value;
  }
};

window.transparentBackground = () => {
  const cb = document.getElementById("backgroundTransparent");
  const note = document.getElementById("confirm");
  if (cb.checked) {
    document.getElementById("world").style.background = "transparent";
    note.style.display = "block";
  } else {
    note.style.display = "none";
  }
};

window.sceneDefault = () => {
  editor.perspective({}); // no field → resets to defaults
  editor.cameraPosition({});
};
