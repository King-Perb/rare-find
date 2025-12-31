# Parallax Assets

This directory contains SVG components designed for parallax effects in the Rare Find application. These assets are used directly as React components - no need to export as PNG files.

## Usage

### Direct React Usage

```tsx
import { GradientBlob, MagnifyingGlass } from '@/components/animations/parallax-assets';

// Use in parallax component
<GradientBlob className="absolute top-0 left-0" opacity={0.1} />
<MagnifyingGlass size={100} opacity={0.15} />
```

### Optional: Exporting as PNG

If you need PNG files (e.g., for use in other tools), you can:

1. **Using Browser DevTools:**
   - Open the component in Storybook or your app (`/parallax-assets` route)
   - Right-click the SVG element
   - Inspect element and copy the SVG code
   - Use an online SVG to PNG converter (e.g., https://svgtopng.com/)

2. **Using Design Tools:**
   - Import SVG into Figma/Adobe Illustrator
   - Export as PNG at desired resolution (recommended: 2x for retina displays)

## Asset Categories

### Geometric Shapes
- **GradientBlob**: Large organic blob shape - use for far background (slow parallax)
- **CircleCluster**: Medium circles - use for mid background (medium parallax)
- **FloatingDots**: Small dots - use for near background (fast parallax)
- **WavePattern**: Horizontal wave pattern - use for horizontal parallax
- **HexagonGrid**: Subtle grid texture - use for background texture

### Theme Icons
- **MagnifyingGlass**: Core search/discovery theme
- **PriceTag**: Bargain/deal theme
- **Coin**: Value/currency theme
- **Sparkle**: Highlight/deal theme
- **TrendingUp**: Market value theme
- **Shield**: Trust/confidence theme

## Parallax Speed Recommendations

When implementing parallax effects, use different speeds for different layers:

- **Far Background (0.2-0.4x speed)**: GradientBlob, WavePattern
- **Mid Background (0.5-0.7x speed)**: CircleCluster, HexagonGrid
- **Near Background (0.8-1.0x speed)**: FloatingDots, Theme Icons

## Color Customization

All assets use the design system colors:
- Primary: `#3b82f6` (blue-500), `#2563eb` (blue-600), `#4f46e5` (indigo-600)
- Status: `#16a34a` (green-600), `#ca8a04` (yellow-600)

You can customize colors by passing the `color` prop to icon components.

## Performance Tips

1. **Use CSS transforms** for parallax movement (not position changes)
2. **Set opacity low** (0.05-0.2) to keep them subtle
3. **Use `will-change: transform`** for smooth animations
4. **Respect reduced motion** - disable parallax when user prefers reduced motion
5. **Optimize for 60fps** - use `requestAnimationFrame` and debounce scroll events

## File Sizes

SVG files are lightweight and scale perfectly at any size. No need to worry about resolution - SVGs are vector-based and will look crisp at any size.

## Examples

See `parallax-background.tsx` for implementation examples using these assets.
