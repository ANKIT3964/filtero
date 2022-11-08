import { Composer } from "grammy";
import File from "../../models/File.js";

const composer = new Composer();
composer.on(["channel_post:document", "channel_post:video"], (context) => {
  const {
    message_id: messageId,
    chat,
    caption = "",
    document,
    video,
  } = context.update.channel_post;

  const channelId = chat.id;
  const fileSizeInBytes = document?.file_size || video?.file_size;
  const fileSizeInMb = Math.trunc(fileSizeInBytes / 1024 / 1024);

  File.create({ messageId, channelId, fileSize: fileSizeInMb, caption });
});

export default composer;
