import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { apiThrottler } from "@grammyjs/transformer-throttler";

import Bot from "./configs/Bot.js";

import Handlers from "./handlers/index.js";
import Logger from "./helpers/Logger.js";
import Commands from "./helpers/Commands.js";
import handleErrors from "./helpers/handleErrors.js";

import i18n from "./middlewares/i18n.js";
import DatabaseConnector from "./configs/DatabaseConnector.js";
import express from "express";

const app = express();
const port = process.env.PORT || 3333;

app.get("/", async (req, res) => {
  res.json("Hello World");
});

app.listen(port, () => {
  console.log(`Bot listening at http://localhost:${port}`);
});

const throttler = apiThrottler();

class App {
  static async init() {
    Bot.use(i18n.middleware());

    Bot.api.config.use(throttler);
    Bot.use(Handlers).use(hydrateReply);
    await Commands.setCommands();
    Bot.api.config.use(parseMode("html"));
    Bot.catch(handleErrors);

    await DatabaseConnector.authenticate();

    await Bot.start({
      drop_pending_updates: true,
      onStart: Logger.send(i18n.t("en", "bot_started")),
    });
  }
}

App.init();
