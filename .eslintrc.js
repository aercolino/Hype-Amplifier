module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
  },
  extends: [
    'google',
  ],
  rules: {
    'max-len': [error, {code: 160, ignoreTemplateLiterals: true}],
  },
};
