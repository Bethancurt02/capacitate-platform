import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { saveUsersToFile } from '../utils/userPersist';
import nodemailer from 'nodemailer';

// Creates a reusable Ethereal transporter for testing emails (no signup required)
const createEmailTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Por favor, incluya todos los campos requeridos' });
    }

    // Normalizamos el email para evitar duplicados por mayúsculas
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({
      nombre,
      email: normalizedEmail,
      password,
      rol: rol || 'user',
    });

    if (user) {
      // Persist user data to file so it survives server restarts
      await saveUsersToFile();

      return res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        fotoPerfil: user.fotoPerfil,
        token: generateToken(user._id.toString()),
      });
    } else {
      return res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, ingrese email y contraseña' });
    }

    // Normalizamos el email para la búsqueda
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        fotoPerfil: user.fotoPerfil,
        token: generateToken(user._id.toString()),
      });
    } else {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

// @desc    Enviar código de recuperación por correo (Ethereal - real email preview)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    
    // ARREGLO CRÍTICO: Normalizamos el email antes de buscar
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = recoveryCode;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();
    await saveUsersToFile();

    // Send real email via Ethereal (free test mail service)
    try {
      const transporter = await createEmailTransporter();

      const mailOptions = {
        from: '"Hacer Competente" <noreply@hacercompetente.com>',
        to: normalizedEmail,
        subject: '🔐 Recuperación de Contraseña - Hacer Competente',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎓 Hacer Competente</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Plataforma de Aprendizaje</p>
            </div>
            <div style="padding: 40px; background: #ffffff;">
              <h2 style="color: #1e293b; margin-bottom: 16px;">Recuperación de Contraseña</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                Hola <strong>${user.nombre}</strong>, recibimos una solicitud para restablecer tu contraseña.
                Usa el siguiente código para continuar:
              </p>
              <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0;">
                <p style="color: #64748b; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Tu código de recuperación</p>
                <span style="font-size: 42px; font-weight: 800; color: #1d4ed8; letter-spacing: 8px;">${recoveryCode}</span>
              </div>
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
                ⏰ Este código expira en <strong>1 hora</strong>.<br>
                Si no solicitaste restablecer tu contraseña, ignora este correo.
              </p>
            </div>
            <div style="padding: 24px 40px; background: #f1f5f9; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 Hacer Competente. Todos los derechos reservados.</p>
            </div>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info);

      console.log(`📧 Email sent for ${normalizedEmail}. Preview: ${previewUrl}`);

      return res.status(200).json({
        message: 'Código de recuperación enviado. Revisa el enlace de vista previa.',
        previewUrl, // Frontend can show this as a link during dev/testing
      });

    } catch (emailErr: any) {
      console.error('Email error (code still saved):', emailErr.message);
      // Even if email fails, the code is saved — return it for fallback
      return res.status(200).json({
        message: 'Código generado (hubo un problema al enviar el correo)',
        code: recoveryCode,
      });
    }

  } catch (err: any) {
    return res.status(500).json({ message: 'Error en el proceso de recuperación', error: err.message });
  }
};

// @desc    Restablecer contraseña con código
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, code, newPassword } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Código inválido o expirado' });
    }

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    await saveUsersToFile();

    return res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Error al restablecer contraseña', error: err.message });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      user.nombre = req.body.nombre || user.nombre;
      user.email = req.body.email ? req.body.email.toLowerCase().trim() : user.email;

      if (req.file) {
        user.fotoPerfil = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await user.save();
      await saveUsersToFile();

      res.json({
        _id: updatedUser._id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        rol: updatedUser.rol,
        fotoPerfil: updatedUser.fotoPerfil,
        token: generateToken(updatedUser._id.toString()),
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

// @desc    Actualizar contraseña
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      const { oldPassword, newPassword } = req.body;

      if (await user.matchPassword(oldPassword)) {
        user.password = newPassword;
        await user.save();
        await saveUsersToFile();
        res.json({ message: 'Contraseña actualizada correctamente' });
      } else {
        res.status(400).json({ message: 'La contraseña actual es incorrecta' });
      }
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar contraseña' });
  }
};
