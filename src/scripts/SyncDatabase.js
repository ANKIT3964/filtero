/* eslint-disable no-unused-vars */
import DatabaseConnector from "../configs/DatabaseConnector.js";

import User from "../models/User.js";
import File from "../models/File.js";
import MaintenanceMode from "../models/MaintenanceMode.js";

class SyncDatabase {
  static arguments = process.argv.slice(2);

  static forced = this.arguments.includes("--force");

  static async init() {
    await DatabaseConnector.sync({ force: this.forced });

    console.log("All models were synchronized successfully!");
  }
}

SyncDatabase.init();
