import type { Preview } from '@storybook/react'

// @ts-ignore
import * as styles from '../app/globals.css';

const preview: Preview = {
  // @ts-ignore
  thisIsAHackToPreventTreeShaking: styles,
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
};

export default preview;