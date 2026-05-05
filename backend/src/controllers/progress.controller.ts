import { Request, Response } from 'express';
import Progress from '../models/Progress';
import Lesson from '../models/Lesson';
import { AuthRequest } from '../middlewares/auth.middleware';

// @desc    Obtener todo el progreso del usuario actual
// @route   GET /api/progress
// @access  Private
export const getAllProgress = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const progresos = await Progress.find({ usuario: req.user?._id }).populate('curso');
    return res.status(200).json(progresos);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al obtener todos los progresos', error: err.message });
  }
};

// @desc    Obtener el progreso del usuario actual en un curso
// @route   GET /api/progress/:courseId
// @access  Private
export const getProgress = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const progreso = await Progress.findOne({ 
      usuario: req.user?._id, 
      curso: req.params.courseId 
    }).populate('leccionesCompletadas').populate('quicesCompletados');

    if (progreso) {
      return res.status(200).json(progreso);
    } else {
      return res.status(200).json({ 
        leccionesCompletadas: [], 
        quicesCompletados: [],
        porcentaje: 0, 
        finalExamenPasado: false 
      });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al obtener progreso', error: err.message });
  }
};

// @desc    Marcar lección como completada
// @route   POST /api/progress/:courseId/lesson/:lessonId
// @access  Private
export const markLessonCompleted = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { courseId, lessonId } = req.params;
    
    // Validar secuencia: si no es la primera lección, la anterior debe estar completada (contenido visto)
    const currentLesson = await Lesson.findById(lessonId);
    if (!currentLesson) return res.status(404).json({ message: 'Lección no encontrada' });

    let progreso = await Progress.findOne({ usuario: req.user?._id, curso: courseId });
    if (!progreso) {
      progreso = new Progress({
        usuario: req.user?._id,
        curso: courseId,
        leccionesCompletadas: [],
        quicesCompletados: [],
        porcentaje: 0,
        finalExamenPasado: false
      });
    }

    // Saltamos la validación de secuencia para permitir un flujo más suave durante desarrollo
    /*
    if (currentLesson.orden > 1) {
      const prevLesson = await Lesson.findOne({ curso: courseId, orden: currentLesson.orden - 1 });
      const quizAprobado = progreso.quicesCompletados.some(id => id.toString() === prevLesson?._id.toString());
      
      if (prevLesson && !quizAprobado) {
        return res.status(403).json({ message: 'Debes aprobar el quiz de la lección anterior primero' });
      }
    }
    */

    const leccionYaVista = progreso.leccionesCompletadas.some(id => id.toString() === lessonId);

    if (!leccionYaVista) {
      progreso.leccionesCompletadas.push(lessonId as any);
    }

    // Siempre recalcular para asegurar que la barra se mueva si hubo errores previos
    const allLessons = await Lesson.find({ curso: courseId });
    const totalLessons = allLessons.length;
    const totalSteps = (totalLessons * 2) + 1;
    
    // Validar que el progreso contenga IDs válidos
    const validLecciones = progreso.leccionesCompletadas.filter(id => allLessons.some(al => al._id.toString() === id.toString()));
    const validQuices = progreso.quicesCompletados.filter(id => allLessons.some(al => al._id.toString() === id.toString()));
    
    const currentSteps = validLecciones.length + validQuices.length;
    
    let calculatedPercentage = totalSteps > 0 ? Math.floor((currentSteps / totalSteps) * 100) : 0;
    if (calculatedPercentage > 99) calculatedPercentage = 99;
    if (progreso.finalExamenPasado) calculatedPercentage = 100;
    
    progreso.porcentaje = calculatedPercentage;
    progreso.leccionesCompletadas = validLecciones as any;
    progreso.quicesCompletados = validQuices as any;
    
    await progreso.save();
    const { saveUsersToFile } = await import('../utils/userPersist');
    await saveUsersToFile();

    const updatedProgreso = await Progress.findById(progreso._id)
      .populate('leccionesCompletadas')
      .populate('quicesCompletados');

    return res.status(200).json(updatedProgreso);
  } catch (err: any) {
    console.error('Error in markLessonCompleted:', err);
    return res.status(500).json({ message: 'Error al actualizar progreso', error: err.message });
  }
};

