import { Composer, InputFile } from "grammy";

import deleteFiles from "../../helpers/deleteFiles.js";
import Logger from "../../helpers/Logger.js";
import addFiles from "../../helpers/addFiles.js";
import maintenance from "../../middlewares/maintenance.js";
import File from "../../models/File.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();
composer.command("refresh", maintenance, async (context) => {
  const { message } = context.update;

  if (!context.match) {
    throw new Error(context.i18n.t("no_channelId_given"));
  }

  const { id: chatId, title: chatName } = message.chat;

  if (await File.isEmpty()) {
    throw new Error(context.i18n.t("no_channels_found"));
  }

  if (!(await File.doesChannelExist(context.match))) {
    throw new Error(
      context.i18n.t("channel_not_found_refresh", {
        channelID: context.match,
      })
    );
  }

  const refreshingDeleteMessage = context.i18n.t(
    "refreshing_channel_deleting",
    {
      chatName,
      chatId,
      channelID: context.match,
    }
  );
  Logger.send(refreshingDeleteMessage);
  const { message_id: messageId } = await context.reply(
    refreshingDeleteMessage
  );

  try {
    await deleteFiles(context.match);
  } catch (error) {
    const errorMessage = context.i18n.t("error_while_deleting_files", {
      errorMessage: error.message,
    });

    await context.api.deleteMessage(chatId, messageId);
    throw new Error(errorMessage);
  }

  const refreshingAddMessage = context.i18n.t("refreshing_channel_adding", {
    chatName,
    chatId,
    channelID: context.match,
  });
  Logger.send(refreshingAddMessage);
  await context.api.editMessageText(chatId, messageId, refreshingAddMessage);

  try {
    await addFiles(context.match);
  } catch (error) {
    const errorMessage = context.i18n.t("error_while_adding_files", {
      errorMessage: error.message,
    });

    await context.api.deleteMessage(chatId, messageId);
    throw new Error(errorMessage);
  }

  const refreshingFinishedMessage = context.i18n.t("refreshing_finished", {
    channelID: context.match,
  });
  Logger.send(refreshingFinishedMessage);
  await context.api.editMessageText(
    chatId,
    messageId,
    refreshingFinishedMessage
  );
});

Commands.addNewCommand("refresh", "Refreshes specific channel");

export default composer;
