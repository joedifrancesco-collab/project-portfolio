-- Run this script in SSMS to create the ProjectPortfolio database and tables.

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ProjectPortfolio')
BEGIN
    CREATE DATABASE ProjectPortfolio;
END
GO

USE ProjectPortfolio;
GO

-- Projects
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Projects')
BEGIN
    CREATE TABLE Projects (
        id            NVARCHAR(50)  PRIMARY KEY,
        name          NVARCHAR(255) NOT NULL,
        status        NVARCHAR(50)  NOT NULL DEFAULT 'Planning',
        category      NVARCHAR(100) NULL,
        businessUnit  NVARCHAR(100) NULL,
        businessSponsor NVARCHAR(100) NULL,
        description   NVARCHAR(MAX) NULL,
        createdAt     DATETIME2     DEFAULT GETDATE(),
        updatedAt     DATETIME2     DEFAULT GETDATE()
    );
END
GO

-- Tasks
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tasks')
BEGIN
    CREATE TABLE Tasks (
        id        NVARCHAR(50)  PRIMARY KEY,
        projectId NVARCHAR(50)  NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
        title     NVARCHAR(255) NOT NULL,
        status    NVARCHAR(50)  NOT NULL DEFAULT 'Not Started',
        assignee  NVARCHAR(100) NULL
    );
END
GO

-- Documents
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Documents')
BEGIN
    CREATE TABLE Documents (
        id          NVARCHAR(50)  PRIMARY KEY,
        projectId   NVARCHAR(50)  NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
        name        NVARCHAR(255) NOT NULL,
        type        NVARCHAR(50)  NULL,
        url         NVARCHAR(500) NULL,
        uploadedAt  NVARCHAR(50)  NULL
    );
END
GO

-- Notes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Notes')
BEGIN
    CREATE TABLE Notes (
        id        NVARCHAR(50)  PRIMARY KEY,
        projectId NVARCHAR(50)  NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
        text      NVARCHAR(MAX) NOT NULL,
        createdAt NVARCHAR(50)  NULL
    );
END
GO

-- Categories
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE Categories (
        id   INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL
    );
END
GO

-- BusinessUnits
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BusinessUnits')
BEGIN
    CREATE TABLE BusinessUnits (
        id   INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL
    );
END
GO
