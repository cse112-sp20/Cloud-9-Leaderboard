// Configuration for lint-staged running tasks
module.exports = {
  '*.+(js|md|ts|css|sass|less|graphql|scss|json|vue)': ['prettier --write',
  // 'eslint --fix',
  //'npm run documentation',
  // 'npm test
],
};