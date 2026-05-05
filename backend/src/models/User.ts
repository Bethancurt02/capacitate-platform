import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  nombre: string;
  email: string;
  password?: string;
  fotoPerfil?: string;
  rol: 'user' | 'admin';
  resetPasswordCode?: string;
  resetPasswordExpires?: Date;
  matchPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fotoPerfil: {
      type: String,
      default: '',
    },
    rol: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
