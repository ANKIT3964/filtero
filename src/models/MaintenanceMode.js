import Sequelize, { DataTypes } from 'sequelize';
import DatabaseConnector from '../configs/DatabaseConnector.js';

class MaintenanceMode extends Sequelize.Model {}

MaintenanceMode.init(
  {
    chatId: {
      type: DataTypes.STRING,
    },
    messageId: {
      type: DataTypes.STRING,
    },
    permissions: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: DatabaseConnector, modelName: 'MaintenanceMode' },
);

export default MaintenanceMode;
