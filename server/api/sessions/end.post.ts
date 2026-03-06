import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';
import StudentModel from '~~/server/models/student.model';
import startGet from './start.get';

export default defineEventHandler(async (event) => {
  // Function to calculate
  const durationCalc = (start: string, end: string) => {
    const t1 = Date.parse(`2024-12-02 ${start}`); //, 'yyyy-MM-dd HH:mm:ss a');
    const t2 = Date.parse(`2024-12-02 ${end}`); //, 'yyyy-MM-dd HH:mm:ss a');
    const hours = Math.floor(Math.abs((t2 - t1) / 3600000));
    const min = Math.round(((t2 - t1) / 1000 / 60) % 60);
    const time = Math.abs((t2 - t1) / 3600000);

    return time;
  };

  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
    const res = await SessionModel.updateOne(
      { _id: body._id },
      { end: body.end, duration: durationCalc(body.start, body.end) },
    );
    console.log(res);
    const result = await StudentModel.updateMany(
      { SubmissionID: { $in: body.students } },
      {
        $set: {
          'TestSession.end': body.end,
          'TestSession.duration': durationCalc(body.start, body.end),
          CheckOut: body.CheckOut,
        },
        upsert: true,
      },
    );
    console.log(result);
    return { message: 'Testing Session Successfully Ended' };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
  //return durationCalc(body.start, body.end);
});
