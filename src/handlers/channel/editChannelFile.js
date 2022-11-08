import { Composer } from "grammy";
import File from "../../models/File.js";

const composer = new Composer();
composer.on(
  ["edited_channel_post:document", "edited_channel_post:video"],
  (context) => {
    const {
      message_id: messageId,
      chat,
      caption = "",
    } = context.update.edited_channel_post;
    const channelId = chat.id;

    File.update({ caption }, { where: { messageId, channelId } });
  }
);

export default composer;
