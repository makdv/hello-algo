import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rstest/core';
import { LOCALES } from './scripts/locales.ts';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  include: ['src/**/*.test.ts'],
  testEnvironment: 'node',
  resolve: {
    alias: {
      '@viz': path.join(dir, 'src'),
      ...Object.fromEntries(LOCALES.map((l) => [`@codes-${l.lang}`, path.join(dir, '..', l.source, 'codes')])),
    },
  },
  tools: {
    // Same as the site build: code files are imported as plain text.
    rspack: (_config, { appendRules }) => {
      appendRules({ resourceQuery: /raw/, test: /\.(py|java|cpp|c|h|go|rs|ts|js|swift|kt|rb|dart|zig|cs)$/, type: 'asset/source' });
    },
  },
});
