import { Api } from "telegram";

import client from "../configs/client.js";
import File from "../models/File.js";
import Logger from "./Logger.js";
import i18n from "../middlewares/i18n.js";

const addFiles = async (channelId) => {
  if (Number.isNaN(channelId))
    throw new Error(i18n.t("en", "invalid_channel_id"));
  await client.connect();
  await client.getDialogs({ limit: 100 });

  const fileTypes = [
    Api.InputMessagesFilterVideo,
    Api.InputMessagesFilterDocument,
  ];

  const files = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const fileType of fileTypes) {
    // eslint-disable-next-line no-restricted-syntax, no-await-in-loop, radix
    for await (const message of client.iterMessages(parseInt(channelId), {
      limit: 10000000,
      filter: fileType,
    })) {
      if (message.restrictionReason) {
        // Commented code from legacy codebase
        // logMessage(
        //   `${message.id} of ${channelId} has been skipped due to restriction`,
        //   message.restrictionReason.reason,
        // );

        // TODO: I haven't tested it so it's most probably not gonna work.
        Logger.send(
          i18n.t("en", "restriction_error", {
            messageId: message.id,
            channelId,
            reason: message.restrictionReason.reason,
          })
        );
        // eslint-disable-next-line no-continue
        continue;
      }
      files.push({
        messageId: message.id,
        caption: message.message,
        channelId,
        fileSize: Math.trunc(message.media.document.size / 1024 / 1024),
      });
    }
  }

  await client.disconnect();
  await File.bulkCreate(files);

  return files;
};

export default addFiles;
