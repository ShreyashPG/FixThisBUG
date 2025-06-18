# FixThisBug

FixThisBug is a MERN stack-powered web platform that lists bugs from public GitHub repositories to help open-source contributors easily discover issues by programming language or difficulty. Companies, GitHub repository owners, and open-source developers can submit their repositories to get listed, making it easier for contributors to find and solve relevant bugs.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Deployment](#deployment)
- [License](#license)

## Overview

FixThisBug bridges open-source repositories with developers by providing a centralized platform for browsing, filtering, and contributing to bugs in repositories listed by their owners.

### Key Benefits

- Discover relevant bugs easily by language or difficulty
- Encourage contribution to open-source
- Enable repository owners to reach a wider contributor base
- Simplify bug tracking and issue management

## Features

### Core Functionality

- Repository submission and listing
- Language and difficulty-based filtering
- Real-time bug stats and analytics
- Contributor tracking and collaboration

### User Interface

- **Dashboard**: Overview of project health and bug status
- **Bug Details**: In-depth tracking and filtering of issues

### Integrations

- **Version Control**: Git
- **Issue Trackers**: GitHub Issues
- **IDEs**: VS Code

## Installation

### Prerequisites

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Git for version control
- MongoDB 4.4+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ShreyashPG/FixThisBUG.git

# Navigate to project directory
cd FixThisBUG

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure your database connection in .env file

# Run database migrations
npm run migrate

# Start the development server
npm run dev
```

## Usage

### Getting Started

1. **Project Setup**: Connect your GitHub repository for submission

### Web Interface

Access the dashboard at `http://localhost:3000`:

- Real-time overview
- Bug browsing and filtering by language/difficulty
- Submit new repositories and issues

## Configuration

### Environment Variables

In `./FixThisBUG_Backend/.env`:

```env
DATABASE_URL=mongodb://localhost:27017/fixthisbug
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
GITHUB_TOKEN=your-github-token
```

## API Documentation

### Core Endpoints

#### Repositories

```bash
GET /api/repositories          # List all repositories
GET /api/languages             # Language statistics
GET /api/repositories/:id      # Get repository details
POST /api/submit-bug           # Submit bug report
```

**Bug Submission Example**

```json
{
  "title": "",
  "description": "",
  "repository_url": "",
  "issue_url": "",
  "language": "",
  "difficulty": "",
  "labels": [],
  "submitter_email": "",
  "submitter_name": ""
}
```

## Contributing

We welcome community contributions!

### Development Setup

```bash
git clone https://github.com/ShreyashPG/FixThisBUG.git
git checkout -b feature/your-feature-name
npm install --include=dev
npm test
npm run dev
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

- Set `NODE_ENV=production`
- Use a production-grade MongoDB cluster
- Configure SSL and reverse proxy (e.g., Nginx)
- Monitor logs and errors
- Set up database backups

## Troubleshooting

### Database Connection Errors

- Ensure MongoDB server is running
- Double-check credentials and DB URL
- Verify network/firewall settings

### Debugging

```bash
DEBUG=fixthisbug:* npm start
```

---

**Built with ❤️ by the FixThisBug Team**