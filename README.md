# Lotte Interview - Document Management System

A React-based application for managing documents with features such as search, filtering, sorting, bulk CSV import, and a role-based demo for Admin/Staff users.

## Main Features

- Display a document list in a table format
- Search by title or document code
- Filter by status and category
- Bulk import from CSV (csv file with 10k rows for test in ./public/documents.csv)
- Role-based UI demo for Admin/Staff
- Use mock APIs in development so the app can run locally without a real backend

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- SCSS
- Material UI
- TanStack React Query
- TanStack React Table
- MSW (Mock Service Worker)

## System Requirements

- Node.js 18.x or later (Node.js 20 LTS is recommended)
- npm 9.x or later, or yarn 1.22+
- Git

## Local Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ducbang26/lotte-interview.git
   cd lotte-interview
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   Or with Yarn:

   ```bash
   yarn install
   ```

3. Start the application in development mode:

   ```bash
   npm run dev
   ```

   Or:

   ```bash
   yarn dev
   ```

4. Open your browser at:

   ```text
   http://localhost:5173/
   ```

   If port 5173 is already in use, Vite will automatically suggest a new port.

## Useful Commands

- Start the development server:

  ```bash
  npm run dev
  ```

- Build for production:

  ```bash
  npm run build
  ```

- Preview the production build locally:

  ```bash
  npm run preview
  ```

- Run lint:

  ```bash
  npm run lint
  ```

## Main Project Structure

```text
src/
  components/     # UI components
  context/        # Shared context state
  hooks/          # Custom hooks
  mocks/          # Mock API using MSW
  services/       # API handlers and schema
  styles/         # SCSS and Tailwind styles
```

## Important Notes

- In development mode, the app is configured to use MSW, so you can run it locally without a real backend.
- If you encounter missing dependency errors, run:

  ```bash
  npm install
  ```

## Troubleshooting

- If the terminal reports that port 5173 is already in use, use the new port suggested by Vite.
- If the app does not display data, make sure the dev server is running and you opened the correct URL.
- If you want to start over, remove the node_modules and package-lock.json folders and run npm install again.
