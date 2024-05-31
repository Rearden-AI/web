import { reardenEslintConfig } from '@rearden/eslint-config';
import { config, parser } from 'typescript-eslint';

export default config({
  ...reardenEslintConfig,
  languageOptions: {
    parser,
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
