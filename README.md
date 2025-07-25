# Dashboard App

> The current main branch of the app is hosted at: [dashboard-next-js-two-chi.vercel.app](https://dashboard-next-js-two-chi.vercel.app)

This is Next.js learning project created with `create-next-app`. Project goal is to create project dashboard like in Asana using Next.js with PostgreSQL.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Set up your environment variables in a `.env` file at the project root (see example in the repo or ask your admin for credentials).

### Run Database Migrations

Apply the Prisma schema to your database:

```bash
pnpm exec prisma migrate dev --name init
```

### Seed the Database

Populate the database with test data:

```bash
pnpm exec ts-node prisma/seed.ts
```

### Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
