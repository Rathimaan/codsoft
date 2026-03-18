import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: String, enum: ['Active', 'Completed', 'On Hold'], default: 'Active' },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
