import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  usuario: mongoose.Types.ObjectId;
  curso: mongoose.Types.ObjectId;
  leccionesCompletadas: mongoose.Types.ObjectId[];
  quicesCompletados: mongoose.Types.ObjectId[];
  porcentaje: number;
  finalExamenPasado: boolean;
}

const progressSchema = new Schema<IProgress>(
  {
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    curso: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    leccionesCompletadas: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    quicesCompletados: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    porcentaje: { type: Number, default: 0 },
    finalExamenPasado: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model<IProgress>('Progress', progressSchema);

export default Progress;
