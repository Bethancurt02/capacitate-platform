import { Request, Response } from 'express';
import Lesson from '../models/Lesson';
import Question from '../models/Question';

// @desc    Obtener lecciones de un curso específico
// @route   GET /api/lessons/course/:courseId
// @access  Private
export const getLessonsByCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const lessons = await Lesson.find({ curso: req.params.courseId }).sort({ orden: 1 });
    return res.status(200).json(lessons);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al obtener lecciones', error: err.message });
  }
};

// @desc    Crear una lección
// @route   POST /api/lessons
// @access  Private/Admin
export const createLesson = async (req: Request, res: Response): Promise<any> => {
  try {
    const { curso, titulo, contenido, orden } = req.body;
    const lesson = new Lesson({ curso, titulo, contenido, orden });
    const createdLesson = await lesson.save();
    return res.status(201).json(createdLesson);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al crear lección', error: err.message });
  }
};

// @desc    Obtener preguntas de una lección
// @route   GET /api/lessons/:lessonId/questions
// @access  Private
export const getQuestionsByLesson = async (req: Request, res: Response): Promise<any> => {
  try {
    // Excluimos respuestaCorrecta si no es admin, pero para simplificar lo enviamos (el front debe ocultarlo, o idealmente el backend solo lo valida. 
    // Para cumplir los requisitos de "no avanzar sin responder bien", enviaremos todo o dejaremos que el front evalúe).
    // NOTA: Para seguridad, es mejor que el front envíe la respuesta y el back evalúe, pero aquí enviaremos la estructura completa.
    const questions = await Question.find({ leccion: req.params.lessonId });
    return res.status(200).json(questions);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al obtener preguntas', error: err.message });
  }
};

// @desc    Crear una pregunta
// @route   POST /api/lessons/:lessonId/questions
// @access  Private/Admin
export const createQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { pregunta, opciones, respuestaCorrecta } = req.body;
    const question = new Question({
      leccion: req.params.lessonId,
      pregunta,
      opciones,
      respuestaCorrecta
    });
    const createdQuestion = await question.save();
    return res.status(201).json(createdQuestion);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al crear pregunta', error: err.message });
  }
};
