-- Run this script in psql to create the tables in the project_portfolio database.
-- psql -U portfolio_user -d project_portfolio -f schema.sql

-- Projects
CREATE TABLE IF NOT EXISTS Projects (
    id              VARCHAR(50)  PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    status          VARCHAR(50)  NOT NULL DEFAULT 'Planning',
    category        VARCHAR(100),
    businessUnit    VARCHAR(100),
    businessSponsor VARCHAR(100),
    description     TEXT,
    createdAt       TIMESTAMP    DEFAULT NOW(),
    updatedAt       TIMESTAMP    DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS Tasks (
    id        VARCHAR(50)  PRIMARY KEY,
    projectId VARCHAR(50)  NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    title     VARCHAR(255) NOT NULL,
    status    VARCHAR(50)  NOT NULL DEFAULT 'Not Started',
    assignee  VARCHAR(100)
);

-- Documents
CREATE TABLE IF NOT EXISTS Documents (
    id         VARCHAR(50)  PRIMARY KEY,
    projectId  VARCHAR(50)  NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    name       VARCHAR(255) NOT NULL,
    type       VARCHAR(50),
    url        VARCHAR(500),
    uploadedAt VARCHAR(50)
);

-- Notes
CREATE TABLE IF NOT EXISTS Notes (
    id        VARCHAR(50) PRIMARY KEY,
    projectId VARCHAR(50) NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    text      TEXT        NOT NULL,
    createdAt VARCHAR(50)
);

-- Categories
CREATE TABLE IF NOT EXISTS Categories (
    id   SERIAL       PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- BusinessUnits
CREATE TABLE IF NOT EXISTS BusinessUnits (
    id   SERIAL       PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