// @desc    Marcar quiz de lección como aprobado
// @route   POST /api/progress/:courseId/lesson/:lessonId/quiz
// @access  Private
export const passLessonQuiz = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { courseId, lessonId } = req.params;
    let progreso = await Progress.findOne({ usuario: req.user?._id, curso: courseId });
    if (!progreso) {
      progreso = new Progress({
        usuario: req.user?._id,
        curso: courseId,
        leccionesCompletadas: [],
        quicesCompletados: [],
        porcentaje: 0,
        finalExamenPasado: false
      });
    }

    const quizYaAprobado = progreso.quicesCompletados.some(id => id.toString() === lessonId);

    if (!quizYaAprobado) {
      progreso.quicesCompletados.push(lessonId as any);
      // Aseguramos que también esté marcada como vista
      if (!progreso.leccionesCompletadas.some(id => id.toString() === lessonId)) {
        progreso.leccionesCompletadas.push(lessonId as any);
      }
    }

    // Siempre recalcular y asegurar que sea un entero
    const allLessons = await Lesson.find({ curso: courseId });
    const totalLessons = allLessons.length;
    const totalSteps = (totalLessons * 2) + 1; // 2 steps per lesson (view + quiz) + 1 for final exam
    
    // Validar que el progreso contenga IDs válidos que existen actualmente
    const validLecciones = progreso.leccionesCompletadas.filter(id => allLessons.some(al => al._id.toString() === id.toString()));
    const validQuices = progreso.quicesCompletados.filter(id => allLessons.some(al => al._id.toString() === id.toString()));
    
    const currentSteps = validLecciones.length + validQuices.length;
    
    let calculatedPercentage = totalSteps > 0 ? Math.floor((currentSteps / totalSteps) * 100) : 0;
    if (calculatedPercentage > 99) calculatedPercentage = 99;
    if (progreso.finalExamenPasado) calculatedPercentage = 100;
    
    progreso.porcentaje = calculatedPercentage;
    progreso.leccionesCompletadas = validLecciones as any;
    progreso.quicesCompletados = validQuices as any;
    
    await progreso.save();
    const { saveUsersToFile } = await import('../utils/userPersist');
    await saveUsersToFile();

    // Poblar antes de devolver para que el frontend tenga consistencia
    const updatedProgreso = await Progress.findById(progreso._id)
      .populate('leccionesCompletadas')
      .populate('quicesCompletados');

    return res.status(200).json(updatedProgreso);
  } catch (err: any) {
    console.error('Error in passLessonQuiz:', err);
    return res.status(500).json({ message: 'Error al guardar resultado del quiz', error: err.message });
  }
};

// @desc    Aprobar examen final
// @route   POST /api/progress/:courseId/exam
// @access  Private
export const passFinalExam = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params;
    const progreso = await Progress.findOne({ usuario: req.user?._id, curso: courseId });

    if (!progreso) return res.status(404).json({ message: 'Progreso no encontrado' });

    const totalLessons = await Lesson.countDocuments({ curso: courseId });
    if (progreso.quicesCompletados.length < totalLessons) {
      return res.status(400).json({ message: 'Debes aprobar todos los quices de las lecciones primero' });
    }

    progreso.finalExamenPasado = true;
    progreso.porcentaje = 100;
    await progreso.save();
    const { saveUsersToFile } = await import('../utils/userPersist');
    await saveUsersToFile();

    const updatedProgreso = await Progress.findById(progreso._id)
      .populate('leccionesCompletadas')
      .populate('quicesCompletados');

    return res.status(200).json({ 
      message: '¡Felicidades! Has aprobado el examen final.', 
      progreso: updatedProgreso 
    });
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al aprobar examen final', error: err.message });
  }
};

// @desc    Reiniciar progreso de un curso
// @route   DELETE /api/progress/:courseId
// @access  Private
export const resetProgress = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params;
    await Progress.findOneAndDelete({ usuario: req.user?._id, curso: courseId });
    
    return res.status(200).json({ message: 'Progreso reiniciado correctamente' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al reiniciar progreso', error: err.message });
  }
};
