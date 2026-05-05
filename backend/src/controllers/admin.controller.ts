import { Request, Response } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import Progress from '../models/Progress';
import Lesson from '../models/Lesson';

// @desc    Obtener estadísticas globales para el dashboard
// @route   GET /api/admin/stats
export const getAdminStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const totalUsers = await User.countDocuments({ rol: 'user' });
    const totalCourses = await Course.countDocuments();
    
    // Contar certificados (usuarios que terminaron algún curso)
    const certificates = await Progress.countDocuments({ finalExamenPasado: true });

    // Datos para gráfica de usuarios (últimos 7 días - mockeado por ahora)
    const userGrowth = [10, 25, 45, 60, 85, 110, totalUsers];
    
    // Cursos más populares
    const popularCourses = await Progress.aggregate([
      { $group: { _id: '$curso', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: '$courseInfo' },
      {
        $project: {
          titulo: '$courseInfo.titulo',
          estudiantes: '$count'
        }
      }
    ]);

    res.json({
      totalUsers,
      totalCourses,
      certificates,
      userGrowth,
      popularCourses
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

// @desc    Obtener todos los usuarios con filtros
// @route   GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { search, rol, status } = req.query;
    let query: any = {};

    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (rol) query.rol = rol;
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// @desc    Obtener detalles de un usuario (progreso y certificados)
// @route   GET /api/admin/users/:id
export const getUserDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const progress = await Progress.find({ usuario: user._id })
      .populate('curso', 'titulo imagen');

    res.json({
      user,
      progress
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener detalles', error: error.message });
  }
};

// @desc    Actualizar usuario (admin)
// @route   PUT /api/admin/users/:id
export const updateUserAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.nombre = req.body.nombre || user.nombre;
    user.email = req.body.email || user.email;
    user.rol = req.body.rol || user.rol;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.deleteOne();
    await Progress.deleteMany({ usuario: user._id });
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};
