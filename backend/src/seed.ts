import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';
import Lesson from './models/Lesson';
import Question from './models/Question';
import User from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const coursesData = [
  'Secretaria', 'Estilista', 'Cajero', 'Uñas', 'Farmacia', 'Barbería', 
  'Enfermería', 'Informática', 'Inglés', 'Celulares', 'Maquillaje', 'Cejas'
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capacitate');
    console.log('MongoDB Connected for Seeding...');

    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});

    // Crear un Admin y un User por defecto
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPass = await bcrypt.hash('admin123', salt);
    const hashedUserPass = await bcrypt.hash('user123', salt);

    await User.create([
      { nombre: 'Administrador', email: 'admin@capacitate.com', password: hashedAdminPass, rol: 'admin' },
      { nombre: 'Usuario Prueba', email: 'user@capacitate.com', password: hashedUserPass, rol: 'user' }
    ]);

    for (const title of coursesData) {
      const course = await Course.create({
        titulo: `Curso de ${title}`,
        descripcion: `Aprende todo lo necesario para ser un(a) excelente ${title.toLowerCase()} y consigue empleo rápidamente.`,
        categoria: title,
      });

      // Cada curso tiene 3 lecciones
      for (let i = 1; i <= 3; i++) {
        const lesson = await Lesson.create({
          curso: course._id,
          titulo: `Lección ${i}: Introducción y Conceptos Básicos`,
          contenido: `<p>Bienvenido a la lección ${i} del curso de ${title}. En esta lección aprenderás los conceptos fundamentales...</p><p>Asegúrate de tomar notas para aprobar el quiz al final.</p>`,
          orden: i
        });

        // Cada lección tiene 3 preguntas
        for (let j = 1; j <= 3; j++) {
          await Question.create({
            leccion: lesson._id,
            pregunta: `Pregunta de prueba ${j} para la lección ${i} de ${title}?`,
            opciones: ['Opción Incorrecta 1', 'Opción Correcta', 'Opción Incorrecta 2'],
            respuestaCorrecta: 1
          });
        }
      }
      console.log(`Course ${title} seeded with 3 lessons and 9 questions.`);
    }

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
