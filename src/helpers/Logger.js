import Bot from '../configs/Bot.js';
import config from '../configs/config.js';

class Logger {
  static #logInConsole(message) {
    const strippedMessage = message.replace(/(<([^>]+)>)/gi, '').trim();
    console.log('\n-------------------------');
    console.log(strippedMessage);
    console.log('-------------------------');
  }

  static send(message) {
    this.#logInConsole(message);
    // eslint-disable-next-line no-unused-expressions
    config.LOG_CHANNEL && Bot.api.sendMessage(config.LOG_CHANNEL, message);
  }
}

export default Logger;
