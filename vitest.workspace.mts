import { defineWorkspace } from 'vitest/config';

export default defineWorkspace(['packages/*/vitest.config.mts', 'docs/vitest.config.mts']);