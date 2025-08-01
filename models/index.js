const Plans = require('./Plans');
const Logs = require('./Logs');

// 관계 설정
Plans.hasMany(Logs, { foreignKey: 'planId', as: 'logs' });
Logs.belongsTo(Plans, { foreignKey: 'planId', as: 'plan' });

module.exports = {
  Plans,
  Logs,
};
