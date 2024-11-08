# GUI Project

This project is a Next.js-based GUI application with WebSocket support. It's designed to work on **Node.js v20.18** and **Ubuntu 20.04**. Below are the instructions to set up, build, and run the application.

## Prerequisites

- **Node.js**: v20.18 (ensure compatibility)
- **NPM**: Use the version bundled with Node.js 20.18 or update to the latest compatible version.

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd gui

    Install dependencies:

    npm install

Running the Development Server

To start the development server, run:

npm run dev

The app will be available at http://localhost:3000.
WebSocket Server

The WebSocket server runs on localhost at port 4000. It uses the ws and socket.io libraries to handle WebSocket connections. Ensure that your client code is configured to connect to this port.
Available Scripts

    npm run dev: Start the development server
    npm run build: Build the production-ready app
    npm run start: Start the production server
    npm run lint: Run linter checks

Project Structure

    pages/: Contains Next.js pages
    components/: Reusable React components
    styles/: CSS files and Tailwind CSS configuration

Dependencies
Main

    next: ^15.0.2
    react: 19.0.0 (release candidate)
    react-dom: 19.0.0 (release candidate)
    react-icons: ^5.3.0
    socket.io: ^4.8.1
    ws: ^8.18.0

Development

    postcss: ^8
    tailwindcss: ^3.4.1
