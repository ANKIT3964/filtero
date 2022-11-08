import File from "../models/File.js";

export default async (channelId) => {
  await File.destroy({
    where: {
      channelId,
    },
  });
};
