import { Composer, InputFile } from "grammy";

import Commands from "../../helpers/Commands.js";

import welcomeUser from "./welcomeUser.js";
import sendFiles from "./sendFiles.js";
import sendAllFiles from "./sendAllFiles.js";
import {
  generateRequiredChatButtons,
  userInRequiredChats,
} from "../../helpers/requiredChatsHelper.js";

const composer = new Composer();
composer.command("start", async (context) => {
  if (!context.match) return welcomeUser(context);

  const isUserJoinedInRequiredChats = await userInRequiredChats(context);
  if (!isUserJoinedInRequiredChats) {
    const inlineKeyboard = await generateRequiredChatButtons(context);
    inlineKeyboard.url(
      "Try again",
      `t.me/${context.me.username}?start=${context.match}`
    );
    return context.replyWithPhoto(
      new InputFile(`src/assets/images/caution.jpg`),
      {
        caption: context.i18n.t("join_required_chats"),
        reply_markup: inlineKeyboard,
      }
    );
  }

  if (context.match.startsWith("send-")) return sendFiles(context);
  if (context.match.startsWith("sendall-")) return sendAllFiles(context);
});
Commands.addNewCommand("start", "Start the bot!");

export default composer;
