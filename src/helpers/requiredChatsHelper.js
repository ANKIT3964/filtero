import { InlineKeyboard } from "grammy";
import config from "../configs/config.js";

const userInRequiredChats = async (context) => {
  for (const requiredChat of config.REQUIRED_CHAT_TO_JOIN) {
    const chat = await context.api.getChatMember(requiredChat, context.from.id);
    if (chat.status === "left") return false;
  }
  return true;
};

const generateRequiredChatButtons = async (context) => {
  const inlineKeyboard = new InlineKeyboard();
  // eslint-disable-next-line no-restricted-syntax
  for (const requiredChat of config.REQUIRED_CHAT_TO_JOIN) {
    // eslint-disable-next-line no-continue
    if (!requiredChat) continue;
    // eslint-disable-next-line no-await-in-loop
    const chat = await context.api.getChat(requiredChat);

    const keyboardArray = inlineKeyboard.inline_keyboard;
    const lastRow = keyboardArray[keyboardArray.length - 1];

    inlineKeyboard.url(chat.title, chat.invite_link);
    if (lastRow.length === 2) {
      inlineKeyboard.row();
    }
  }

  return inlineKeyboard;
};

export { generateRequiredChatButtons, userInRequiredChats };
