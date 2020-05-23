// Configuration for lint-staged
module.exports = {
  '**/*.+(js|md|ts|css|sass|less|graphql|scss|json|vue)': [
    'eslint --fix',
    'prettier --write',
    'npm test',
  ],
};
