# preorder-manager

A preorder management tool built with Next.js. You can create preorders, set when they're active, and manage them from a simple list view. Built this to learn how to properly structure a Next.js app with server and client components, connect to a real database, and handle CRUD operations end to end.

## [Live-Link](https://preorder-manager-c8bi.vercel.app/)

## What it does

- Create and update preorders with a shared form page
- List all preorders in a table with filter, sort, and pagination
- Toggle preorder status directly from the list (updates the database instantly)
- Delete preorders from the list
- Preorder when options: regardless of stock, or only when out of stock

## Tech stack

- Next.js 15 with TypeScript
- Prisma 7 as the ORM
- Turso (SQLite) as the database
- Tailwind CSS v4 for styling
- shadcn/ui for components

## Project structure

```
app/
 
  api/
    preorders/
      route.ts            POST to create, GET to list
      [id]/
        route.ts          PATCH for status, PUT for full update, DELETE
  dashboard/
    page.tsx              server component, fetches data from DB
    preorderForm/
      page.tsx            server component, handles create and update mode
components/
  preorders/
    types.ts              shared TypeScript types
    preorder-list.tsx     client component, handles filter/sort/pagination
    preorder-actions.tsx  client component, edit and delete buttons
    status-toggle.tsx     client component, status switch with optimistic update
    preorder-form.tsx       client component, the create/update form

lib/
  schema.ts                   Prisma client setup with Turso adapter

prisma/
  schema.prisma           database schema
```

## Getting started

Clone the repo and install dependencies.

```bash
npm install
```

Set up your environment variables. Create a `.env` file in the root:

```
LOCAL_DATABASE_URL="file:./prisma/dev.db"
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-token-here"
```

`LOCAL_DATABASE_URL` is only used when running migrations locally. The app uses `TURSO_DATABASE_URL` at runtime.

Run the migration to create the database tables:

```bash
npx prisma migrate dev --name init
```

Then push the migration SQL to your Turso database using the Turso dashboard shell or CLI.

Generate the Prisma client:

```bash
npx prisma generate
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000/`.

## How create and update work on the same page

The form page at `/dashboar/preorderForm` serves both create and update. If there's no `id` in the URL, it renders an empty form. If there's an `id`, the server component fetches that preorder from the database and passes the data down as props.

```
/dashboard/preorderForm         create mode, no initial data
/dashboard/preorderForm?id=123  update mode, fetches preorder 123
```

The form component receives a `mode` prop which is either `"create"` or `"update"`, and it uses that to decide which API endpoint to call on submit.

## A note on filtering and sorting

Right now all filtering, sorting, and pagination happen on the client side. The server fetches all preorders at once and passes them to the list component. This is fine for the scale this app is meant for. If the data grows into thousands of rows, it would make sense to move these to the server using searchParams and database-level queries.

## Known issues and things to improve

The `createdAt` sort uses `id` as a proxy since cuid IDs are roughly time-ordered. This works but isn't ideal. A proper `createdAt` field sort would be cleaner.

There's no authentication yet. Anyone who can reach the URL can create or delete preorders.

Error handling in the form is minimal. A proper setup would show field-level errors returned from the server, not just a toast.