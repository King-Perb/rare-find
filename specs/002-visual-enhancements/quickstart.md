# Quickstart: Visual Enhancements and Animations

**Feature**: Visual Enhancements and Animations
**Date**: 2025-01-27

## Overview

This guide provides a quick start for implementing visual enhancements and animations in the Rare Find application using Framer Motion.

## Prerequisites

- Framer Motion 12.23.25 (already installed)
- Next.js 16.0.10
- React 19.2.3
- TypeScript 5+

## Quick Start

### 1. Basic Fade-In Animation

```typescript
import { motion } from 'framer-motion';

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Content here
    </motion.div>
  );
}
```

### 2. Using Animation Variants

```typescript
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations/variants';

export function MyComponent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      Content here
    </motion.div>
  );
}
```

### 3. Scroll-Triggered Animation

```typescript
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp } from '@/lib/animations/variants';

export function MyComponent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
    >
      Content here
    </motion.div>
  );
}
```

### 4. Respecting Reduced Motion

```typescript
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations/variants';

export function MyComponent() {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? {} : fadeInUp;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      Content here
    </motion.div>
  );
}
```

### 5. Stagger Animations

```typescript
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function MyComponent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={item}>
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### 6. Parallax Effect

```typescript
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ParallaxBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="background-element"
    >
      Background content
    </motion.div>
  );
}
```

### 7. Number Count-Up Animation

```typescript
import { useCountUp } from '@/hooks/use-count-up';

export function MetricDisplay({ value }: { value: number }) {
  const displayValue = useCountUp(value, { duration: 2000 });

  return <div>{displayValue}</div>;
}
```

### 8. Button Hover Animation

```typescript
import { motion } from 'framer-motion';

export function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="button-classes"
    >
      {children}
    </motion.button>
  );
}
```

### 9. Error Shake Animation

```typescript
import { motion } from 'framer-motion';
import { shakeVariants } from '@/lib/animations/variants';

export function InputWithError({ hasError }) {
  return (
    <motion.input
      animate={hasError ? "shake" : "normal"}
      variants={shakeVariants}
      className="input-classes"
    />
  );
}
```

### 10. Page State Transitions

```typescript
import { AnimatePresence, motion } from 'framer-motion';

export function StateContainer({ currentState }) {
  return (
    <AnimatePresence mode="wait">
      {currentState === 'form' && (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Form content
        </motion.div>
      )}
      {currentState === 'loading' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Loading content
        </motion.div>
      )}
      {currentState === 'results' && (
        <motion.div
          key="results"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
        >
          Results content
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Common Patterns

### Reusable Animation Wrapper

```typescript
// src/components/animations/fade-in.tsx
import { motion } from 'framer-motion';
import { fadeInVariants } from '@/lib/animations/variants';
import { useReducedMotion } from 'framer-motion';

export function FadeIn({ children, delay = 0, className }) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? {} : fadeInVariants;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### Custom Animation Hook

```typescript
// src/hooks/use-scroll-animation.ts
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
    ...options
  });

  return { ref, isInView };
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { FadeIn } from '@/components/animations/fade-in';

test('FadeIn respects reduced motion', () => {
  // Mock prefers-reduced-motion
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(() => ({
      matches: true, // reduced motion enabled
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });

  render(<FadeIn>Content</FadeIn>);
  // Verify animation is disabled
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('scroll-triggered animation works', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);

  // Verify element is animated
  const element = page.locator('[data-testid="feature-card"]');
  await expect(element).toHaveCSS('opacity', '1');
});
```

## Performance Tips

1. **Use GPU-accelerated properties**: `transform` and `opacity` instead of `top`, `left`, `width`, `height`
2. **Debounce scroll handlers**: Limit to 60fps (16ms intervals)
3. **Lazy load animations**: Code-split animation components
4. **Respect reduced motion**: Always check `useReducedMotion()`
5. **Optimize variants**: Reuse variants instead of creating new ones
6. **Use `will-change`**: Hint browser to optimize animations

## Accessibility Checklist

- ✅ Respect `prefers-reduced-motion`
- ✅ Ensure keyboard navigation works
- ✅ Maintain focus management
- ✅ Test with screen readers
- ✅ Ensure animations don't cause motion sickness
- ✅ Provide static alternatives

## Storybook Stories

### Creating Animation Component Stories

```typescript
// src/components/animations/fade-in.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FadeIn } from './fade-in';

const meta = {
  title: 'Animations/FadeIn',
  component: FadeIn,
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'prefers-reduced-motion', enabled: true }]
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FadeIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This content fades in smoothly',
    delay: 0,
  },
};

export const WithDelay: Story = {
  args: {
    children: 'This content fades in after 0.5s',
    delay: 0.5,
  },
};

export const ReducedMotion: Story = {
  parameters: {
    prefersReducedMotion: true,
  },
  args: {
    children: 'Animation disabled when reduced motion is enabled',
    delay: 0,
  },
};
```

### Testing Animations in Storybook

```typescript
// Use play functions to test interactions
import { expect, userEvent, within } from '@storybook/test';

export const HoverAnimation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Test hover animation
    await userEvent.hover(button);
    await expect(button).toHaveStyle({ transform: 'scale(1.02)' });
  },
};
```

## Brandbook Updates

### Adding Animation Section to Brandbook

```typescript
// Add to src/app/design/page.tsx

<section className="space-y-4">
  <div className="space-y-2">
    <h2 className="text-2xl font-semibold">Animations</h2>
    <p className="text-sm text-zinc-600 dark:text-zinc-400">
      Animation patterns and timing guidelines for consistent motion design.
    </p>
  </div>

  {/* Animation Timing */}
  <div className="space-y-3">
    <h3 className="text-lg font-medium">Animation Timing</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TimingCard name="Fast" value="150ms" usage="Quick feedback, hover states" />
      <TimingCard name="Default" value="300ms" usage="Standard transitions" />
      <TimingCard name="Slow" value="500ms" usage="Dramatic effects, page transitions" />
    </div>
  </div>

  {/* Animation Variants */}
  <div className="space-y-3">
    <h3 className="text-lg font-medium">Animation Variants</h3>
    <div className="space-y-4">
      <AnimationDemo name="Fade In" component={<FadeIn>Content</FadeIn>} />
      <AnimationDemo name="Slide In Up" component={<SlideIn direction="up">Content</SlideIn>} />
      <AnimationDemo name="Scale In" component={<ScaleIn>Content</ScaleIn>} />
    </div>
  </div>

  {/* Usage Guidelines */}
  <div className="space-y-3">
    <h3 className="text-lg font-medium">Usage Guidelines</h3>
    <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
      <li>Use fade-in for content appearance</li>
      <li>Use slide-in for directional content reveals</li>
      <li>Use scale for emphasis and focus</li>
      <li>Always respect prefers-reduced-motion</li>
      <li>Maintain 60fps performance</li>
    </ul>
  </div>
</section>
```

## Next Steps

1. Review existing components to identify animation opportunities
2. Create animation variants in `src/lib/animations/variants.ts`
3. Create reusable animation components in `src/components/animations/`
4. Create animation hooks in `src/hooks/`
5. Create Storybook stories for all animation components
6. Update brandbook (`src/app/design/page.tsx`) with animation patterns section
7. Update existing components with animations
8. Add tests for animation behavior
9. Test accessibility compliance in Storybook and E2E tests
10. Monitor performance metrics

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Framer Motion API Reference](https://www.framer.com/motion/api/)
- [Web Animations Best Practices](https://web.dev/animations/)
- [WCAG 2.1 Animation Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
