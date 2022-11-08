import { Composer } from 'grammy';
import User from '../models/User.js';

const composer = new Composer();
composer.on('message', async (context, next) => {
  const { message } = context.update;

  const chatId = String(message.chat.id);
  
  const userExists = await User.findOne({ where: { chatId } });
  if (userExists) return next();

  const {
    first_name: firstName,
    last_name: lastName,
    username: userName,
  } = message.from;
  const name = `${firstName || ''} ${lastName || ''}`;

  await User.create({ chatId, name, userName });
  next();
});

export default composer;
