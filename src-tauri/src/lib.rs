use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      #[cfg(not(debug_assertions))]
      {
        if let Some(window) = app.get_webview_window("main") {
          let _ = window.eval(r#"
            window.location.reload = () => {};
            window.addEventListener('keydown', (e) => {
              if (['F3', 'F5', 'F6', 'F11'].includes(e.key)) e.preventDefault();
              if (e.ctrlKey || e.metaKey) {
                if (['r', 'R', 'f', 'F', 'p', 'P', 's', 'S'].includes(e.key)) e.preventDefault();
              }
            });
          "#);
        }
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}