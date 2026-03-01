# Project Portfolio

A web-based application that helps users organize, maintain, and track multiple projects in one place.

## Features

- **Project list** — left sidebar lists all projects with status badge and category; supports real-time text search
- **Project properties** — editable metadata (name, short description, status, category, business unit, business sponsor)
- **Tasks** — per-project task list with status tracking (Not Started / In Progress / Done) and assignee
- **Documents** — per-project document registry with type icons and optional URL links
- **Notes** — date/time stamped notes log, newest first
- **Local persistence** — all data is saved to the browser's `localStorage`; no backend required

## Prerequisites

The only thing you need installed on your machine is **[Node.js](https://nodejs.org/) version 18 or newer** (which includes `npm`).

- **No WSL required.** The app runs natively on **Windows**, **macOS**, and **Linux**.
- Any modern browser (Chrome, Edge, Firefox, Safari) is needed to use the app once it is running.

To check whether Node.js is already installed, open a terminal and run:

```bash
node --version   # should print v18.x or higher
npm --version
```

If Node.js is not installed, download the LTS installer from [https://nodejs.org](https://nodejs.org) and follow the setup wizard (no extra configuration needed on Windows — just run the `.msi` installer).

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- [React 19](https://react.dev)
- [Vite](https://vite.dev)
- localStorage for persistence (no backend needed)
