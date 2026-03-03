# Project Portfolio

A web-based application that helps users organize, maintain, and track multiple projects in one place. Data is persisted in a SQL Server database via a Node.js/Express REST API.

## Features

- **Project list** — left sidebar lists all projects with status badge and category; supports real-time text search
- **Project properties** — editable metadata (name, description, status, category, business unit, business sponsor) with dropdowns driven by database lookup tables
- **Tasks** — per-project task list with status tracking (Not Started / In Progress / Done) and assignee
- **Documents** — per-project document registry with type icons and optional URL links
- **Notes** — date/time stamped notes log, newest first
- **REST API** — full CRUD Express backend; all data persisted in Microsoft SQL Server

## Prerequisites

- **[Node.js](https://nodejs.org/) v18 or newer** (includes `npm`)
- **Microsoft SQL Server** — SQL Server Express (free) works fine. Download from [https://www.microsoft.com/en-us/sql-server/sql-server-downloads](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **[SSMS](https://aka.ms/ssmsfullsetup)** or Azure Data Studio (optional, for running schema scripts)
- Any modern browser (Chrome, Edge, Firefox, Safari)

To verify Node.js is installed:

```bash
node --version   # should print v18.x or higher
npm --version
```

## Getting Started

### 1. Create the database

Open SSMS (or Azure Data Studio), connect to your SQL Server instance, and run the script at `server/schema.sql`. This creates the `ProjectPortfolio` database and all tables.

### 2. Configure the API server

Copy the example environment file and fill in your SQL Server credentials:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=ProjectPortfolio
DB_USER=your_sql_login
DB_PASSWORD=your_password
```

> **Windows Authentication:** If you use Windows Auth, leave `DB_USER` and `DB_PASSWORD` blank and set `trustedConnection=true` in `server/db.js`.

### 3. Install dependencies

```bash
# Root (React + Vite)
npm install

# API server
cd server && npm install && cd ..
```

### 4. Seed sample data (optional)

```bash
npm run seed
```

This populates the database with 3 sample projects and seeds the Categories and BusinessUnits lookup tables.

### 5. Start the app

```bash
npm run start
```

This starts both the API server (port `3001`) and the Vite dev server (port `5173`) concurrently.

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start API server + Vite dev server together |
| `npm run dev` | Start only the Vite dev server |
| `npm run server` | Start only the Express API server |
| `npm run seed` | Seed the database with sample data |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all projects (with tasks, documents, notes) |
| `GET` | `/api/projects/:id` | Get a single project |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete a project |
| `GET` | `/api/categories` | List all categories |
| `GET` | `/api/business-units` | List all business units |

## Project Structure

```
project-portfolio/
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── hooks/            # Custom hooks (useProjects, useLookups, …)
│   └── data/             # Sample data fallback
├── server/               # Express API
│   ├── routes/
│   │   ├── projects.js   # Project CRUD routes
│   │   └── lookup.js     # Categories & BusinessUnits routes
│   ├── db.js             # SQL Server connection pool
│   ├── schema.sql        # Database schema
│   └── seed.js           # Sample data seeder
└── public/
```

## Tech Stack

- [React 19](https://react.dev)
- [Vite](https://vite.dev)
- [Express](https://expressjs.com) — REST API
- [mssql](https://www.npmjs.com/package/mssql) — SQL Server driver
- Microsoft SQL Server (Express or higher)
