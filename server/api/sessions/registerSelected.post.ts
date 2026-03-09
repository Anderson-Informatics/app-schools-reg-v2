import { ConnectDB } from "~~/server/utils/db";
import SessionModel from "~~/server/models/session.model";
import type { Session } from "~~/types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  await ConnectDB();

  try {
    const sessionId = body?.sessionId;
    const student = body?.student;

    if (!sessionId || !student?.submissionId) {
      throw createError({ statusCode: 400, statusMessage: "Missing required registration data." });
    }

    const session = await SessionModel.findOne({ _id: sessionId }).lean<Session>();
    if (!session) {
      throw createError({ statusCode: 404, statusMessage: "Session not found." });
    }

    const studentExists = session.students?.some(
      (s: any) => s.submissionId === student.submissionId,
    );
    if (studentExists) {
      return { message: "Student already registered in session." };
    }

    const newCount = (session.students?.length || 0) + 1;
    await SessionModel.updateOne(
      { _id: sessionId },
      {
        $push: { students: student },
        ...(newCount >= session.capacity ? { $set: { status: "Closed" } } : {}),
      },
    );

    return { message: "Student added to selected session." };
  } catch (e: any) {
    throw createError({
      statusCode: e?.statusCode || 500,
      statusMessage: e?.statusMessage || e.message,
      message: e.message,
    });
  }
});
