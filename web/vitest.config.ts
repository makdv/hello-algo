import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@viz': path.join(dir, 'src'),
      '@codes': path.join(dir, '../en/codes'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
