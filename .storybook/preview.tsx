import React from 'react';
import { Decorator } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import '../src/app/globals.css';

export const parameters = {
  actions: {
    /* Remove argTypesRegex */
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators: Decorator[] = [
  (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
];
