import "dotenv/config.js";
import { cleanEnv, num, str, bool, makeValidator } from "envalid";
import { StringSession } from "telegram/sessions/index.js";

import i18n from "../middlewares/i18n.js";

const splitArray = makeValidator((string) => string.split(" "));

const splitArrayAndFilterIntegers = makeValidator((string) =>
  string
    .split(" ")
    // eslint-disable-next-line radix
    .map((value) => parseInt(value))
    .filter((value) => !Number.isNaN(value))
);

const replaceIgnoredBreakLinesWithActualBreakLines = makeValidator((string) =>
  string.replace(/\\n/g, "\n")
);

const createStringSession = makeValidator(
  (string) => new StringSession(string.trim())
);

export default cleanEnv(process.env, {
  // User Credentials
  APP_ID: num(),
  API_HASH: str(),
  STRING_SESSION: createStringSession(),

  // Bot Credentials
  BOT_TOKEN: str(),
  AUTHORIZED_USERS: splitArrayAndFilterIntegers(),

  // MySQL Database Credentials
  DATABASE_NAME: str(),
  DATABASE_USER: str(),
  DATABASE_USER_PASSWORD: str(),
  DATABASE_HOST: str(),
  DATABASE_PORT: num({ default: 3306 }),
  AUTHORIZED_CHAT_IDS: splitArray(),

  // Optional Features
  REQUIRED_CHAT_TO_JOIN: splitArray({ default: "" }), // Optional Field
  WELCOME_MESSAGE: replaceIgnoredBreakLinesWithActualBreakLines({
    default: i18n.t("en", "welcome_message_caption"),
  }), // Optional Field
  LOG_CHANNEL: str({
    default: "",
  }), // Optional Field
  BLOCKED_WORDS: splitArray({ default: "" }), // Optional Field
  SENDALL_PER_PAGE: bool({ default: false }), // Optional Field
  PAGINATION_LIMIT: num({ default: 10 }), // Optional Field
  REQUEST_CHANNEL: str({ default: "" }), // Optional field
  DATABASE_DIALECT: str({default: "mysql"})
});
