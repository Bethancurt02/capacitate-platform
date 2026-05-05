import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  curso: mongoose.Types.ObjectId;
  titulo: string;
  contenido: string; // Puede ser texto o URL de video
  orden: number;
}

const lessonSchema = new Schema<ILesson>(
  {
    curso: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    orden: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);

export default Lesson;
