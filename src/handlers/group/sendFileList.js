import { Composer } from "grammy";
import config from "../../configs/config.js";
import File from "../../models/File.js";

const isSearchQueryValid = (searchQuery) => {
  if (config.BLOCKED_WORDS.length > 0) {
    const textContainsBlockedWords = config.BLOCKED_WORDS.some((word) =>
      searchQuery.split(" ").includes(word)
    );
    if (textContainsBlockedWords) return false;
  }
  if (searchQuery.length < 3) return false;
  return true;
};

const composer = new Composer();
composer.on("message:text", async (context, next) => {
  try{
  const { id: chatId } = context.update.message.chat;
  
  if (!config.AUTHORIZED_CHAT_IDS.includes(String(chatId))){
    try{
      await context.reply("Suno Group ke Logo Is Group Ka Owner Bhen ka Loda hai... Asli AK IMAX Join kro @akimax");
    } catch(error){}
    return await context.leaveChat();
  }
  
  const searchQuery = context.message.text.toLowerCase();

  if (searchQuery.startsWith("/")) return next();
  if (!isSearchQueryValid(searchQuery)) return;

  const files = await File.paginatedSearch(
    searchQuery,
    context.message.message_id,
    context.me.username
  );
  if (!files) return;

  const options = {
    reply_markup: files,
    reply_to_message_id: context.message.message_id,
  };
  if (context.message.reply_to_message) {
    options.reply_to_message_id = context.message.reply_to_message.message_id;
  }

  try{
    context.reply("Here are list of files", options);
  }
    catch(error){}
  }
  catch(error){console.log(error)}
});

export default composer;
export { isSearchQueryValid };
