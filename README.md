# GlassOut Client

A small Tauri viewer for GlassOut panels. The app opens a launcher first so you can choose the aircraft and panel windows.

## Run

```bash
npm install
npm run tauri dev
```

## Aircraft Profiles

Aircraft panel layouts live in `src/aircraftProfiles.js`.

Each aircraft can define layouts for the Tauri windows:

- `main`: currently the PFD/MFD window
- `eic`: currently the EIC/ISI window
- `mcdu`: currently the MCDU window
