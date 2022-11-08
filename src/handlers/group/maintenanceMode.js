import { Composer } from "grammy";
import {
  turnOffMaintenanceMode,
  turnOnMaintenanceMode,
} from "../../helpers/maintenance.js";
import MaintenanceMode from "../../models/MaintenanceMode.js";
import Commands from "../../helpers/Commands.js";

const composer = new Composer();
composer.command("maintenance", async (context) => {
  const splittedMatch = context.match.split(" ");
  const instruction = splittedMatch[0].toLowerCase();
  const reason = splittedMatch.join(" ").replace(instruction, "").trim();
  const chatId = context.chat.id;

  if (!["on", "off"].includes(instruction)) {
    throw new Error(context.i18n.t("invalid_maintenance_instruction"));
  }

  if (instruction === "on") {
    const maintenanceObject = await MaintenanceMode.findOne({
      where: { chatId },
      raw: true,
    });
    if (maintenanceObject)
      throw new Error(context.i18n.t("maintenance_mode_already_turned_on"));
    const { messageId, permissions } = await turnOnMaintenanceMode(
      context,
      reason
    );

    await MaintenanceMode.create({
      chatId,
      messageId,
      permissions: JSON.stringify(permissions),
    });
  } else if (instruction === "off") {
    const maintenanceObject = await MaintenanceMode.findOne({
      where: { chatId },
      raw: true,
    });

    if (!maintenanceObject)
      throw new Error(context.i18n.t("maintenance_mode_not_turned_on"));

    await turnOffMaintenanceMode(
      context,
      JSON.parse(maintenanceObject.permissions),
      maintenanceObject.messageId
    );
    await context.reply(context.i18n.t("maintenance_mode_off"));
    await MaintenanceMode.destroy({ where: { chatId } });
  }
});

Commands.addNewCommand("maintenance", "Turn on maintenance mode (on/off)");

export default composer;
