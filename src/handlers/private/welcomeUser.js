import config from "../../configs/config.js";
import { InlineKeyboard, InputFile } from "grammy";
import { generateRequiredChatButtons } from "../../helpers/requiredChatsHelper.js";

const welcomeUser = async (context) => {
  let caption = config.WELCOME_MESSAGE;

  let inlineKeyboard;
  if (config.REQUIRED_CHAT_TO_JOIN.length > 0) {
    caption += `\n${context.i18n.t("join_required_chat_message")}`;

    inlineKeyboard = await generateRequiredChatButtons(context);
  }

  context.replyWithPhoto(new InputFile(`src/assets/images/welcome.jpg`), {
    caption,
    reply_markup: inlineKeyboard,
  });
};

export default welcomeUser;
