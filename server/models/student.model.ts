import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  SubmissionID: String,
  //submissionIdUnique: String,
  FullName: String,
  FirstName: String,
  LastName: String,
  CheckIn: mongoose.Schema.Types.Mixed,
});

// roster model
export default mongoose.model("Student", schema);
