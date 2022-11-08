import config from "../../configs/config.js";
import { decodeString } from "../../helpers/base64URL.js";
import File from "../../models/File.js";
import { isSearchQueryValid } from "../group/sendFileList.js";

const sendFiles = async (context) => {
  const payload = context.match.slice(8);
  const splittedPayload = decodeString(payload).split(" ");
  const pageNumber = splittedPayload[0];
  const query = splittedPayload.splice(1).join(" ");

  if (!isSearchQueryValid(query)) return;

  const files = await File.fuzzySearch(
    query,
    config.SENDALL_PER_PAGE ? pageNumber : null
  );
  if (!files.length > 0) return;

  for (const file of files) {
    try{
      await context.api.copyMessage(
        context.chat.id,
        file.channelId,
        file.messageId
      );
    } catch(error){
      console.log(error);
      continue;
    }
  }
};

export default sendFiles;
