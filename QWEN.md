# Boxlab Designer - Project Context

## Project Overview

**Boxlab Designer** is a React-based 3D speaker box design application built with Vite, TypeScript, and Three.js. It provides an interactive interface for designing and visualizing custom speaker enclosures with configurable dimensions, materials, drivers, ports, and internal bracing.

### Core Technologies

| Category | Technology |
|----------|------------|
| **Framework** | React 19.2 with TypeScript |
| **Build Tool** | Vite 7.2.4 |
| **3D Rendering** | Three.js + React Three Fiber + Drei |
| **UI Components** | shadcn/ui (40+ components) |
| **Styling** | Tailwind CSS 3.4.19 |
| **State Management** | React hooks (useState, useRef, useEffect, useMemo) |
| **Charts** | Recharts |
| **Package Manager** | pnpm |

### Architecture

```
src/
├── App.tsx              # Main application component (speaker designer logic + 3D visualization)
├── main.tsx             # Entry point
├── index.css            # Global styles + Tailwind directives
├── App.css              # App-specific styles (animations, custom classes)
├── components/
│   └── ui/              # shadcn/ui components (50+ pre-built components)
├── hooks/
│   └── use-mobile.ts    # Custom hook for mobile detection
└── lib/
    └── utils.ts         # Utility functions (cn() for class merging)
```

### Key Features

- **5 Speaker Types**: Bookshelf, Tower, Monitor, Soundbar, Boombox
- **3D Visualization**: Real-time rendering with particle effects, shadows, and environment mapping
- **Configurable Properties**:
  - Dimensions (width, height, depth)
  - Material (wood, MDF, metal, fabric)
  - Finish (matte, glossy, textured)
  - Driver configuration (type, size, position, firing direction)
  - Port design (sealed/ported/passive, circular/slot/rectangular, front/back/bottom)
  - Internal bracing (none, simple, cross, window, full)
  - Chamber configuration (single, two-way, three-way)
- **UI Controls**: Sliders, accordions, tooltips, cards, badges
- **Responsive Design**: Mobile detection hook for adaptive layouts

## Building and Running

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Commands

```bash
# Install dependencies
pnpm install

# Start development server (HMR enabled)
pnpm dev

# Build for production
pnpm build

# Lint codebase
pnpm lint

# Preview production build
pnpm preview
```

### Project Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build/dev config, path aliases (`@/*` → `./src/*`), React plugin |
| `tsconfig.json` | TypeScript root config with project references |
| `tsconfig.app.json` | App-specific TS config |
| `tsconfig.node.json` | Node/Config file TS config |
| `tailwind.config.js` | Tailwind theme, colors, animations, plugins |
| `postcss.config.js` | PostCSS configuration for Tailwind |
| `eslint.config.js` | ESLint flat config with TypeScript and React hooks rules |
| `components.json` | shadcn/ui configuration (aliases, style, icon library) |
| `pnpm-workspace.yaml` | pnpm workspace configuration |

## Development Conventions

### Code Style

- **TypeScript**: Strict typing enabled; type-aware lint rules available
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Imports**: Absolute imports via `@/` alias (e.g., `@/components/ui/button`)

### Component Patterns

```tsx
// Standard component structure
import { cn } from '@/lib/utils'

interface Props {
  // typed props
}

export function ComponentName({ prop }: Props) {
  return <div className={cn('base-classes')} />
}
```

### UI Component Usage

```tsx
// Import from shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
```

### 3D Component Patterns

```tsx
// Three.js components use react-three-fiber hooks
import { useFrame } from '@react-three/fiber'

function MeshComponent() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    // Animation loop - runs every frame
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })
  
  return <mesh ref={meshRef}>...</mesh>
}
```

### Testing Practices

- No test framework currently configured
- Consider adding Vitest (Vite-native) for unit tests
- React Testing Library recommended for component tests

### Git Workflow

- Standard Git repository
- Commit messages should be clear and concise
- Follow conventional commits if applicable

## Additional Notes

- **shadcn/ui Theme**: "new-york" style with Slate base color
- **Icon Library**: Lucide React
- **CSS Variables**: Used for theming (border, background, foreground, primary, etc.)
- **Dark Mode**: Supported via `class` strategy
- **Custom Animations**: accordion-down, accordion-up, caret-blink

## File Aliases

```json
{
  "@/*": "./src/*",
  "@/components/*": "./src/components/*",
  "@/ui/*": "./src/components/ui/*",
  "@/hooks/*": "./src/hooks/*",
  "@/lib/*": "./src/lib/*"
}
```
