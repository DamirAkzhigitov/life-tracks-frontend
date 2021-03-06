module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  plugins: ['@typescript-eslint'],
  // parserOptions: {
  //   sourceType: 'module',
  // },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    // '@nuxtjs/eslint-config-typescript',
    // '@nuxtjs',
    // 'prettier',
  ],
}
