import allButtons from "../../configs/allButtons.js";

const nextPage = async (context) => {
  try {
    const [, pageNumber, messageId] =
      context.update.callback_query.data.split(" ");

    const prevPageButtons = allButtons[messageId][parseInt(pageNumber) - 2];
    await context.editMessageReplyMarkup({ reply_markup: prevPageButtons });
    await context.answerCallbackQuery();
  } catch (error) {
    await context.answerCallbackQuery({
      show_alert: true,
      text: "Search results expired or not found! Please try searching again",
    });
  }
};

export default nextPage;
