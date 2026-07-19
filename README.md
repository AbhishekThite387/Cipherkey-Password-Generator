# Cipherkey — Secure Password Generator

A production-quality password generator built with **React**, **JavaScript (ES6+)**, and **plain CSS**. Every password is generated locally in the browser with the **Web Crypto API** — nothing is ever sent to a server or written to persistent storage.

## Features

- 🔐 Cryptographically secure generation via `crypto.getRandomValues()` (rejection sampling, no modulo bias)
- 🎚️ Adjustable length (4–64 characters)
- 🔤 Uppercase, lowercase, number, and symbol toggles
- 📋 One-click copy with visual feedback
- 🔁 Instant regeneration
- 📊 Live strength meter with a 5-level "signal" indicator
- 🧮 Entropy calculation (bits), shown alongside strength
- ⚡ Three quick presets: Easy to Remember, Strong, Maximum Security
- ⚙️ Advanced options: exclude similar characters, exclude ambiguous symbols, no consecutive repeats
- 🕘 Session-only password history (last 5), with per-item copy and a confirm-to-clear control
- 🌗 Light and dark themes (only the theme preference is persisted, never passwords)
- 📱 Fully responsive, down to small mobile widths
- ♿ Accessible: semantic HTML, ARIA labeling, visible keyboard focus, reduced-motion support

## Tech Stack

- React 18
- Vite 5
- Plain CSS with custom properties (no Tailwind, no Bootstrap, no UI kits)
- Web Crypto API / Clipboard API

## Getting Started

### Prerequisites

- Node.js 14+
- npm 6+

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

The app opens automatically at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
password-generator/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── PasswordDisplay.jsx
│   │   ├── PasswordOptions.jsx
│   │   ├── PasswordStrength.jsx
│   │   ├── PasswordPresets.jsx
│   │   ├── AdvancedOptions.jsx
│   │   ├── PasswordHistory.jsx
│   │   ├── SecurityInfo.jsx
│   │   └── Footer.jsx
│   ├── utils/
│   │   ├── passwordGenerator.js
│   │   └── passwordStrength.js
│   ├── styles/
│   │   ├── global.css
│   │   └── components.css
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

## Security & Privacy Notes

- Passwords are generated with `crypto.getRandomValues()`, not `Math.random()`.
- Generated passwords are **never** written to `localStorage`, `sessionStorage`, or sent anywhere over the network.
- The password history list lives only in React state (memory) for the current tab and disappears on reload or close.
- The **only** value persisted to `localStorage` is the light/dark theme preference (`passwordGeneratorTheme`).

## License

Free to use for personal or portfolio purposes.
