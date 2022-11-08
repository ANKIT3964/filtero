/* eslint-disable no-await-in-loop */
import { Composer } from "grammy";
import { Api } from "telegram";
import client from "../../configs/client.js";
import config from "../../configs/config.js";
import File from "../../models/File.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();
const filter = composer.filter((context) =>
  config.AUTHORIZED_USERS.includes(context.from.id)
);

// eslint-disable-next-line consistent-return
filter.command("checkcap", async (context) => {
  const filesWithEmptyCaption = await File.findAll({
    where: { caption: "" },
    raw: true,
  });

  if (!filesWithEmptyCaption.length > 0)
    return context.reply(context.i18n.t("no_files_with_empty_cap"));

  let files = [];
  await client.connect();

  await context.reply(
    context.i18n.t("sending_files_with_empty_cap", {
      length: filesWithEmptyCaption.length,
    })
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const file of filesWithEmptyCaption) {
    if (files.length > 30) {
      await context.reply(files.join("\n"));
      files = [];
    }

    const result = await client.invoke(
      new Api.channels.ExportMessageLink({
        // eslint-disable-next-line radix
        channel: parseInt(file.channelId),
        id: file.messageId,
        thread: true,
      })
    );
    files.push(result.link);
  }

  await context.reply(files.join("\n"));
  await context.reply(context.i18n.t("files_with_empty_cap_sent"));
});

Commands.addNewCommand(
  "checkcap",
  "Send the list of all files with empty caption"
);

export default composer;
