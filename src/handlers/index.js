import { Composer } from "grammy";
import config from "../configs/config.js";

import start from "./private/start.js";
import usersInfo from "./private/usersInfo.js";
import broadcastMessage from "./private/broadcastMessage.js";
import checkCaption from "./private/checkCaption.js";

import addChannel from "./group/addChannel.js";
import deleteChannel from "./group/deleteChannel.js";
import deleteAllChannels from "./group/deleteAllChannels.js";
import filterStatistics from "./group/filterStatistics.js";
import refreshAllChannels from "./group/refreshAllChannels.js";
import refreshChannel from "./group/refreshChannel.js";
import maintenanceMode from "./group/maintenanceMode.js";
import sendFileList from "./group/sendFileList.js";

import addChannelFile from "./channel/addChannelFile.js";
import editChannelFile from "./channel/editChannelFile.js";

import callbacks from "./callbacks/callbacks.js";

import addUser from "../middlewares/addUser.js";
import addRequest from "./group/addRequest.js";

const composer = new Composer();

// Private
const privateFilter = composer.filter(
  (context) => context.chat?.type === "private"
);
privateFilter
  .use(addUser)
  .use(start)
  .use(usersInfo)
  .use(broadcastMessage)
  .use(checkCaption);

// Group
const groupFilter = composer.filter((context) =>
  ["group", "supergroup"].includes(context.chat?.type)
);
if (config.REQUEST_CHANNEL) groupFilter.use(addRequest);
groupFilter.use(sendFileList);
const authorizedFilter = groupFilter.filter((context) =>
  config.AUTHORIZED_USERS.includes(context.from.id)
);
authorizedFilter
  .use(filterStatistics)
  .use(maintenanceMode)
  .use(addChannel)
  .use(deleteChannel)
  .use(deleteAllChannels)
  .use(refreshAllChannels)
  .use(refreshChannel);

// Channel
composer.use(addChannelFile).use(editChannelFile);

// Callbacks
composer.use(callbacks);

export default composer;
