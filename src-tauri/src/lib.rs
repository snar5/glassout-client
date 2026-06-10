use tauri::Manager;

#[tauri::command]
fn open_panel_window(app: tauri::AppHandle, label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        window.show().map_err(|error| error.to_string())?;
        window.set_focus().map_err(|error| error.to_string())?;
        return Ok(());
    }

    let config = panel_window_config(&label)
        .ok_or_else(|| format!("Unknown panel window: {label}"))?;

    tauri::WebviewWindowBuilder::new(
        &app,
        config.label,
        tauri::WebviewUrl::App(config.url.into()),
    )
    .title(config.title)
    .inner_size(config.width, config.height)
    .position(config.x, config.y)
    .build()
    .map_err(|error| error.to_string())?;

    Ok(())
}

#[tauri::command]
fn close_panel_window(app: tauri::AppHandle, label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        window.close().map_err(|error| error.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn close_panel_windows(app: tauri::AppHandle) -> Result<(), String> {
    for label in ["main", "eic", "mcdu"] {
        if let Some(window) = app.get_webview_window(label) {
            window.close().map_err(|error| error.to_string())?;
        }
    }

    Ok(())
}

struct PanelWindowConfig {
    label: &'static str,
    title: &'static str,
    url: &'static str,
    width: f64,
    height: f64,
    x: f64,
    y: f64,
}

fn panel_window_config(label: &str) -> Option<PanelWindowConfig> {
    match label {
        "main" => Some(PanelWindowConfig {
            label: "main",
            title: "PFD / MFD",
            url: "index.html",
            width: 1200.0,
            height: 700.0,
            x: 0.0,
            y: 0.0,
        }),
        "eic" => Some(PanelWindowConfig {
            label: "eic",
            title: "EIC",
            url: "eic.html",
            width: 800.0,
            height: 500.0,
            x: 1220.0,
            y: 0.0,
        }),
        "mcdu" => Some(PanelWindowConfig {
            label: "mcdu",
            title: "MCDU",
            url: "mcdu.html",
            width: 650.0,
            height: 700.0,
            x: 1220.0,
            y: 520.0,
        }),
        _ => None,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            open_panel_window,
            close_panel_window,
            close_panel_windows
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
