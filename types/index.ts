import type { ObjectId, Mixed } from 'mongoose';

export interface Student {
  _id: ObjectId;
  submissionId: string;
  submissionIdInt: string;
  IEP: string;
  FullName: string;
  FirstName: string;
  LastName: string;
  Status: string;
  Session: string;
  GradeEntering: string;
  ageText: string;
  Data_Sheet: string;
  ParentPhone: string;
  DOB: string;
  Group: string;
  ageInMonths: number;
  Exam_Label_Count: number;
  Group_Label_Count: number;
  AgeEligible: string;
  ExamRequired: boolean;
  Accommodations: string;
  CheckIn: {
        Date: string;
        Time: string;
        Timestamp: string;
        Registered: boolean;
      }
    | '';
  TestSession: {
        _id: string;
        proctor: string;
        phone: string;
        room: string;
        date: string;
        start: string;
        end: string;
        duration: number;
      }
    | '';
}

// Define the type for the student object
export interface StudentShort {
  submissionId: string;
  submissionIdInt: string;
  FullName: string;
  FirstName: string;
  LastName: string;
  GradeEntering: string;
  sessionId?: string; // Optional sessionId to link back to the session
  sessionLabel?: string; // Optional proctor name from the session
}

export interface Session {
  _id: string;
  sessionId: string;
  proctor: string;
  phone: string;
  room: string;
  date: string;
  grade: string;
  status: string;
  capacity: number;
  students: StudentShort[];
}

export interface Config {
  _id: string;
  g2cap: number;
  g3cap: number;
  g4cap: number;
  g5cap: number;
  g6cap: number;
  g7cap: number;
  g8cap: number;
  g34cap: number;
  g56cap: number;
  g78cap: number;
  group34: boolean;
  group56: boolean;
  group78: boolean;
  applyLabels: boolean;
  printLabels: boolean;
}
