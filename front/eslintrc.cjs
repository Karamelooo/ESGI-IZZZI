// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'eslint:recommended', 'prettier'],
  rules: {
    // Add your rules here
  },
};
