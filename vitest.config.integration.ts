import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/integration/**/*.test.ts'],
    environment: 'node',
    globals: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
  resolve: {
    alias: {
      '~': new URL('./app', import.meta.url).pathname,
      '@server': new URL('./server', import.meta.url).pathname,
    },
  },
});
