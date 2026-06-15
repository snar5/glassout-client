# GlassOut Client

A small Tauri viewer for GlassOut panels. The app opens a launcher first so you can choose the aircraft and panel windows.

## Run

```bash
npm install
npm run tauri dev
```

## Aircraft Profiles

Built-in aircraft panel defaults live in `src/aircraftProfiles.js`. Runtime settings are saved by the launcher and override those defaults.

Each aircraft can define layouts for the Tauri windows:

- `main`: currently the PFD/MFD window
- `eic`: currently the EIC/ISI window
- `mcdu`: currently the MCDU window

## Settings

Use the launcher to set the GlassOut server scheme, IP/host, and port. Stage 1 settings are stored locally in the app webview storage.
