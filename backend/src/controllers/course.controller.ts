import { Request, Response } from 'express';
import Course from '../models/Course';
import Question from '../models/Question';
import Progress from '../models/Progress';
import Lesson from '../models/Lesson';

// @desc    Obtener todos los cursos
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    const courses = await Course.find({ isActive: true });
    return res.status(200).json(courses);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al obtener cursos', error: err.message });
  }
};

// @desc    Obtener un curso por ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response): Promise<any> => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      return res.status(200).json(course);
    } else {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

export const getFinalExamQuestions = async (req: Request, res: Response): Promise<any> => {
  try {
    const questions = await Question.find({ curso: req.params.id });
    
    if (questions.length === 0) {
      // Si no hay preguntas directas del curso, buscamos de todas sus lecciones
      const lessons = await Lesson.find({ curso: req.params.id });
      const lessonIds = lessons.map(l => l._id);
      const lessonQuestions = await Question.find({ leccion: { $in: lessonIds } });
      return res.status(200).json(lessonQuestions);
    }

    return res.status(200).json(questions);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al obtener preguntas del examen', error: err.message });
  }
};

// @desc    Crear un curso
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { titulo, descripcion, categoria, imagen, lessons } = req.body;

    const course = new Course({
      titulo,
      descripcion,
      categoria,
      imagen,
    });

    const createdCourse = await course.save();

    // Si hay lecciones, crearlas
    if (lessons && Array.isArray(lessons)) {
      for (const [index, l] of lessons.entries()) {
        const lesson = new Lesson({
          curso: createdCourse._id,
          titulo: l.titulo,
          contenido: l.contenido,
          orden: index + 1
        });
        const createdLesson = await lesson.save();

        // Si la lección tiene preguntas, crearlas
        if (l.questions && Array.isArray(l.questions)) {
          for (const q of l.questions) {
            await Question.create({
              leccion: createdLesson._id,
              curso: createdCourse._id,
              pregunta: q.pregunta,
              opciones: q.opciones,
              respuestaCorrecta: q.respuestaCorrecta
            });
          }
        }
      }
    }

    return res.status(201).json(createdCourse);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al crear curso', error: err.message });
  }
};

// @desc    Actualizar un curso
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { titulo, descripcion, categoria, imagen, isActive } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
      course.titulo = titulo || course.titulo;
      course.descripcion = descripcion || course.descripcion;
      course.categoria = categoria || course.categoria;
      course.imagen = imagen || course.imagen;
      if (isActive !== undefined) course.isActive = isActive;

      const updatedCourse = await course.save();
      return res.status(200).json(updatedCourse);
    } else {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al actualizar curso', error: err.message });
  }
};

// @desc    Eliminar un curso
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await course.deleteOne();
      return res.status(200).json({ message: 'Curso eliminado' });
    } else {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al eliminar curso', error: err.message });
  }
};
// @desc    Obtener todos los cursos para admin (incluye inactivos)
// @route   GET /api/courses/admin
export const getAdminCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    
    // Para cada curso, contar estudiantes
    const coursesWithStats = await Promise.all(courses.map(async (course) => {
      const studentCount = await Progress.countDocuments({ curso: course._id });
      const completedCount = await Progress.countDocuments({ curso: course._id, finalExamenPasado: true });
      return {
        ...course.toObject(),
        studentCount,
        completedCount
      };
    }));

    return res.status(200).json(coursesWithStats);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al obtener cursos admin', error: err.message });
  }
};

// @desc    Obtener estudiantes inscritos en un curso
// @route   GET /api/courses/:id/students
export const getCourseStudents = async (req: Request, res: Response): Promise<any> => {
  try {
    const students = await Progress.find({ curso: req.params.id })
      .populate('usuario', 'nombre email fotoPerfil');
    
    return res.status(200).json(students);
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al obtener estudiantes del curso', error: err.message });
  }
};
