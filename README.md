# QuickTask

A Collaborative To-Do App with Auth & Realtime Updates

## Features

- **User Authentication**: Email/password and Google OAuth via Supabase Auth
- **Task List Management**: Create/manage task lists with title, description, due date, priority
- **Collaboration**: Share task lists with other users
- **Real-time Updates**: Real-time task updates using Supabase Realtime or WebSockets
- **Task Operations**: Mark tasks complete, delete, and edit
- **Theme Toggle**: Dark/light theme toggle
- **Responsive Design**: Responsive UI for Mobile and Desktop

## Authentication

The app supports two authentication methods:

1. **Email/Password**: Traditional email and password authentication
2. **Google OAuth**: One-click sign-in with Google

### Google OAuth Setup

To enable Google authentication, you need to:

1. Create a Google OAuth application in the [Google Cloud Console](https://console.cloud.google.com/)
2. Configure the OAuth consent screen
3. Add your domain to authorized origins
4. Add the redirect URI: `https://your-supabase-project.supabase.co/auth/v1/callback`
5. Add the environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Supabase Configuration

Make sure to configure Google as an OAuth provider in your Supabase dashboard:

1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google Client ID and Client Secret
4. Configure the redirect URL

## Error Handling

The application provides user-friendly error messages for common authentication scenarios:

### Login Errors
- **Invalid credentials**: "Email or password is incorrect. Please try again."
- **Unconfirmed email**: "Please check your email and click the confirmation link before signing in."
- **Rate limiting**: "Too many login attempts. Please wait a few minutes before trying again."
- **Invalid email format**: "Please enter a valid email address."

### Registration Errors
- **Existing account**: "An account with this email already exists. Please try logging in instead."
- **Weak password**: "Password must be at least 6 characters long."
- **Invalid email**: "Please enter a valid email address."

### Google OAuth Errors
- **Provider disabled**: "Google sign-in is not available at the moment. Please try signing in with email and password."
- **User cancelled**: "Sign-in was cancelled. Please try again."
- **Access denied**: "Access was denied. Please allow permissions to continue with Google sign-in."

All technical error messages from Supabase are converted to user-friendly messages to improve the user experience.

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Shadcn UI
- **Backend Options**: API routes in Next.js, Supabase/Prisma
- **Authentication Options**: NextAuth.js, Supabase Auth
- **Realtime Options**: Supabase Realtime, Socket.IO
- **Deployment**: Vercel

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/yourusername/quicktask.git
cd quicktask
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - React components
- `/src/constants` - Application constants
- `/src/lib` - Utility functions and libraries
- `/src/config` - Configuration files

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)

## License

This project is licensed under the MIT License.
