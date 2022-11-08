import { Composer, InlineKeyboard } from "grammy";

import nextPage from "./nextPage.js";
import previousPage from "./previousPage.js";
import allButtons from "../../configs/allButtons.js";
import config from "../../configs/config.js";

const composer = new Composer();
composer.on("callback_query", async (context) => {
  const { data, message, from } = context.update.callback_query;

  if (
    !config.AUTHORIZED_USERS.includes(from.id) &&
    from.id !== message.reply_to_message.from.id
  )
    return await context.answerCallbackQuery({
      show_alert: true,
      text: "This results are not for you! Search it yourself",
    });

  if (data.startsWith("next")) return await nextPage(context);
  if (data.startsWith("back")) return await previousPage(context);
  if (data.startsWith("pages")) {
    try {
      const [, pageNumber, messageId] =
        context.update.callback_query.data.split(" ");

      const buttons = allButtons[messageId];
      if (!buttons) throw new Error();

      if (buttons.length === 1)
        return await context.answerCallbackQuery({
          text: `Pages ${pageNumber}/${buttons.length}`,
          show_alert: true,
        });

      const inlineKeyboard = new InlineKeyboard();

      for (let i = 0; i < buttons.length; i++) {
        const rawInlineKeyboard = inlineKeyboard.inline_keyboard;
        if (rawInlineKeyboard[rawInlineKeyboard.length - 1].length === 8)
          inlineKeyboard.row();

        inlineKeyboard.text(`${i + 1}`, `gopage ${i} ${messageId}`);
      }

      await context.editMessageReplyMarkup({ reply_markup: inlineKeyboard });
      await context.answerCallbackQuery();
    } catch (error) {
      await context.answerCallbackQuery({
        show_alert: true,
        text: "Search results expired or not found! Please try searching again",
      });
    }
  }
  if (data.startsWith("gopage")) {
    try {
      const [, pageNumber, messageId] =
        context.update.callback_query.data.split(" ");

      const pageButtons = allButtons[messageId][parseInt(pageNumber)];
      await context.editMessageReplyMarkup({ reply_markup: pageButtons });
      await context.answerCallbackQuery();
    } catch (error) {
      await context.answerCallbackQuery({
        show_alert: true,
        text: "Search results expired or not found! Please try searching again",
      });
    }
  }
});

export default composer;
