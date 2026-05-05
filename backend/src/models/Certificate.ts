import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  usuario: mongoose.Types.ObjectId;
  curso: mongoose.Types.ObjectId;
  codigoValidacion: string;
  pdfUrl?: string;
  fechaEmision: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    curso: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    codigoValidacion: { type: String, required: true, unique: true },
    pdfUrl: { type: String },
    fechaEmision: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);

export default Certificate;
