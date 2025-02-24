import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  submissionIdInt: String,
  submissionId: String,
  IEP: String,
  FullName: String,
  FirstName: String,
  LastName: String,
  Status: String,
  Session: String,
  GradeEntering: String,
  ageText: String,
  Data_Sheet: String,
  ParentPhone: String,
  DOB: String,
  Group: String,
  ageInMonths: Number,
  Exam_Label_Count: Number,
  Group_Label_Count: Number,
  CheckIn: mongoose.Schema.Types.Mixed,
  AgeEligible: String,
  ExamRequired: Boolean,
});

// roster model
export default mongoose.model("Student", schema);
