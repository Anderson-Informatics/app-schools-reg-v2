import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';
import ConfigModel from "~~/server/models/config.model";
import type { Session, Config } from '~~/types';
import { el } from "vuetify/locale";

export default defineEventHandler(async (event) => {
  // Get data from body
  const student = await readBody(event);
  console.log(student);
  // Update a result
  await ConnectDB();
  try {
    const today = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeZone: "America/Detroit",
      }).format(new Date())

    const config = await ConfigModel.findOne({}).lean<Config>();

    // Check the config for grade level groupings then create a session grade value accordingly
    let sessionGrade = student.GradeEntering;
    if (config?.group34 && ["3", "4"].includes(student.GradeEntering)) {
      sessionGrade = "3-4";
    } else if (config?.group56 && ["5", "6"].includes(student.GradeEntering)) {
      sessionGrade = "5-6";
    } else if (config?.group78 && ["7", "8"].includes(student.GradeEntering)) {
      sessionGrade = "7-8";
    } else {
      sessionGrade = student.GradeEntering;
    }

    // Set the session capacity based on the config for grade level groupings
    let sessionCapacity = 22;
    if (sessionGrade === "3-4" && config?.group34) {
      sessionCapacity = config.g34cap;
    } else if (sessionGrade === "5-6" && config?.group56) {
      sessionCapacity = config.g56cap;
    } else if (sessionGrade === "7-8" && config?.group78) {
      sessionCapacity = config.g78cap;
    } else if (sessionGrade === "2") { sessionCapacity = config?.g2cap || 22; }
    else if (sessionGrade === "3") { sessionCapacity = config?.g3cap || 22; }
    else if (sessionGrade === "4") { sessionCapacity = config?.g4cap || 22; }
    else if (sessionGrade === "5") { sessionCapacity = config?.g5cap || 22; }
    else if (sessionGrade === "6") { sessionCapacity = config?.g6cap || 22; }
    else if (sessionGrade === "7") { sessionCapacity = config?.g7cap || 22; }
    else if (sessionGrade === "8") { sessionCapacity = config?.g8cap || 22; }


    let session = await SessionModel.findOne({
      date: today,
      grade: sessionGrade,
      status: "Open",
    }).lean<Session>();

    if (!session) {
      const createdSession = await SessionModel.create({
        _id: crypto.randomUUID(),
        sessionId: 'unassigned',
        proctor: "Unassigned",
        phone: "",
        room: "Unassigned",
        date: new Intl.DateTimeFormat("en-US", {
            dateStyle: "full",
            timeZone: "America/Detroit",
          }).format(new Date()),
        grade: sessionGrade,
        status: "Open",
        capacity: sessionCapacity,
        students: [student],
      });
      console.log('New session created: ', createdSession);
      //return result
      return { message: 'Student Added to New Session' };
    } else {
      const newCount = (session.students.length || 0) + 1;
      const studentExists = session.students.some((s: any) => s.submissionId === student.submissionId);
      console.log('Student Found: ', studentExists)
      if (studentExists) {
        console.log('Student already registered in session.');
        return { message: 'Student already registered in session.' };
      }
      const updatedSession = await SessionModel.updateOne(
        { _id: session._id },
        {
          $push: { students: student },
          ...(newCount === session.capacity ? { $set: { status: "Closed" } } : {}),
        },
      );
      console.log('Session updated: ', updatedSession);
      //return result
      return { message: 'Student Added to Existing Session' };
    }
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
