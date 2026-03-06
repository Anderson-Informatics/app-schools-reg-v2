import { ConnectDB } from "~~/server/utils/db";
import ConfigModel from "~~/server/models/config.model";

export default defineEventHandler(async (event) => {
  await ConnectDB();
  const config = await ConfigModel.find({});
  return config[0];
});
