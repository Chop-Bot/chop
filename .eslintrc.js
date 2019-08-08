module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2019,
  },
  rules: {
    'linebreak-style': 'off',
    'no-unused-vars': 'warn',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-shadow': [
      'error',
      { builtinGlobals: true, allow: ['resolve', 'reject', 'done', 'cb', '_', 'i'] },
    ],
    'prefer-destructuring': 'off',
  },
};
