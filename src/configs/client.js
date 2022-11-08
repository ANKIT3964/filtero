import { TelegramClient } from 'telegram';
import config from './config.js';

let client;

(async () => {
  client = new TelegramClient(
    config.STRING_SESSION,
    config.APP_ID,
    config.API_HASH,
    {
      connectionRetries: 5,
    },
  );
})();

client.setLogLevel('none');
export default client;
