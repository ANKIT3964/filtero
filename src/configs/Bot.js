import { Bot } from 'grammy';
import config from './config.js';

const bot = new Bot(config.BOT_TOKEN);

export default bot;
