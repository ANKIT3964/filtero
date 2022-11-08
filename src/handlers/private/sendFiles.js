import { decodeString } from "../../helpers/base64URL.js";

const sendFiles = async (context) => {
  const payload = context.match.slice(5);
  const [channelId, messageId] = decodeString(payload).split(" ");

  try{
    await context.api.copyMessage(context.chat.id, channelId, messageId);
  } catch(error){
    
  }
};

export default sendFiles;
