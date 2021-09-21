module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
  },
  extends: [
    'google',
  ],
  rules: {
    'require-jsdoc': 'off',
    'max-len': ['error', {code: 160, ignoreTemplateLiterals: true}],
  },
};
