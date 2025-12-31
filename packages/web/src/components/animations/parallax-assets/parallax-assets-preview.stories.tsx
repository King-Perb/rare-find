/**
 * Parallax Assets Preview Storybook Story
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ParallaxAssetsPreview } from './parallax-assets-preview';

const meta: Meta<typeof ParallaxAssetsPreview> = {
  title: 'Animations/Parallax Assets',
  component: ParallaxAssetsPreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Preview all available parallax assets. These SVG components can be used directly in React or exported as PNG files for parallax effects.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ParallaxAssetsPreview>;

export const Preview: Story = {
  args: {},
};
