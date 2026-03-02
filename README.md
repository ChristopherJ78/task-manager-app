# TaskMaster - Modern Task Management App

TaskMaster is a modern, responsive Single Page Application (SPA) built to manage tasks effectively. It features real-time cloud synchronization, secure authentication, statistics dashboard, and a sleek dark/light mode toggle.

## Technologies Used
*   **React (Vite)**: For a fast, modern frontend development experience.
*   **Tailwind CSS**: For premium, responsive styling and animations.
*   **Supabase**: For backend capabilities: PostgreSQL database, GoTrue Authentication, and Realtime Subscriptions.
*   **Lucide React**: For beautiful, consistent iconography.

## Features
*   **Authentication**: Secure email/password login and registration via Supabase.
*   **Realtime Sync**: Tasks update instantly across all open devices.
*   **Task Management**: Create, Read, Update, Delete your tasks. Add titles, descriptions, and categories.
*   **Dashboard**: Visualize your progress with statistics and a productivity graph.
*   **Search & Filter**: Find any task quickly using the search bar or category filters.
*   **Responsive Theme**: Works beautifully on mobile and desktop, with a built-in Dark/Light mode toggle.

## Setup Instructions

Since this application relies on a Supabase backend, you need to configure your environment variables before running the application.

### 1. Supabase Setup
1. Create a free account on [Supabase.com](https://supabase.com/).
2. Create a new Database Project.
3. Access the **SQL Editor** in your Supabase dashboard and run the SQL script found in `src/lib/database.sql` to initialize your database tables and security policies.

### 2. Local Environment Configuration
1. Clone this repository.
2. In the root folder of the project, duplicate the `.env.example` file and rename it to `.env.local`.
3. Fill in your project credentials found in your Supabase project settings (Project Settings -> API):
   ```env
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

### 3. Run Locally
You will need [Node.js](https://nodejs.org/) installed on your machine.
Open a terminal in this project's root folder and run:
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment Info (Vercel)
This application is designed to be easily deployed to [Vercel](https://vercel.com).
1. Push this code to a public GitHub repository.
2. Connect the repository to your Vercel account.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Environment Variables in your Vercel project deployment settings.
4. Deploy!
