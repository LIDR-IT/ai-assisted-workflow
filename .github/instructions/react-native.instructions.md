---
description: Review React Native code for Vercel React Native Best Practices compliance
applyTo: "**/*.tsx,  **/*.ts,  **/*.jsx,  **/*.js"
---

# React Native Best Practices

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive—sacrifice grammar for brevity. High signal-to-noise.

## Rules

### CRITICAL - Text & Rendering

- All text content wrapped in `<Text>` component (no raw strings in `<View>`)
- Conditional rendering: explicit boolean checks, never falsy `&&` (`count > 0 &&` not `count &&`)
- Numbers/zero values: use ternary or explicit boolean to avoid rendering `0`

### List Performance

- Large lists (>20 items): use `FlashList` from `@shopify/flash-list`, not `FlatList`
- List items: wrap with `React.memo()` to prevent unnecessary re-renders
- Callbacks: `useCallback` for stable references (especially `renderItem`, `onPress`)
- Styles: use `StyleSheet.create()` outside component, never inline objects
- Helper functions: define outside component body, not inside render
- Images in lists: use `expo-image` with `cachePolicy="memory-disk"`
- Keep items lightweight: defer expensive operations, avoid complex calculations
- Heterogeneous lists: use `getItemType` for different item types
- `estimatedItemSize` required on `FlashList`

### Animation

- Animate only GPU properties: `transform` (translateX/Y, scale, rotate) and `opacity`
- Never animate: width, height, margin, padding, backgroundColor, borderRadius
- Computed values: use `useDerivedValue` hook for derived animation values
- Press interactions with animation: `Gesture.Tap()` over `Pressable`
- Use `runOnJS()` to call JS functions from gesture handlers
- Always specify `transform-origin` when needed

### Navigation

- Use `createNativeStackNavigator` over JS stack navigators
- Use `createBottomTabNavigator` for tabs (native implementation)
- Avoid deprecated navigators (legacy stack, drawer without native)

### UI Patterns

- Images: `expo-image` over React Native `Image` component
- Images need: `contentFit`, `transition`, `cachePolicy` properties
- Touch: `Pressable` over `TouchableOpacity`, `TouchableHighlight`
- Pressable: use render function for `pressed` state styling
- Safe areas: `useSafeAreaInsets()` in `ScrollView` contentContainerStyle
- ScrollView: use `contentInsetAdjustmentBehavior="automatic"`
- Context menus: use native (zeego) over custom implementations
- Modals: use React Native `Modal` with `presentationStyle`
- View measurement: `onLayout` callback, not `.measure()` method
- Styling: `StyleSheet.create()` or NativeWind, avoid inline styles

### State Management

- Minimize subscriptions: select specific state slices, not entire store
- Functional setState: `setState(prev => prev + 1)` when depending on previous
- Dispatcher pattern for multiple actions: `useMemo` to memoize action creators
- Loading states: show fallback UI (`isLoading` checks before rendering data)

### React Compiler Compatibility

- Destructure functions early: `const { save } = actions` at component top
- Shared values: use `.get()` and `.set()` methods with React Compiler
- Avoid direct property access on objects passed as props when using compiler

### Monorepo Setup

- Native dependencies only in app package (`apps/mobile/package.json`)
- Shared packages: JS-only dependencies, no native modules
- Use workspace `resolutions` for consistent dependency versions
- Never hoist native dependencies to workspace root

### Configuration

- Custom fonts: use Expo config plugins, not manual linking
- Design system: barrel exports (`index.ts`) for organized imports
- Intl formatters: create outside component (`new Intl.DateTimeFormat()` at module level)

### Anti-patterns (flag these)

- Raw text strings in `<View>` (not wrapped in `<Text>`)
- `{count && <Text>}` instead of `{count > 0 && <Text>}`
- Inline style objects: `style={{ padding: 16 }}`
- `FlatList` for large lists (should be `FlashList`)
- Functions defined inside component: `const helper = () => {}` in render
- `TouchableOpacity` / `TouchableHighlight` (should be `Pressable`)
- React Native `Image` (should be `expo-image`)
- Animating non-GPU properties (width, height, backgroundColor, etc.)
- `.measure()` for dimensions (should be `onLayout`)
- JS-based navigators (should be native navigators)
- `useCallback` / `useMemo` missing on list callbacks
- Missing `React.memo()` on list item components
- Entire store subscription instead of slice selection
- Direct setState instead of functional updates
- Native dependencies in shared packages
- Intl objects created in render

## Output Format

Group by file. Use `file:line` format (VS Code clickable). Terse findings.

```text
## src/components/UserList.tsx

src/components/UserList.tsx:12 - FlatList → FlashList for 100+ items
src/components/UserList.tsx:23 - ListItem missing React.memo()
src/components/UserList.tsx:45 - inline style object → StyleSheet.create
src/components/UserList.tsx:67 - renderItem callback not memoized with useCallback

## src/components/Header.tsx

src/components/Header.tsx:34 - raw text "Welcome" → wrap in <Text>
src/components/Header.tsx:56 - {count && ...} → {count > 0 && ...}
src/components/Header.tsx:78 - animating width → use transform: scale

## src/components/Avatar.tsx

src/components/Avatar.tsx:15 - Image from react-native → use expo-image
src/components/Avatar.tsx:29 - TouchableOpacity → Pressable

## src/screens/Profile.tsx

✓ pass
```

State issue + location. Skip explanation unless fix non-obvious. No preamble.
