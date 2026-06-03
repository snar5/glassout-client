# GlassOut Client

A small Tauri viewer for GlassOut panels.

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

The profile selector in the upper-left corner of each window stores the selected aircraft locally and updates the other window.
