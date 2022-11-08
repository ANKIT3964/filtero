import Logger from "./Logger.js";

export const turnOnMaintenanceMode = async (context, reason = "") => {
  const chat = await context.api.getChat(context.chat.id);

  await context.api.setChatPermissions(context.chat.id, {
    can_send_messages: false,
  });

  const maintenanceMessage = context.i18n.t("maintenance_mode_on", {
    reason,
  });
  Logger.send(maintenanceMessage);
  const { message_id: messageId } = await context.reply(maintenanceMessage);

  return { messageId, permissions: chat.permissions };
};

export const turnOffMaintenanceMode = async (
  context,
  permissions,
  messageId
) => {
  await context.api.setChatPermissions(context.chat.id, {
    ...permissions,
    can_send_messages: true,
  });

  const maintenanceMessage = context.i18n.t("maintenance_mode_off");
  Logger.send(maintenanceMessage);
  await context.api.deleteMessage(context.chat.id, messageId);
};
