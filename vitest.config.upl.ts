import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/upl-compliance/**/*.test.ts'],
    environment: 'node',
    globals: false,
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
  resolve: {
    alias: {
      '~': new URL('./app', import.meta.url).pathname,
      '@server': new URL('./server', import.meta.url).pathname,
    },
  },
});
