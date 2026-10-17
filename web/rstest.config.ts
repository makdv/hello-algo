import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rstest/core';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  include: ['src/**/*.test.ts'],
  testEnvironment: 'node',
  resolve: {
    alias: {
      '@viz': path.join(dir, 'src'),
      '@codes': path.join(dir, '../en/codes'),
    },
  },
  tools: {
    // Same as the site build: code files are imported as plain text.
    rspack: (_config, { appendRules }) => {
      appendRules({ resourceQuery: /raw/, test: /\.(py|java|cpp|c|h|go|rs|ts|js|swift|kt|rb|dart|zig|cs)$/, type: 'asset/source' });
    },
  },
});
