import { Composer, InputFile } from "grammy";

import deleteFiles from "../../helpers/deleteFiles.js";
import Logger from "../../helpers/Logger.js";
import addFiles from "../../helpers/addFiles.js";
import maintenance from "../../middlewares/maintenance.js";
import File from "../../models/File.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();

composer.command("refreshall", maintenance, async (context) => {
  const { message } = context.update;

  const { id: chatId, title: chatName } = message.chat;

  if (await File.isEmpty()) {
    throw new Error(context.i18n.t("no_channels_found"));
  }

  const channels = await File.getChannels();

  const refreshingDeleteMessage = context.i18n.t(
    "refreshing_all_channels_deleting",
    {
      chatName,
      chatId,
      totalChannels: channels.length,
    }
  );
  Logger.send(refreshingDeleteMessage);
  const { message_id: messageId } = await context.reply(
    refreshingDeleteMessage
  );

  try {
    await File.destroy({ truncate: true });
  } catch (error) {
    const errorMessage = context.i18n.t("error_while_deleting_files", {
      errorMessage: error.message,
    });

    await context.api.deleteMessage(chatId, messageId);
    throw new Error(errorMessage);
  }

  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const [index, channel] of channels.entries()) {
      const refreshingAddMessage = context.i18n.t(
        "refreshing_all_channels_adding",
        {
          chatName,
          chatId,
          channelId: channel,
          totalChannels: channels.length,
          remainingChannels: index,
        }
      );
      console.log(channels, channel);
      // eslint-disable-next-line no-await-in-loop
      Logger.send(refreshingAddMessage);
      await context.api.editMessageText(
        chatId,
        messageId,
        refreshingAddMessage
      );

      // eslint-disable-next-line no-await-in-loop
      await addFiles(channel);
    }
  } catch (error) {
    const errorMessage = context.i18n.t("error_while_adding_files", {
      errorMessage: error.message,
    });

    await context.api.deleteMessage(chatId, messageId);
    throw new Error(errorMessage);
  }

  const refreshingFinishedMessage = context.i18n.t("refreshing_all_finished", {
    totalChannels: channels.length,
  });
  Logger.send(refreshingFinishedMessage);
  await context.api.editMessageText(
    chatId,
    messageId,
    refreshingFinishedMessage
  );
});

Commands.addNewCommand("refreshall", "Refreshes all channels added");

export default composer;
