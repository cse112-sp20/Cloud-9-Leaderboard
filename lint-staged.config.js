// Configuration for lint-staged
module.exports = {
  '**/*.+(js|md|ts|css|sass|less|graphql|yml|yaml|scss|json|vue)': [
    'eslint --fix',
    'prettier --write',
    'npm run tests',
    'git add',
  ],
};
