import Logger from "./Logger.js";
import File from "../models/File.js";

const handleErrors = async ({
  ctx: context,
  stack: errorStack,
  message: errorMessage,
  error,
}) => {
  if (error.description === "Bad Request: message to copy not found") {
    await File.destroy({
      where: {
        channelId: error.payload.from_chat_id,
        messageId: +error.payload.message_id,
      },
    });
    return context.reply(
      "Some of the files have been deleted, please try again later"
    );
  }
  if (error.description?.includes("query is too old and response timeout expired or query ID is invalid")) return;
  console.log(error.description);

  const {
    chat,
    text,
    date: unixDateValue,
    from: user,
    message_id: messageID,
  } = context.message || {};
  const { title: chatTitle, type: chatType, id: chatId } = chat || {};
  const {
    username: userName,
    first_name: firstName,
    last_name: lastName,
  } = user || {};

  const dateString = new Date(unixDateValue * 1000).toLocaleString();
  const userString = `${firstName} ${lastName && lastName} ${
    userName && `(@${userName})`
  }`;
  const chatString = `${chatTitle} <code>${chatId}</code> (${chatType})`;

  const message = context.i18n.t("error", {
    errorStack,
    text,
    messageID,
    updateID: context.update.update_id,
    date: dateString,
    user: userString,
    chat: chatString,
  });

  await context.reply(errorMessage);
  Logger.send(message);
};

export default handleErrors;
