// Configuration for lint-staged
module.exports = {
  '**/*.+(js|md|ts|css|sass|less|graphql|scss|json|vue)': [
    'prettier --write',
    'npm test',
  ],
};
