# Blottr.fr Project Overview

## Purpose

Blottr.fr is a web application built with AdonisJS 6 and React using Inertia.js. Based on the git status and legacy directory, this appears to be a tattoo/artist booking platform that has undergone significant refactoring from a more complex system to a simplified version.

## Tech Stack

- **Backend**: AdonisJS 6 (Node.js framework)
- **Frontend**: React 19 with Inertia.js for SPA-like experience
- **Database**: PostgreSQL with Lucid ORM
- **Build Tools**: Vite, TypeScript
- **Styling**: CSS (custom styling visible in home page)
- **Authentication**: AdonisJS Auth with session-based authentication
- **Validation**: Vine.js for form validation
- **Testing**: Japa testing framework

## Architecture

- **Monolithic SPA**: Uses Inertia.js to create SPA experience without separate API
- **SSR Support**: Configured for server-side rendering with React
- **MVC Pattern**: Controllers, models, middleware following AdonisJS conventions
- **Database**: PostgreSQL with single users table (simplified from previous complex schema)

## Current State

- Minimal viable setup with basic user authentication
- Single route to home page
- Extensive cleanup performed (many files deleted in git status)
- Legacy directory suggests previous complex implementation was simplified
