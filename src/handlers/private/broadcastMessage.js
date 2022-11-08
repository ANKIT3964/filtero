import { Composer } from "grammy";
import config from "../../configs/config.js";
import User from "../../models/User.js";
import Logger from "../../helpers/Logger.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();
const filter = composer.filter((context) =>
  config.AUTHORIZED_USERS.includes(context.from.id)
);

filter.command("broadcast", async (context) => {
  const { message } = context.update;

  const messageToForward = message.reply_to_message.message_id || null;
  if (!messageToForward) {
    throw new Error(context.i18n.t("no_message_to_broadcast"));
  }

  const users = await User.findAll({ raw: true });

  if (!users.length > 0) {
    throw new Error(context.i18n.t("no_users_to_broadcast"));
  }

  const broadcastingMessage = context.i18n.t("broadcasting_message", {
    length: users.length,
  });
  Logger.send(broadcastingMessage);
  const { message_id: messageId } = await context.reply(broadcastingMessage);

  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await context.api.copyMessage(
        user.chatId,
        message.chat.id,
        messageToForward
      );
    } catch (error) {
      // eslint-disable-next-line no-continue
      continue;
    }
  }

  const broadcastCompletedMessage = context.i18n.t("broadcast_complete", {
    length: users.length,
  });
  Logger.send(broadcastCompletedMessage);
  await context.api.editMessageText(
    message.chat.id,
    messageId,
    broadcastCompletedMessage
  );
});

Commands.addNewCommand(
  "broadcast",
  "Broadcast a message to all users (Mention a message to broadcast)"
);

export default composer;
