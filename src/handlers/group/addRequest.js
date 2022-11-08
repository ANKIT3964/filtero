import { Composer } from "grammy";
import config from "../../configs/config.js";

const composer = new Composer();
composer.on("message:text", async (context, next) => {
  const message = context.message.text.toLowerCase();

  if (message.includes("#request")) {
    await context.forwardMessage(config.REQUEST_CHANNEL);
  } else return next();
});

export default composer;
