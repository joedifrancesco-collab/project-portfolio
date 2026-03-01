# Project Portfolio

A web-based application that helps users organize, maintain, and track multiple projects in one place.

## Features

- **Project list** — left sidebar lists all projects with status badge and priority; supports real-time text search
- **Project properties** — editable metadata (name, status, priority, owner, start/target date, budget, description)
- **Tasks** — per-project task list with status tracking (Not Started / In Progress / Done) and assignee
- **Documents** — per-project document registry with type icons and optional URL links
- **Notes** — date/time stamped notes log, newest first
- **Local persistence** — all data is saved to the browser's `localStorage`; no backend required

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
