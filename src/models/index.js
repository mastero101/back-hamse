const User = require('./user.model');
const Activity = require('./activity.model');
const Schedule = require('./schedule.model');
const Status = require('./status.model');
const Report = require('./report.model');

// Activity <-> Schedule (Many-to-Many)
Activity.belongsToMany(Schedule, { through: 'ActivitySchedule' });
Schedule.belongsToMany(Activity, { through: 'ActivitySchedule' });

// Activity -> Status (One-to-Many)
Activity.hasMany(Status);
Status.belongsTo(Activity);

// Schedule -> Status (One-to-Many)
Schedule.hasMany(Status);
Status.belongsTo(Schedule);

// User -> Schedule (One-to-Many)
User.hasMany(Schedule, { foreignKey: 'assignedTo' });
Schedule.belongsTo(User, { foreignKey: 'assignedTo' });

// User -> Status (One-to-Many)
User.hasMany(Status, { foreignKey: 'verifiedBy' });
Status.belongsTo(User, { foreignKey: 'verifiedBy' });

// User -> Report (One-to-Many)
User.hasMany(Report, { foreignKey: 'generatedBy' });
Report.belongsTo(User, { foreignKey: 'generatedBy' });

module.exports = {
    User,
    Activity,
    Schedule,
    Status,
    Report
};