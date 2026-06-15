import { defaultGlassoutSettings } from "./aircraftProfiles.js";

export const settingsStorageKey = "glassout.settings";
export const settingsChangedKey = "glassout.settingsChanged";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeSettings(defaults, overrides) {
  if (!isObject(overrides)) {
    return cloneJson(defaults);
  }

  const merged = cloneJson(defaults);

  if (isObject(overrides.server)) {
    merged.server = {
      ...merged.server,
      ...overrides.server
    };
  }

  if (typeof overrides.defaultAircraft === "string") {
    merged.defaultAircraft = overrides.defaultAircraft;
  }

  if (isObject(overrides.aircraft)) {
    merged.aircraft = {
      ...merged.aircraft,
      ...overrides.aircraft
    };
  }

  return normalizeSettings(merged);
}

function normalizeSettings(settings) {
  const normalized = cloneJson(settings);
  normalized.server.scheme = normalized.server.scheme || "http";
  normalized.server.host = normalized.server.host || defaultGlassoutSettings.server.host;
  normalized.server.port = Number(normalized.server.port) || defaultGlassoutSettings.server.port;

  if (!normalized.aircraft[normalized.defaultAircraft]) {
    normalized.defaultAircraft = Object.keys(normalized.aircraft)[0];
  }

  return normalized;
}

export function loadGlassoutSettings() {
  let stored = null;

  try {
    stored = JSON.parse(localStorage.getItem(settingsStorageKey) || "null");
  } catch {
    stored = null;
  }

  return mergeSettings(defaultGlassoutSettings, stored);
}

export function saveGlassoutSettings(settings) {
  const normalized = normalizeSettings(settings);
  localStorage.setItem(settingsStorageKey, JSON.stringify(normalized));
  localStorage.setItem(settingsChangedKey, String(Date.now()));
  return normalized;
}

export function saveServerSettings(server) {
  const settings = loadGlassoutSettings();
  settings.server = {
    ...settings.server,
    ...server,
    port: Number(server.port)
  };

  return saveGlassoutSettings(settings);
}

export function resetGlassoutSettings() {
  localStorage.removeItem(settingsStorageKey);
  localStorage.setItem(settingsChangedKey, String(Date.now()));
  return loadGlassoutSettings();
}

export function getServerBaseUrl(settings) {
  const { scheme, host, port } = settings.server;
  return `${scheme}://${host}:${port}`;
}
