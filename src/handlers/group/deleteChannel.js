import { Composer } from "grammy";

import deleteFiles from "../../helpers/deleteFiles.js";
import Logger from "../../helpers/Logger.js";
import maintenance from "../../middlewares/maintenance.js";
import File from "../../models/File.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();
composer.command("del", maintenance, async (context) => {
  const { message } = context.update;

  const { id: chatId, title: chatName } = message.chat;

  if (await File.isEmpty()) {
    throw new Error(context.i18n.t("no_channels_found"));
  }

  if (!(await File.doesChannelExist(context.match))) {
    throw new Error(
      context.i18n.t("channel_not_found_delete", {
        channelID: context.match,
      })
    );
  }

  const deletingMessage = context.i18n.t("deleting_channel", {
    channelId: context.match,
    chatName,
    chatId,
  });
  Logger.send(deletingMessage);
  const { message_id: messageId } = await context.reply(deletingMessage);

  try {
    await deleteFiles(context.match);
  } catch (error) {
    const errorMessage = context.i18n.t("error_while_deleting_files", {
      errorMessage: error.message,
    });

    await context.api.deleteMessage(chatId, messageId);
    throw new Error(errorMessage);
  }

  const deletingFinishedMessage = context.i18n.t("deleting_finished", {
    channelId: context.match,
  });
  Logger.send(deletingFinishedMessage);
  await context.api.editMessageText(chatId, messageId, deletingFinishedMessage);
});

Commands.addNewCommand("del", "Deletes specific channel from database");

export default composer;
