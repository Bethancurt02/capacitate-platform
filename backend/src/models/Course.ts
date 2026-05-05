import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  titulo: string;
  descripcion: string;
  categoria: string;
  imagen: string;
  videoIntro: string;
  isActive: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    imagen: { type: String, default: '' },
    videoIntro: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
