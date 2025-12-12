# Security Headers Simulator

An interactive, educational simulator that demonstrates the effects of HTTP security headers (CSP, HSTS, X-Frame-Options, etc.) through visual feedback and simulated usage scenarios.

## Features

- **Header Toggle Panel**: Configure CSP, X-Frame-Options, HSTS, CORS, and more.
- **Visual Simulation Area**:
  - **Target App**: A mocked dashboard showing real-time security status.
  - **Attacker Site**: Simulates Clickjacking and Cross-Origin attacks to test your policy.
- **Inspector Panel**: See the exact response headers and simulated browser console logs.
- **Presets**: Quickly switch between "Minimal", "Strict", and "API" configurations.
- **Learn Mode**: In-app educational modules explaining each header.
- **Export & Share**: Download configs as JSON or share via URL.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

1. Clone the repo:

   ```bash
   git clone <repo-url>
   cd security-headers-simulator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

### Running with Docker

1. Build the image:

   ```bash
   docker build -t security-headers-simulator .
   ```

2. Run the container:

   ```bash
   docker run -p 8080:80 security-headers-simulator
   ```

3. Open `http://localhost:8080`.

## Architecture

- **Core Logic**: Pure TypeScript policy evaluator (`src/core/policyEvaluator.ts`).
- **UI**: React + Vite + CSS Modules.
- **State**: React Context with useReducer for undo/redo history.
- **Tests**: Vitest for unit testing core logic.

## Limitations

This is a **simulator**, not a security scanner.

- "Attacks" are logic checks rendered in the UI, not real exploits.
- Browser behavior is mimicked for educational purposes.

## License

MIT
