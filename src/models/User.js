import Sequelize, { DataTypes } from 'sequelize';
import DatabaseConnector from '../configs/DatabaseConnector.js';

class User extends Sequelize.Model {}

User.init(
  {
    chatId: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    userName: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: DatabaseConnector, modelName: 'User' },
);

export default User;
