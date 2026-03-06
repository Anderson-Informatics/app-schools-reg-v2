import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';
import type { Session, StudentShort } from '~~/types';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    await ConnectDB();
    const sessions = await SessionModel.find(query);

    let students: StudentShort[] = [];
    for (const session of sessions) {
        const sessionStudents = (session.students as StudentShort[]).map(student => ({
            ...student,
            sessionId: String(session._id),
            sessionLabel: `${session.proctor} / ${session.grade}`,
        }));
        students = students.concat(sessionStudents);
    }
    return students;
});