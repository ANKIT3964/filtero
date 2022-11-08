import Bot from '../configs/Bot.js';

class Commands {
  static commands = [];

  static async addNewCommand(command, description) {
    this.commands.push({ command, description });
  }

  static async setCommands() {
    await Bot.api.setMyCommands(this.commands);
  }
}

export default Commands;
