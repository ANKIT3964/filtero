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
  APP_ID: num(12512870),
  API_HASH: str(01e4639ae903f5d4a7b0876e5a3ea0a1),
  STRING_SESSION: createStringSession(1BVtsOMABu5QQKYwpd7A5xBepxnkADbuAUKz12FXF9EauVIcUqlKJdJ16KCMtYVTqEZgFcPTLqIbDiWaXOlDcxRfym_uq1Mp7Jw8b3aAmtCrKaGcw8ZVuNkROoV44PgBFvQTj8f1x6CO6MFMPuSzYFdOrNtmVooke9mjlncMk-nIxWjnDgSz1B6LSq5HES9FqrWqI4c8Ms8mD05LyikkH-3U2kELKCSCpywmLwsCmIKQQIDK-QUjbuoP6LHHCeU0XbJlFRmVzjuNd8Hec1btps28r6gcV14vllALSN-TeBHWi6_oB5SRRgu2PZYaP2DC50zm4L1VgYhon-U_f33SnO6_mCJ6lI6o=),

  // Bot Credentials
  BOT_TOKEN: str(5638053781:AAFJYQhDLXnZCvVM0jG_MSPbuVuHZ9us01A),
  AUTHORIZED_USERS: splitArrayAndFilterIntegers(1197918807),

  // MySQL Database Credentials
  DATABASE_NAME: str(u597183945_sigmaankit),
  DATABASE_USER: str(u597183945_sigmaankit),
  DATABASE_USER_PASSWORD: str(#Sigmaankit2025#),
  DATABASE_HOST: str(srv1327.hstgr.io),
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
