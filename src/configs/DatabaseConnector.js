import { Sequelize } from 'sequelize';
import config from './config.js';

const DatabaseConnector = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USER,
  config.DATABASE_USER_PASSWORD,
  {
    host: config.DATABASE_HOST,
    dialect: config.DATABASE_DIALECT,
    port: config.DATABASE_PORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
);

export default DatabaseConnector;
