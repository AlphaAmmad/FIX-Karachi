const { CATEGORY_TO_AUTHORITY } = require('./constants');

const getAssignedOrganization = (category) => CATEGORY_TO_AUTHORITY[category] || 'KMC';

module.exports = {
  getAssignedOrganization,
};