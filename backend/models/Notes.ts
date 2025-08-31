import mongoose, { Schema, Document } from "mongoose";

interface INote extends Document {
  
  content: string;
  userId: mongoose.Types.ObjectId;
}

const noteSchema = new Schema<INote>({
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export const Note = mongoose.model<INote>("Note", noteSchema);
