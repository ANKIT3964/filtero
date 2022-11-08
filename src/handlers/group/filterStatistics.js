import { Composer } from "grammy";

import Logger from "../../helpers/Logger.js";
import File from "../../models/File.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();
composer.command("filterstats", async (context) => {
  const { message } = context.update;

  const { id: chatId } = message.chat;

  if (await File.isEmpty()) {
    throw new Error(context.i18n.t("no_channels_found"));
  }

  let infoMessage = "All channels added to this group are:\n";

  // eslint-disable-next-line no-restricted-syntax
  for (const [index, channel] of (await File.getChannels()).entries()) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const data = await context.api.getChat(channel);
      infoMessage += `${+index + 1}) ${data.title} <code>${data.id}</code>\n`;
    } catch (error) {
      Logger.send(error.message);
      infoMessage += `${+index + 1}) ${channel}}\n`;
    }
  }

  context.reply(infoMessage);
});

Commands.addNewCommand("filterstats", "Send list of all channels added");

export default composer;
