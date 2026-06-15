import {
  getServerBaseUrl,
  loadGlassoutSettings,
  settingsChangedKey
} from "./settings.js";

const activeAircraftKey = "glassout.activeAircraft";
const channel = "BroadcastChannel" in window
  ? new BroadcastChannel("glassout.aircraft")
  : null;
let glassoutSettings = loadGlassoutSettings();

function getActiveAircraftId() {
  const stored = localStorage.getItem(activeAircraftKey);

  if (stored && glassoutSettings.aircraft[stored]) {
    return stored;
  }

  return glassoutSettings.defaultAircraft;
}

function setActiveAircraftId(aircraftId) {
  localStorage.setItem(activeAircraftKey, aircraftId);
  channel?.postMessage({ type: "aircraft.changed", aircraftId });
  render();
}

function resolvePanelUrl(panel) {
  if (panel.url) {
    return panel.url;
  }

  return `${getServerBaseUrl(glassoutSettings)}${panel.path}`;
}

function renderSwitcher(activeAircraftId) {
  const switcher = document.querySelector("#aircraft-select");

  if (!switcher) {
    return;
  }

  switcher.innerHTML = "";

  for (const [aircraftId, aircraft] of Object.entries(glassoutSettings.aircraft)) {
    const option = document.createElement("option");
    option.value = aircraftId;
    option.textContent = aircraft.name;
    switcher.append(option);
  }

  switcher.value = activeAircraftId;
}

function renderPanels(windowConfig) {
  const panelRoot = document.querySelector("#panels");
  panelRoot.className = `grid ${windowConfig.layout}`;
  panelRoot.innerHTML = "";

  for (const panel of windowConfig.panels) {
    const iframe = document.createElement("iframe");
    iframe.title = panel.id;
    iframe.src = resolvePanelUrl(panel);

    if (panel.className) {
      iframe.className = panel.className;
    }

    panelRoot.append(iframe);
  }
}

function renderMissingLayout(aircraft, windowName) {
  const panelRoot = document.querySelector("#panels");
  panelRoot.className = "missing-layout";
  panelRoot.innerHTML = "";

  const message = document.createElement("div");
  message.textContent = `${aircraft.name} has no ${windowName} layout configured.`;
  panelRoot.append(message);
}

function render() {
  const windowName = document.body.dataset.window;
  const activeAircraftId = getActiveAircraftId();
  const aircraft = glassoutSettings.aircraft[activeAircraftId];
  const windowConfig = aircraft.windows[windowName];

  renderSwitcher(activeAircraftId);

  if (!windowConfig) {
    renderMissingLayout(aircraft, windowName);
    return;
  }

  renderPanels(windowConfig);
}

document.querySelector("#aircraft-select")?.addEventListener("change", (event) => {
  setActiveAircraftId(event.target.value);
});

window.addEventListener("storage", (event) => {
  if (event.key === activeAircraftKey || event.key === settingsChangedKey) {
    glassoutSettings = loadGlassoutSettings();
    render();
  }
});

channel?.addEventListener("message", (event) => {
  if (event.data?.type === "aircraft.changed") {
    render();
  }
});

render();
