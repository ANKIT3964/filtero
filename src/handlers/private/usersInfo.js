import { Composer } from "grammy";

import User from "../../models/User.js";
import Commands from "../../helpers/Commands.js";
import config from "../../configs/config.js";

const composer = new Composer();
const filter = composer.filter((context) =>
  config.AUTHORIZED_USERS.includes(context.from.id)
);

filter.command("users", async (context) => {
  const totalUsers = await User.findAll();

  return context.reply(
    context.i18n.t("users_scanned", {
      usersLength: totalUsers.length,
    })
  );
});
Commands.addNewCommand(
  "users",
  "Send the list of all users who are scanned by bot"
);

export default composer;
