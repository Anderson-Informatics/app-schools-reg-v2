import { ConnectDB } from "~~/server/utils/db";
import ConfigModel from '~~/server/models/config.model';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { _id, ...updateData } = body;
  await ConnectDB();
  // Update a Config's data
  try {
    const res = await ConfigModel.updateOne(
      { _id },
      { ...updateData },
    );
    console.log(`Config ${_id} updated: `, res);
    return res;
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
