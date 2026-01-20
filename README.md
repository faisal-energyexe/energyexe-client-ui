# EnergyExe Client UI

React frontend for the EnergyExe energy data analytics platform.

## Quick Start

```bash
pnpm install
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests (Vitest) |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Run Prettier |
| `pnpm check` | Format + lint |

## Tech Stack

- **React 19** + TypeScript
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching
- **Tailwind CSS** + **Shadcn UI** - Styling
- **Vite** - Build tool

---

## Feature Guides

### Adding Routes

Create a file in `src/routes/`. TanStack Router auto-generates the route.

```
src/routes/about.tsx     → /about
src/routes/users.tsx     → /users
src/routes/users.$id.tsx → /users/:id
```

### Navigation Links

```tsx
import { Link } from '@tanstack/react-router'

<Link to="/about">About</Link>
<Link to="/users/$id" params={{ id: '123' }}>User 123</Link>
```

### Data Fetching with TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['items'],
  queryFn: () => fetch('/api/items').then(res => res.json()),
})
```

### Route Loaders

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users')({
  loader: async () => {
    const res = await fetch('/api/users')
    return res.json()
  },
  component: UsersPage,
})

function UsersPage() {
  const data = Route.useLoaderData()
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### Adding Shadcn Components

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add select
```

Components are added to `src/components/ui/`.

### State Management (TanStack Store)

```tsx
import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'

const countStore = new Store(0)

function Counter() {
  const count = useStore(countStore)
  return (
    <button onClick={() => countStore.setState(n => n + 1)}>
      Count: {count}
    </button>
  )
}
```

### Environment Variables

Define in `src/env.ts`, access with type safety:

```tsx
import { env } from '@/env'
console.log(env.VITE_APP_TITLE)
```

### Layout (Root Route)

Edit `src/routes/__root.tsx` for global layout:

```tsx
export const Route = createRootRouteWithContext()({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
})
```

---

## Project Structure

```
src/
├── routes/          # File-based routes
├── components/      # React components
│   └── ui/          # Shadcn UI components
├── lib/             # Utilities
├── hooks/           # Custom hooks
├── integrations/    # Third-party integrations
├── main.tsx         # App entry point
└── styles.css       # Global styles
```
