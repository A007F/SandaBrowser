# Sanda Browser (متصفح ساندا)

## Vision
A next-generation browser lighter than Chromium, built using **Flutter** for UI, **WebF** for rendering, and **Rust** for the secure core.

## Architecture

### 1. WebF Environment (UI & Rendering)
We bypass traditional heavy webviews by using **WebF** (formerly Kraken).
- **Goal**: Render web interfaces and settings panels with native-like performance.
- **Memory**: Drastically lower RAM usage compared to Electron or standard WebViews.

### 2. The "Security Bridge" (AppAuth)
Authentication is strictly isolated.
- **Library**: `flutter_appauth`
- **Mechanism**: OAuth2/OIDC flows happen in a secure system browser window, never inside the browsing context.
- **Privacy**: Credentials never touch the rendering engine or JavaScript layer.

### 3. Rust Core (The Muscle)
A hidden Rust layer handles heavy lifting.
- **Security Score**: Real-time analysis of page safety, TLS headers, and tracker heuristics.
- **Networking**: Handling encrypted DNS (DoH) and Tor circuits.

## Project Structure
```
lib/
├── core/           # Rust FFI bindings & Security Logic
├── ui/             # Flutter Widgets (Address Bar, Tabs)
├── web_view/       # WebF Controller & Injection Scripts
└── auth/           # AppAuth Secure Bridge implementation
```

## Features
- **Privacy First**: No telemetry, full isolation.
- **Speed**: Rust-powered networking, WebF-powered rendering.
- **Localization**: Native RTL support for Arabic users.
