import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  submissionId: String,
  appoinmtmentDate: String,
  appointmentTime: String,
  dateId: String,
  groupId: String,
  submittedDate: String,
});

// appointment model
export default mongoose.model("Appointment", schema);
