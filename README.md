# Ihsan's Portfolio

A retro terminal portfolio with a vintage CRT-styled design. Uses plain HTML, CSS, and JS.

**Live:** [ihsan.is-a.dev](https://ihsan.is-a.dev)

## Design

Embraces a **retro terminal** aesthetic.

Key principles:
- **CRT Phosphor Effect:** Simulated scanlines and screen flicker overlay with hardware acceleration.
- **Monospaced Typography:**VT323 for retro headers and Share Tech Mono for the layout text.
- **Dynamic Terminal HUD:** Brackets, ascii lines, and interactive boot sequence on initial load.
- **Matrix Background:** Falling data-rain rendered in canvas.

## Technologies

- **Frontend:** HTML, CSS, JavaScript
- **Styling:** Tailwind CSS
- **Fonts:** Google Fonts

## Development

Start a local HTTP server:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
```

Open `http://localhost:8000` (or `http://localhost:3000`) in your browser.
