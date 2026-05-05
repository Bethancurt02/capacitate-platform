import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const CERTIFICATES_FILE = path.join(DATA_DIR, 'certificates.json');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const LESSONS_FILE = path.join(DATA_DIR, 'lessons.json');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const saveUsersToFile = async () => {
  try {
    const User = (await import('../models/User')).default;
    const users = await User.find({});
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users to file:', err);
  }
};

export const saveProgressToFile = async () => {
  try {
    const Progress = (await import('../models/Progress')).default;
    const progress = await Progress.find({});
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  } catch (err) {
    console.error('Error saving progress to file:', err);
  }
};

export const saveCertificatesToFile = async () => {
  try {
    const Certificate = (await import('../models/Certificate')).default;
    const certificates = await Certificate.find({});
    fs.writeFileSync(CERTIFICATES_FILE, JSON.stringify(certificates, null, 2));
  } catch (err) {
    console.error('Error saving certificates to file:', err);
  }
};

export const saveCoursesToFile = async () => {
  try {
    const Course = (await import('../models/Course')).default;
    const courses = await Course.find({});
    fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
  } catch (err) {
    console.error('Error saving courses to file:', err);
  }
};

export const saveLessonsToFile = async () => {
  try {
    const Lesson = (await import('../models/Lesson')).default;
    const lessons = await Lesson.find({});
    fs.writeFileSync(LESSONS_FILE, JSON.stringify(lessons, null, 2));
  } catch (err) {
    console.error('Error saving lessons to file:', err);
  }
};

export const saveQuestionsToFile = async () => {
  try {
    const Question = (await import('../models/Question')).default;
    const questions = await Question.find({});
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
  } catch (err) {
    console.error('Error saving questions to file:', err);
  }
};

export const loadUsersFromFile = async () => {
  try {
    console.log('Starting data restore from files...');

    // 1. LOAD USERS
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(raw);
      if (Array.isArray(users) && users.length > 0) {
        const User = (await import('../models/User')).default;
        for (const u of users) {
          const doc = { ...u };
          if (doc._id && typeof doc._id === 'string') doc._id = new mongoose.Types.ObjectId(doc._id);
          await User.replaceOne({ email: doc.email }, doc, { upsert: true });
        }
        console.log(`Restored/Updated ${users.length} user(s).`);
      }
    }

    // 2. LOAD CERTIFICATES
    if (fs.existsSync(CERTIFICATES_FILE)) {
      const raw = fs.readFileSync(CERTIFICATES_FILE, 'utf-8');
      const certs = JSON.parse(raw);
      if (Array.isArray(certs) && certs.length > 0) {
        const Certificate = (await import('../models/Certificate')).default;
        for (const c of certs) {
          const doc = { ...c };
          if (doc._id && typeof doc._id === 'string') doc._id = new mongoose.Types.ObjectId(doc._id);
          if (doc.usuario && typeof doc.usuario === 'string') doc.usuario = new mongoose.Types.ObjectId(doc.usuario);
          if (doc.curso && typeof doc.curso === 'string') doc.curso = new mongoose.Types.ObjectId(doc.curso);
          if (doc.fechaEmision && typeof doc.fechaEmision === 'string') doc.fechaEmision = new Date(doc.fechaEmision);
          await Certificate.replaceOne({ _id: doc._id }, doc, { upsert: true });
        }
        console.log(`Restored/Updated ${certs.length} certificate(s).`);
      }
    }

    // 3. LOAD COURSE CONTENT (Courses, Lessons, Questions)
    // Only if files exist (otherwise seedData will handle it)
    if (fs.existsSync(COURSES_FILE) || fs.existsSync(LESSONS_FILE) || fs.existsSync(QUESTIONS_FILE)) {
      const Course = (await import('../models/Course')).default;
      const Lesson = (await import('../models/Lesson')).default;
      const Question = (await import('../models/Question')).default;

      // Clear existing content to avoid duplicates and ensure correct language/IDs
      await Course.deleteMany({});
      await Lesson.deleteMany({});
      await Question.deleteMany({});
      console.log('Cleared existing course content for fresh restore.');

      if (fs.existsSync(COURSES_FILE)) {
        const courses = JSON.parse(fs.readFileSync(COURSES_FILE, 'utf-8'));
        for (const c of courses) {
          const doc = { ...c };
          if (doc._id && typeof doc._id === 'string') doc._id = new mongoose.Types.ObjectId(doc._id);
          await Course.replaceOne({ _id: doc._id }, doc, { upsert: true });
        }
      }

      if (fs.existsSync(LESSONS_FILE)) {
        const lessons = JSON.parse(fs.readFileSync(LESSONS_FILE, 'utf-8'));
        for (const l of lessons) {
          const doc = { ...l };
          if (doc._id && typeof doc._id === 'string') doc._id = new mongoose.Types.ObjectId(doc._id);
          if (doc.curso && typeof doc.curso === 'string') doc.curso = new mongoose.Types.ObjectId(doc.curso);
          await Lesson.replaceOne({ _id: doc._id }, doc, { upsert: true });
        }
      }

      if (fs.existsSync(QUESTIONS_FILE)) {
        const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
        for (const q of questions) {
          const doc = { ...q };
          if (doc._id && typeof doc._id === 'string') doc._id = new mongoose.Types.ObjectId(doc._id);
          if (doc.curso && typeof doc.curso === 'string') doc.curso = new mongoose.Types.ObjectId(doc.curso);
          if (doc.leccion && typeof doc.leccion === 'string') doc.leccion = new mongoose.Types.ObjectId(doc.leccion);
          await Question.replaceOne({ _id: doc._id }, doc, { upsert: true });
        }
      }
      console.log('Course content restored from files.');
    }

    // 4. LOAD PROGRESS WITH MIGRATION
    if (fs.existsSync(PROGRESS_FILE)) {
      const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8');
      const progresos = JSON.parse(raw);
      if (Array.isArray(progresos) && progresos.length > 0) {
        const Progress = (await import('../models/Progress')).default;
        const Lesson = (await import('../models/Lesson')).default;
        
        const allLessons = await Lesson.find({});

        for (const p of progresos) {
          const doc = { ...p };
          if (doc._id && typeof doc._id === 'string') doc._id = new mongoose.Types.ObjectId(doc._id);
          if (doc.usuario && typeof doc.usuario === 'string') doc.usuario = new mongoose.Types.ObjectId(doc.usuario);
          if (doc.curso && typeof doc.curso === 'string') doc.curso = new mongoose.Types.ObjectId(doc.curso);
          
          // ID Migration helper
          const migrateIds = (idList: any[]) => {
            if (!Array.isArray(idList)) return [];
            return idList.map(id => {
              const idStr = id.toString();
              const exists = allLessons.find(al => al._id.toString() === idStr);
              return exists ? new mongoose.Types.ObjectId(idStr) : null;
            }).filter(id => id !== null);
          };

          if (doc.leccionesCompletadas) doc.leccionesCompletadas = migrateIds(doc.leccionesCompletadas);
          if (doc.quicesCompletados) doc.quicesCompletados = migrateIds(doc.quicesCompletados);
          
          await Progress.replaceOne({ _id: doc._id }, doc, { upsert: true });
        }
        console.log(`Restored/Migrated ${progresos.length} progress records.`);
      }
    }

  } catch (err) {
    console.error('Error during data restore:', err);
  }
};
