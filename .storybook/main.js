import { StorybookConfig } from '@storybook/react-vite';

const config = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-swc',
    '@chromatic-com/storybook',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    // Set relative base path to support deployment on path like /storybook
    config.base = './';
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      'react-is',
      '@base2/pretty-print-object',
      ...(config.optimizeDeps.include || []),
    ];
    return config;
  },
};

export default config;
