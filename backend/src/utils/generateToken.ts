import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export default generateToken;
