import { glassoutConfig } from "./aircraftProfiles.js";

const { invoke } = window.__TAURI__.core;

const activeAircraftKey = "glassout.activeAircraft";
const selectedPanelsKey = "glassout.selectedPanels";
const panelLabels = {
  main: "PFD / MFD",
  eic: "EIC / ISI",
  mcdu: "MCDU"
};

const aircraftSelect = document.querySelector("#aircraft-select");
const panelOptions = document.querySelector("#panel-options");
const status = document.querySelector("#status");
const openSelectedButton = document.querySelector("#open-selected");
const closePanelsButton = document.querySelector("#close-panels");

function getActiveAircraftId() {
  const stored = localStorage.getItem(activeAircraftKey);

  if (stored && glassoutConfig.aircraft[stored]) {
    return stored;
  }

  return glassoutConfig.defaultAircraft;
}

function getSelectedPanelIds(aircraft) {
  const availablePanels = Object.keys(aircraft.windows);
  let stored = null;

  try {
    stored = JSON.parse(localStorage.getItem(selectedPanelsKey) || "null");
  } catch {
    stored = null;
  }

  if (Array.isArray(stored)) {
    return stored.filter((panelId) => availablePanels.includes(panelId));
  }

  return availablePanels;
}

function setStatus(message) {
  status.textContent = message;
}

function renderAircraftOptions() {
  aircraftSelect.innerHTML = "";

  for (const [aircraftId, aircraft] of Object.entries(glassoutConfig.aircraft)) {
    const option = document.createElement("option");
    option.value = aircraftId;
    option.textContent = aircraft.name;
    aircraftSelect.append(option);
  }

  aircraftSelect.value = getActiveAircraftId();
}

function renderPanelOptions() {
  const aircraft = glassoutConfig.aircraft[aircraftSelect.value];
  const selectedPanelIds = new Set(getSelectedPanelIds(aircraft));
  panelOptions.innerHTML = "";

  for (const panelId of Object.keys(aircraft.windows)) {
    const label = document.createElement("label");
    label.className = "panel-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = panelId;
    checkbox.checked = selectedPanelIds.has(panelId);

    const text = document.createElement("span");
    text.textContent = panelLabels[panelId] || panelId;

    label.append(checkbox, text);
    panelOptions.append(label);
  }
}

function getCheckedPanelIds() {
  return Array.from(panelOptions.querySelectorAll("input:checked"), (input) => input.value);
}

async function openSelectedPanels() {
  const aircraftId = aircraftSelect.value;
  const panelIds = getCheckedPanelIds();
  const selectedPanelIds = new Set(panelIds);
  const availablePanelIds = Object.keys(glassoutConfig.aircraft[aircraftId].windows);

  localStorage.setItem(activeAircraftKey, aircraftId);
  localStorage.setItem(selectedPanelsKey, JSON.stringify(panelIds));

  if (panelIds.length === 0) {
    setStatus("Select at least one panel.");
    return;
  }

  setStatus("Opening panels...");

  for (const panelId of availablePanelIds) {
    if (!selectedPanelIds.has(panelId)) {
      await invoke("close_panel_window", { label: panelId });
    }
  }

  for (const panelId of panelIds) {
    await invoke("open_panel_window", { label: panelId });
  }

  setStatus(`Opened ${panelIds.length} panel window${panelIds.length === 1 ? "" : "s"}.`);
}

async function closePanelWindows() {
  await invoke("close_panel_windows");
  setStatus("Panel windows closed.");
}

aircraftSelect.addEventListener("change", () => {
  localStorage.setItem(activeAircraftKey, aircraftSelect.value);
  renderPanelOptions();
});

openSelectedButton.addEventListener("click", () => {
  openSelectedPanels().catch((error) => {
    setStatus(`Could not open panels: ${error}`);
  });
});

closePanelsButton.addEventListener("click", () => {
  closePanelWindows().catch((error) => {
    setStatus(`Could not close panels: ${error}`);
  });
});

renderAircraftOptions();
renderPanelOptions();
