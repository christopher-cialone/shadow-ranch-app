# Shadow Ranch - A Solana Learning Adventure

Shadow Ranch is a gamified educational platform designed to teach Solana blockchain development through an immersive, Western-themed experience. Students embark on a journey where they complete coding challenges, earn rewards, and build their virtual ranch, all while learning the fundamentals of Rust, Anchor, and the Solana ecosystem.

## Table of Contents
- [Project Genesis: The Replit Era](#project-genesis-the-replit-era)
- [Transition to Local Development](#transition-to-local-development)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Local Development Setup](#local-development-setup)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Changelog](#changelog)

## Project Genesis: The Replit Era

This project began its life on the [Replit](https://replit.com/) platform, which provided a powerful and seamless environment for rapid prototyping and browser-based development. The initial architecture was heavily integrated with Replit's services, utilizing:

- **Replit's Nix-based Environment**: The project was configured to run within a Node.js 20 environment with a PostgreSQL 16 database service.
- **Vite Plugins for Replit**: It used packages like `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-runtime-error-modal` to enhance the development experience directly within the Replit workspace.
- **Integrated Development and Deployment**: Replit's "Run" button was configured to concurrently start the backend server and frontend development server, making it easy to test and iterate quickly.

This approach allowed for a focus on building features and educational content without the overhead of local environment management.

## Transition to Local Development

The project has since been refactored to be platform-agnostic, enabling development and deployment outside of the Replit ecosystem. This transition involved:

- **Removing Replit Dependencies**: All Replit-specific packages and configurations were removed from `package.json` and `vite.config.ts`.
- **Standardizing Environment Handling**: The code was updated to use standard Node.js practices for path resolution and environment variables, ensuring it can run on any local machine.
- **Updating Documentation**: The project's documentation was overhauled to provide clear instructions for local setup.

The application is now fully configured for local development while retaining its core architecture and features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight, component-based routing
- **State Management**: Zustand for efficient and minimalistic global state management
- **UI Framework**: A custom Western-themed component library built on Radix UI primitives for accessibility and unstyled flexibility.
- **Styling**: Tailwind CSS with custom Western and "tech" themes.
- **Code Editor**: Monaco Editor integrated for an in-browser IDE experience.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES Modules
- **API Pattern**: RESTful APIs for lesson management, progress tracking, and game state.
- **Development**: Integrated with Vite's development server for a seamless hot-reloading experience.

### Data Storage Strategy
- **Interface-Driven**: A flexible `IStorage` interface defines all data operations, allowing for different storage backends.
- **Current Implementation**: In-memory storage using Zustand, suitable for development and easy to get started.
- **Future-Ready**: The project includes a Drizzle ORM setup for a seamless transition to a PostgreSQL database.

## Key Features
- **Interactive Coding Lessons**: Multi-step coding challenges with progressive difficulty.
- **In-Browser Validation**: Real-time pattern-matching validation for code submissions.
- **Gamified Mechanics**: A virtual ranch, experience points (XP), and an in-game currency system.
- **NFT Rewards**: Players earn NFT badges upon completing challenges.
- **Dual UI Themes**: A unique user interface that combines a rustic Western aesthetic with a futuristic "tech" overlay.

## Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/christopher-cialone/shadow-ranch-app.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd shadow-ranch-app
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   This command starts the backend Express server on port 5000 and integrates the Vite development server via middleware.

5. **Open the application:**
   Open your web browser and navigate to `http://localhost:5000`.

## Available Scripts

- `npm run dev`: Starts the application in development mode with hot reloading.
- `npm run build`: Compiles the frontend and backend for production. The output is placed in the `dist/` directory.
- `npm run start`: Runs the production-ready server from the `dist/` directory.
- `npm run check`: Runs the TypeScript compiler to check for type errors.

## Project Structure

```
.
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── data/        # Lesson content and code templates
│   │   ├── hooks/       # Custom React hooks (state management)
│   │   ├── pages/       # Page components for each route
│   │   └── ...
│   └── index.html       # Entry point for Vite
├── server/              # Express.js backend API
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data storage implementation
│   └── index.ts         # Main server entry point
├── shared/              # Code shared between client and server
│   └── schema.ts        # Database schema for Drizzle ORM
├── dist/                # Production build output
└── .gitignore           # Files and directories ignored by Git
```

## Deployment

The application is built into a production-ready state using the `npm run build` command.

1.  **Frontend Build**: Vite compiles the React application into static assets located in `dist/public`.
2.  **Backend Build**: ESBuild bundles the Express server into `dist/index.js`.
3.  **Static Serving**: The production Node.js server is configured to serve the static frontend assets from `dist/public` and handle all API requests.

## Changelog
- **June 18, 2025**: Enhanced V6 Interactive Ethos Implementation Complete. Rebuilt comprehensive cypherpunk ethos curriculum and added an interactive quiz system.
- **June 17, 2025**: Implemented comprehensive cypherpunk ethos and history curriculum. Added foundational lessons and enhanced the lesson interface.
- **June 15, 2025**: Initial project setup on the Replit platform.
- **Recent**: Refactored the application to be platform-agnostic for local development and removed all Replit-specific dependencies.

