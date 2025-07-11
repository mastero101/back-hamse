const sequelize = require('../config/database').sequelize;

const User = require('./user.model');
const Activity = require('./activity.model');
const Schedule = require('./schedule.model');
const Status = require('./status.model');
const Report = require('./report.model');
const Setting = require('./setting.model');
const ActivitySchedule = require('./activitySchedule.model');
const Requirement = require('./requirement.model');
const UserRequirement = require('./userRequirement.model')(sequelize);
const AuditLog = require('./auditLog.model')(sequelize);

// Activity <-> Schedule (Many-to-Many)
Activity.belongsToMany(Schedule, { through: ActivitySchedule, foreignKey: 'activityId' });
Schedule.belongsToMany(Activity, { through: ActivitySchedule, foreignKey: 'scheduleId' });

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

// User -> Requirement (One-to-Many)
User.hasMany(Requirement, { foreignKey: 'userId' });
Requirement.belongsTo(User, { foreignKey: 'userId' });

// User <-> UserRequirement (One-to-Many)
User.hasMany(UserRequirement, { foreignKey: 'userId' });
UserRequirement.belongsTo(User, { foreignKey: 'userId' });

// Requirement <-> UserRequirement (One-to-Many)
Requirement.hasMany(UserRequirement, { foreignKey: 'requirementId' });
UserRequirement.belongsTo(Requirement, { foreignKey: 'requirementId' });

module.exports = {
    User,
    Activity,
    Schedule,
    Status,
    Report,
    Setting,
    ActivitySchedule,
    Requirement,
    AuditLog,
    UserRequirement
};