import { Composer, InputFile } from "grammy";

import Logger from "../../helpers/Logger.js";
import maintenance from "../../middlewares/maintenance.js";
import File from "../../models/File.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();
// TODO: Ask for confirmations before deleting all channels

composer.command("delall", maintenance, async (context) => {
  const { message } = context.update;

  const { id: chatId, title: chatName } = message.chat;

  if (await File.isEmpty()) {
    throw new Error(context.i18n.t("no_channels_found"));
  }

  const deletingMessage = context.i18n.t("deleting_all_channels", {
    chatName,
    chatId,
  });
  Logger.send(deletingMessage);
  const { message_id: messageId } = await context.reply(deletingMessage);

  try {
    await File.destroy({ truncate: true });
  } catch (error) {
    const errorMessage = context.i18n.t("error_while_deleting_files", {
      errorMessage: error.message,
    });

    await context.api.deleteMessage(chatId, messageId);
    throw new Error(errorMessage);
  }

  const deletingFinishedMessage = context.i18n.t("deleting_all_finished");
  Logger.send(deletingFinishedMessage);
  await context.api.editMessageText(chatId, messageId, deletingFinishedMessage);
});

Commands.addNewCommand("delall", "Deletes all channel from database");

export default composer;
