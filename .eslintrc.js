module.exports = {
  env: {
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
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
    'no-shadow': ['error', { allow: ['_'] }],
    'prefer-destructuring': 'off',
    'import/no-dynamic-require': 'off',
    'class-methods-use-this': 'off',
    'no-use-before-define': ['error', { functions: false }],
    'no-param-reassign': 'off',
  },
};
