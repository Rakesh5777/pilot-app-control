# Project Title

This project is a React application that uses a JSON server for its mock backend.

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed Node.js and npm (or yarn).

## Getting Started

To get the project up and running, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Application

To run both the frontend development server and the mock JSON server concurrently, you can use two separate terminal windows:

**Terminal 1: Start the React development server**
```bash
npm run dev
# or
yarn dev
```
This will typically start the frontend application on `http://localhost:5173`.

**Terminal 2: Start the JSON mock server**
```bash
npm run serve:json
# or
yarn serve:json
```
This will start the JSON server, usually on `http://localhost:3001`. The data for the mock server is located in `src/mocks/db.json`.

Now you can open your browser and navigate to the frontend application's URL to see it in action, interacting with the mock backend.

## Available Scripts

In the project directory, you can run the following scripts:

* `npm run dev` or `yarn dev`: Runs the app in development mode.
* `npm run build` or `yarn build`: Builds the app for production.
* `npm run lint` or `yarn lint`: Lints the project files.
* `npm run preview` or `yarn preview`: Serves the production build locally for preview.
* `npm run serve:json` or `yarn serve:json`: Starts the JSON mock server.
* `npm run theme:gen` or `yarn theme:gen`: Generates theme typings from `src/theme/index.ts`.
* `npm run theme:watch` or `yarn theme:watch`: Watches `src/theme/index.ts` and regenerates theme typings on changes.

## Project Structure

```
.
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, icons, etc.
│   ├── axios/               # Axios instances and API call definitions
│   ├── components/          # Reusable UI components
│   ├── mocks/               # JSON server mock data
│   │   └── db.json          # Mock database
│   ├── pages/               # Page-level components (routes)
│   ├── store/               # Zustand stores for state management
│   ├── theme/               # Chakra UI theme configuration
│   ├── index.css            # Global CSS
│   ├── main.tsx             # Main application entry point
│   ├── routes.tsx           # Application routing setup
│   └── vite-env.d.ts        # Vite environment type definitions
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML file
├── package.json             # Project metadata and dependencies
├── README.md                # This file
├── tsconfig.app.json        # TypeScript configuration for the application
├── tsconfig.json            # Base TypeScript configuration
├── tsconfig.node.json       # TypeScript configuration for Node.js scripts (like Vite config)
└── vite.config.ts           # Vite configuration
```
