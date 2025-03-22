This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# Next.js Mentions App


A modern real-time commenting application built with Next.js, featuring @mentions, notifications, and collaborative features.


## Features


- 🔔 **@Mentions System**: Tag users in comments with notifications
- 💬 **Real-time Comments**: Instantly see comments and replies
- 👥 **Presence Indicators**: See who's online and active
- 🎭 **User Authentication**: Secure login with Clerk
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌙 **Dark/Light Mode**: Choose your preferred theme
- 📊 **Notification Center**: Track mentions and replies
- 🧪 **Testing**: Jest setup for unit and integration tests
- 🔒 **PostgreSQL Database**: Secure data storage with Prisma ORM


## Tech Stack


- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Features**: Velt
- **UI Components**: Radix UI
- **Testing**: Jest and React Testing Library
- **Styling**: TailwindCSS with class-variance-authority
- **API**: Next.js API Routes
- **Type Safety**: TypeScript


## Getting Started


### Prerequisites


- Node.js 20.x or later
- PostgreSQL database
- Clerk account for authentication
- Velt account for real-time features


### Installation


1. Clone the repository:


   ```bash
   git clone https://your-repository-url.git
   cd my-next-mentions-app
   ```


2. Install dependencies:


   ```bash
   npm install
   ```


3. Set up environment variables:


   - Copy `.env.example` to `.env.local` and fill in the required values:
     ```bash
     cp .env.example .env.local
     ```


4. Initialize the database:


   ```bash
   npx prisma migrate dev --name init
   ```


5. Run the development server:


   ```bash
   npm run dev
   ```


6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.


## Environment Variables


Create a `.env.local` file with the following variables:


```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name"


# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/


# Velt Real-time Collaboration
NEXT_PUBLIC_VELT_API_KEY=your_velt_api_key


# Rate Limiting
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW_MS=60000
```


## Project Structure


- `src/app/`: Next.js App Router components and pages
- `src/components/`: Reusable UI components
- `src/lib/`: Utility functions and shared logic
- `src/hooks/`: Custom React hooks
- `src/contexts/`: React context providers
- `src/types/`: TypeScript type definitions
- `prisma/`: Database schema and migrations


## Database Schema


This application uses a PostgreSQL database with Prisma ORM. The main models are:


- **Comment**: Stores comment content and metadata
- **Mention**: Tracks user mentions within comments
- **Notification**: Records notifications for mentioned users


## Authentication


User authentication is handled by Clerk. The middleware ensures that protected routes require authentication, while allowing public API routes for certain functionality.


## Testing


Run the test suite with:


```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```


## Deployment


This application can be deployed on Vercel or any other platform that supports Next.js applications.


```bash
npm run build
npm run start
```


## License


[Add your license information here]



