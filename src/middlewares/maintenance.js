import {
  turnOffMaintenanceMode,
  turnOnMaintenanceMode,
} from '../helpers/maintenance.js';

const maintenance = async (context, next) => {
  const { messageId, permissions } = await turnOnMaintenanceMode(context);

  try {
    await next(context);
  } finally {
    await turnOffMaintenanceMode(context, permissions, messageId);
  }
};

export default maintenance;
