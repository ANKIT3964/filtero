import { Composer, InputFile } from "grammy";

import addFiles from "../../helpers/addFiles.js";
import Logger from "../../helpers/Logger.js";
import maintenance from "../../middlewares/maintenance.js";
import File from "../../models/File.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();
composer.command("add", maintenance, async (context) => {
  const { message } = context.update;

  const { id: chatId, title: chatName } = message.chat;

  if (await File.doesChannelExist(context.match)) {
    throw new Error(context.i18n.t("channel_already_exists"));
  }

  const addingMessage = context.i18n.t("adding_channel", {
    channelId: context.match,
    chatName,
    chatId,
  });
  Logger.send(addingMessage);
  const { message_id: messageId } = await context.reply(addingMessage);

  let files;
  try {
    files = await addFiles(context.match);
  } catch (error) {
    const errorMessage = context.i18n.t("error_while_adding_files", {
      errorMessage: error.message,
    });

    await context.api.deleteMessage(chatId, messageId);
    throw new Error(errorMessage);
  }

  const addingFinishedMessage = context.i18n.t("adding_finished", {
    channelId: context.match,
    fileLength: files.length,
  });
  Logger.send(addingFinishedMessage);
  await context.api.editMessageText(chatId, messageId, addingFinishedMessage);
  // await context.editMessageText(addingFinishedMessage, {
  //   message_id: messageId,
  // });
});

Commands.addNewCommand("add", "Adds channel to database");

export default composer;
