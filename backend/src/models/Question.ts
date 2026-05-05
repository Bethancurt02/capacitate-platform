import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  leccion?: mongoose.Types.ObjectId;
  curso?: mongoose.Types.ObjectId;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number; // Índice de la opción correcta
}

const questionSchema = new Schema<IQuestion>(
  {
    leccion: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    curso: { type: Schema.Types.ObjectId, ref: 'Course' },
    pregunta: { type: String, required: true },
    opciones: [{ type: String, required: true }],
    respuestaCorrecta: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
