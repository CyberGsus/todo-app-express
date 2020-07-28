module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    semi: 'off',
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'no-trailing-spaces': 'error'
  }
}
