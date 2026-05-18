# Custom Content Blocks

This directory contains custom content blocks that are automatically registered by the plugin system. Simply drop a new TypeScript component file here and it becomes available for use in JSON content.

## How to Create a Custom Block

### 1. Create the Component File

Create a new `.tsx` file following the naming convention: `[BlockName]Block.tsx`

```typescript
// Example: TableBlock.tsx will register as 'table' block type
export default function TableBlock({ block }) {
  // Your component logic here
  return <div>Custom table content</div>;
}
```

### 2. File Naming Convention

- **File name**: `ChartBlock.tsx` → **Block type**: `'chart'`
- **File name**: `CalendarBlock.tsx` → **Block type**: `'calendar'`
- **File name**: `CustomTableBlock.tsx` → **Block type**: `'customtable'`

The block type is automatically derived from the filename (lowercase, "Block" suffix removed).

### 3. Component Interface

Your component must accept a `block` prop with this structure:

```typescript
interface CustomBlockProps {
  readonly block: {
    readonly type: string; // Auto-detected from filename
    readonly id: string; // Unique block ID
    readonly title?: string; // Optional block title
    readonly content: YourContentType; // Your custom content schema
    readonly config?: {
      // Optional configuration
      readonly colors?: {
        // Color customization
        readonly background?: string;
        readonly border?: string;
        readonly text?: string;
        readonly accent?: string;
      };
      readonly icon?: string; // Lucide icon name
    };
  };
}
```

### 4. Integration with Color System

Use the `useColorConfig` hook to integrate with the color system:

```typescript
import { useColorConfig } from '../../hooks/useColorConfig';

export default function MyBlock({ block }) {
  const { colors, elementRef } = useColorConfig(block.config?.colors, {
    fallbackTheme: 'primary',
    validate: true,
    applyCustomProperties: true,
  });

  return (
    <div ref={elementRef}>
      <SectionBox
        title={block.title}
        borderColor={colors.border}
        bgColor={colors.background}
      >
        {/* Your content */}
      </SectionBox>
    </div>
  );
}
```

### 5. Usage in JSON

Once you create your custom block, it's immediately available in JSON:

```json
{
  "type": "your-block-type",
  "title": "My Custom Block",
  "config": {
    "colors": {
      "background": "bg-blue-50",
      "accent": "text-blue-600"
    }
  },
  "content": {
    "your": "custom data structure"
  }
}
```

## Example: Chart Block

See `ChartBlock.tsx` for a complete example that demonstrates:

- Proper TypeScript interfaces
- Color system integration
- Multiple chart types
- Configuration options
- Error handling

## Best Practices

### 1. TypeScript Interfaces

Always define proper interfaces for your content:

```typescript
interface MyBlockContent {
  readonly title: string;
  readonly items: readonly MyItem[];
  readonly showDetails?: boolean;
}
```

### 2. Error Handling

Wrap your component logic in try-catch for better error reporting:

```typescript
export default function MyBlock({ block }) {
  try {
    // Component logic
    return <YourJSX />;
  } catch (error) {
    console.error(`Error in ${block.type} block:`, error);
    return <div>Error rendering block</div>;
  }
}
```

### 3. Default Export

Always use `export default` for your main component:

```typescript
// ✅ Correct
export default function MyBlock({ block }) { ... }

// ❌ Incorrect
export function MyBlock({ block }) { ... }
```

### 4. Responsive Design

Use Tailwind classes for responsive behavior:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## Testing Your Custom Block

1. **Create the component** in this directory
2. **Restart the development server** to pick up new files
3. **Add to JSON content** using the auto-generated block type
4. **Verify rendering** in the application

## Troubleshooting

### Block Not Found

- Ensure your file follows the naming convention
- Check that you export a default component
- Restart the dev server to pick up new files

### TypeScript Errors

- Define proper interfaces for your block content
- Extend the content schema if needed
- Use the existing color config interface

### Styling Issues

- Use the `useColorConfig` hook for theme integration
- Follow existing components for consistent styling
- Test with different color configurations

## Available Utilities

### Components

- `SectionBox` - Standard wrapper with title and styling
- `Alert` - For error and info messages
- All shadcn/ui components

### Hooks

- `useColorConfig` - Color theme integration
- Standard React hooks

### Icons

- All Lucide React icons available
- Import: `import { IconName } from 'lucide-react'`

## Need Help?

Check existing blocks in the `built-in/` directory for more examples and patterns.
