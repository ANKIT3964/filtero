import Sequelize, { DataTypes } from "sequelize";
import Fuse from "fuse.js";
import DatabaseConnector from "../configs/DatabaseConnector.js";
import { InlineKeyboard } from "grammy";
import allButtons from "../configs/allButtons.js";
import config from "../configs/config.js";
import { encodeString } from "../helpers/base64URL.js";

const paginateArray = (array, messageId, query, botUserName) => {
  const pages = [];
  const pageCount = Math.ceil(array.length / config.PAGINATION_LIMIT);

  for (let i = 1; i <= pageCount; i++) {
    const startIndex = (i - 1) * config.PAGINATION_LIMIT;
    const endIndex = i * config.PAGINATION_LIMIT;

    const inlineKeyboard = new InlineKeyboard();
    const page = array.slice(startIndex, endIndex);
    const url = `t.me/${botUserName}?start=`;

    for (const file of page) {
      const keyword = `${file.channelId} ${file.messageId}`;
      inlineKeyboard
        .url(
          `📂 [${file.fileSize}MB] ${file.caption.replace(/\?/g, "")}`,
          `${url}send-${encodeString(keyword)}`
        )
        .row();
    }

    if (startIndex > 0) {
      inlineKeyboard.text("⬅️ Back", `back ${i} ${messageId}`);
    }

    if (endIndex < array.length) {
      inlineKeyboard.text("Next ➡️", `next ${i} ${messageId}`).row();
    }

    inlineKeyboard.text(
      `📃 Pages ${i}/${pageCount}`,
      `pages ${i} ${messageId}`
    );

    const rawInlineKeyboard = inlineKeyboard.inline_keyboard;
    if (rawInlineKeyboard[rawInlineKeyboard.length - 1].length === 2)
      inlineKeyboard.row();

    inlineKeyboard.url(
      `Send All Files (${
        config.SENDALL_PER_PAGE ? page.length : array.length
      })`,
      `t.me/${botUserName}?start=sendall-${encodeString(`${i} ${query}`)}`
    );
    pages.push(inlineKeyboard);
  }

  return pages;
};

class File extends Sequelize.Model {
  static async doesChannelExist(channelId) {
    const file = await this.findOne({ where: { channelId } });
    return !!file;
  }

  static async getChannels() {
    const files = await this.findAll({
      attributes: ["channelId"],
      raw: true,
    });
    const channelIds = files.map((file) => file.channelId);
    const uniqueChannelIds = [...new Set(channelIds)];
    return uniqueChannelIds;
  }

  static async isEmpty() {
    return (await this.findAll()).length === 0;
  }

  static async fuzzySearch(query, pageNumber) {
    const files = await this.findAll({ raw: true });
    if (files.length < 1) return [];

    const option = {
      keys: ["caption"],
      threshold: 0.2,
    };

    const fuse = new Fuse(files, option);
    const searchResults = fuse.search(query);
    let filteredData = searchResults.map((d) => d.item);

    if (pageNumber) {
      const startIndex = (pageNumber - 1) * config.PAGINATION_LIMIT;
      const endIndex = pageNumber * config.PAGINATION_LIMIT;

      filteredData = filteredData.slice(startIndex, endIndex);
    }
    return filteredData;
  }

  static async paginatedSearch(query, messageId, botUserName) {
    const files = await this.fuzzySearch(query);
    if (files.length < 1) return;

    const paginatedData = paginateArray(files, messageId, query, botUserName);
    allButtons[messageId] = paginatedData;
    return paginatedData[0];
  }
}

File.init(
  {
    messageId: {
      type: DataTypes.INTEGER,
    },
    channelId: {
      type: DataTypes.STRING,
    },
    caption: {
      type: DataTypes.STRING(1000),
    },
    fileSize: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize: DatabaseConnector, modelName: "File" }
);

export default File;

