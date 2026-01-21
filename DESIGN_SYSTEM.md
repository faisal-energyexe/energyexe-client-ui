# EnergyExe Client UI Design System

## Theme: Obsidian

Single theme with light/dark mode support. Toggle via `useTheme()` hook.

```tsx
const { mode, toggleMode } = useTheme()
```

---

## Color Palette (OKLCH)

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `background` | `oklch(0.98 0.005 240)` | `oklch(0.12 0.035 240)` | Page background |
| `foreground` | `oklch(0.15 0.04 240)` | `oklch(0.92 0.015 220)` | Primary text |
| `card` | `oklch(1 0 0)` | `oklch(0.18 0.045 240)` | Card surfaces |
| `primary` | `oklch(0.50 0.22 250)` | `oklch(0.65 0.20 250)` | Primary actions (blue) |
| `accent` | `oklch(0.50 0.12 195)` | `oklch(0.80 0.15 195)` | Secondary accent (cyan) |
| `muted` | `oklch(0.95 0.008 240)` | `oklch(0.22 0.04 240)` | Muted backgrounds |
| `muted-foreground` | `oklch(0.45 0.02 240)` | `oklch(0.55 0.025 230)` | Secondary text |
| `border` | `oklch(0.90 0.01 240)` | `oklch(0.35 0.06 240)` | Borders |
| `destructive` | `oklch(0.55 0.22 25)` | `oklch(0.60 0.25 25)` | Error/danger |

### Semantic Colors
- **Success**: `oklch(0.70 0.15 170)` - Teal
- **Warning**: `oklch(0.75 0.18 80)` - Amber
- **Error**: `oklch(0.65 0.25 25)` - Red

---

## Tailwind Usage

Use semantic color classes that auto-switch with theme:

```tsx
// Backgrounds
className="bg-background"      // Page background
className="bg-card"            // Card surfaces
className="bg-primary"         // Primary buttons
className="bg-muted"           // Muted sections
className="bg-sidebar"         // Sidebar background

// Text
className="text-foreground"           // Primary text
className="text-muted-foreground"     // Secondary text
className="text-primary"              // Accent text
className="text-primary-foreground"   // Text on primary bg

// Borders
className="border-border"        // Standard borders
className="border-sidebar-border" // Sidebar borders
```

---

## CSS Utility Classes (obsidian.css)

### Cards
```tsx
className="obsidian-card"      // Glassmorphic card with hover glow
className="obsidian-card-glow" // Animated rotating border gradient
className="stat-card"          // KPI card with shimmer line
className="glass-panel"        // Frosted glass effect
```

### Text Effects
```tsx
className="gradient-text"   // Animated gradient text
className="neon-text"       // Cyan neon glow
className="success-glow"    // Green glow
className="warning-glow"    // Amber glow
className="error-glow"      // Red glow
```

### Status Indicators
```tsx
className="status-dot online"   // Green with glow
className="status-dot warning"  // Amber with glow
className="status-dot error"    // Red with pulse
className="status-dot offline"  // Gray
```

### Interactive
```tsx
className="icon-btn"        // 40px icon button with hover glow
className="premium-badge"   // Gradient badge
className="data-row"        // Row with hover slide effect
```

### Layout
```tsx
className="obsidian-bg"       // Animated background gradient
className="obsidian-grid"     // Grid pattern overlay
className="header-blur"       // Sticky header with blur
className="section-divider"   // Gradient divider line
```

---

## Animations

| Class | Effect |
|-------|--------|
| `shimmer` | Loading shimmer |
| `pulse-active` | Glow pulse |
| `floating` | Float up/down |
| `live-indicator` | Live status pulse |

---

## Component Patterns

### Card with Glow Effect
```tsx
<div className="obsidian-card p-6">
  <h3 className="text-foreground font-semibold">Title</h3>
  <p className="text-muted-foreground">Content</p>
</div>
```

### Stat Card
```tsx
<div className="obsidian-card stat-card p-4">
  <span className="text-muted-foreground text-sm">Label</span>
  <span className="text-2xl font-bold text-foreground">1,234</span>
  <span className="success-glow text-sm">+12%</span>
</div>
```

### Status Badge
```tsx
<div className="flex items-center gap-2">
  <span className="status-dot online" />
  <span className="text-foreground">Online</span>
</div>
```

---

## Chart Colors

For Recharts/visualizations, use CSS variables:

```tsx
const chartColors = {
  primary: 'var(--chart-1)',   // Blue
  secondary: 'var(--chart-2)', // Cyan
  tertiary: 'var(--chart-3)',  // Teal
  quaternary: 'var(--chart-4)', // Purple
  quinary: 'var(--chart-5)',   // Green
  senary: 'var(--chart-6)',    // Slate blue
}
```

Or hex values for libraries that don't support CSS vars:
```tsx
// Dark mode hex equivalents
const HEX_COLORS = {
  primary: '#3B82F6',
  cyan: '#22D3EE',
  teal: '#14B8A6',
  purple: '#A855F7',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
}
```

---

## Design Rules

1. Use `bg-card` for elevated surfaces, not custom colors
2. Use `text-muted-foreground` for secondary text, never hardcode grays
3. Apply `obsidian-card` class for interactive cards that need hover effects
4. Use `stat-card` for KPI displays to get the shimmer effect
5. Border radius: `rounded-lg` (0.5rem) for cards, `rounded-xl` for large panels
6. Transitions: `transition-all duration-300` for smooth interactions
7. Always use semantic color tokens - never hardcode OKLCH values in components
