import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  } else {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction): any => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'No autorizado como administrador' });
  }
};
