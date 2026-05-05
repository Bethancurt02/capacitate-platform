import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Certificate from '../models/Certificate';
import Progress from '../models/Progress';
import Course from '../models/Course';
import User from '../models/User';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import crypto from 'crypto';

// @desc    Generar y obtener certificado
// @route   GET /api/certificates/:courseId
// @access  Private
// Función auxiliar para dibujar el PDF (Compartida entre generación y verificación)
const drawCertificatePDF = async (doc: any, usuario: any, curso: any, certificado: any, reqHost: string) => {
  // --- DISEÑO PROFESIONAL ---
  
  // Fondo
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
  
  // Borde exterior (Azul oscuro)
  doc.lineWidth(15)
     .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
     .stroke('#002b5b');

  // Borde interior (Dorado/Fino)
  doc.lineWidth(2)
     .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
     .stroke('#c5a059');

  // Patrón en esquinas (Decorativo)
  const drawCorner = (x: number, y: number, rotation: number) => {
    doc.save();
    doc.translate(x, y);
    doc.rotate(rotation);
    doc.lineWidth(1).strokeColor('#c5a059');
    doc.moveTo(0, 0).lineTo(30, 0).stroke();
    doc.moveTo(0, 0).lineTo(0, 30).stroke();
    doc.restore();
  };

  drawCorner(45, 45, 0);
  drawCorner(doc.page.width - 45, 45, 90);
  drawCorner(doc.page.width - 45, doc.page.height - 45, 180);
  drawCorner(45, doc.page.height - 45, 270);

  // Sello de autenticidad (Superior derecha)
  doc.save();
  doc.translate(doc.page.width - 120, 110);
  doc.circle(0, 0, 45).lineWidth(2).strokeColor('#c5a059').dash(5, { space: 2 }).stroke();
  doc.circle(0, 0, 40).lineWidth(1).strokeColor('#c5a059').undash().stroke();
  doc.fillColor('#c5a059')
     .font('Helvetica-Bold')
     .fontSize(10)
     .text('GARANTÍA DE', -30, -15, { width: 60, align: 'center' })
     .text('CALIDAD', -30, 5, { width: 60, align: 'center' });
  doc.restore();

  // Encabezado
  doc.fillColor('#002b5b')
     .font('Helvetica-Bold')
     .fontSize(22)
     .text('Capacítate PRO', 80, 70);
  
  doc.fontSize(10)
     .font('Helvetica')
     .text('EXCELENCIA EN FORMACIÓN DIGITAL', 80, 95);

  // Título Principal
  doc.moveDown(2);
  doc.fillColor('#002b5b')
     .font('Helvetica-Bold')
     .fontSize(50)
     .text('CERTIFICADO', { align: 'center' });
  
  doc.fontSize(22)
     .font('Helvetica')
     .text('DE FINALIZACIÓN Y LOGRO', { align: 'center', wordSpacing: 5 });

  // Cuerpo
  doc.moveDown(1.5);
  doc.fillColor('#444444')
     .fontSize(18)
     .text('Se otorga el presente reconocimiento a:', { align: 'center' });
  
  doc.moveDown(0.5);
  doc.fillColor('#000000')
     .font('Helvetica-Bold')
     .fontSize(42)
     .text(usuario.nombre || 'Estudiante', { align: 'center' });

  doc.moveDown(0.5);
  doc.fillColor('#444444')
     .font('Helvetica')
     .fontSize(18)
     .text('Por haber cumplido satisfactoriamente con el programa del curso:', { align: 'center' });

  doc.moveDown(0.5);
  doc.fillColor('#002b5b')
     .font('Helvetica-Bold')
     .fontSize(30)
     .text(curso.titulo, { align: 'center' });

  // Fecha
  const fechaFormat = new Date(certificado.fechaEmision).toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  doc.moveDown(1);
  doc.fillColor('#666666')
     .font('Helvetica')
     .fontSize(14)
     .text(`Emitido el día ${fechaFormat}`, { align: 'center' });

  // --- PIE DE PÁGINA (FIRMA Y QR) ---
  
  // Línea de firma
  doc.lineWidth(1)
     .strokeColor('#000000')
     .moveTo(150, doc.page.height - 120)
     .lineTo(350, doc.page.height - 120)
     .stroke();
  
  doc.fillColor('#1e293b')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('Director de Capacitación', 150, doc.page.height - 110, { width: 200, align: 'center' });
  doc.fontSize(10)
     .font('Helvetica')
     .text('Capacítate PRO Academy', 150, doc.page.height - 95, { width: 200, align: 'center' });

  // Firma simulada (Encima de la línea)
  doc.save()
     .moveTo(180, doc.page.height - 140)
     .bezierCurveTo(220, doc.page.height - 170, 280, doc.page.height - 110, 330, doc.page.height - 145)
     .lineWidth(2)
     .strokeColor('#002b5b')
     .stroke();
  doc.restore();

  // Código QR (Lado derecho)
  // Si el host es localhost, tratamos de obtener la IP de la red local para que el móvil pueda abrirlo
  let finalHost = reqHost;
  if (reqHost.includes('localhost') || reqHost.includes('127.0.0.1')) {
    const os = await import('os');
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        // Ignorar ips internas (127.0.0.1) y buscar IPv4
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }
    // Mantener el puerto original (e.g. 5000) pero con la IP de la red
    const port = reqHost.split(':')[1] || '5000';
    finalHost = `${localIp}:${port}`;
  }

  const protocol = finalHost.includes('localhost') ? 'http' : 'http'; // Forzar http local
  const validationUrl = `${protocol}://${finalHost}/api/certificates/verify/${certificado.codigoValidacion}`;
  const qrImage = await QRCode.toDataURL(validationUrl, {
    color: {
      dark: '#002b5b',
      light: '#ffffff'
    },
    margin: 1
  });

  doc.image(qrImage, doc.page.width - 190, doc.page.height - 190, { fit: [120, 120] });
  
  doc.fillColor('#666666')
     .fontSize(8)
     .text('ESCANEE PARA VALIDAR', doc.page.width - 190, doc.page.height - 65, { width: 120, align: 'center' });
  doc.fontSize(10)
     .fillColor('#002b5b')
     .font('Helvetica-Bold')
     .text(certificado.codigoValidacion, doc.page.width - 190, doc.page.height - 50, { width: 120, align: 'center' });

  doc.end();
};

// @desc    Generar y obtener certificado
// @route   GET /api/certificates/:courseId
// @access  Private
export const generateCertificate = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { courseId, userId: paramUserId } = req.params;
    let userId = req.user?._id;

    // Si es admin y proporciona un userId en la URL, usamos ese
    if (req.user?.rol === 'admin' && paramUserId) {
      userId = paramUserId as any;
    }

    if (!userId) return res.status(401).json({ message: 'Usuario no identificado' });

    const progreso = await Progress.findOne({ usuario: userId, curso: courseId });
    if (!progreso || !progreso.finalExamenPasado) {
      return res.status(403).json({ message: 'Aún no has completado el curso o aprobado el examen final' });
    }

    const curso = await Course.findById(courseId);
    if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });

    let certificado = await Certificate.findOne({ usuario: userId, curso: courseId });

    if (!certificado) {
      const codigoValidacion = crypto.randomBytes(8).toString('hex').toUpperCase();
      certificado = new Certificate({
        usuario: userId,
        curso: courseId,
        codigoValidacion
      });
      await certificado.save();
      const { saveUsersToFile } = await import('../utils/userPersist');
      await saveUsersToFile();
    }

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 0
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificado-${curso.titulo.replace(/ /g, '_')}.pdf`);

    doc.pipe(res);
    const reqHost = req.get('host') || 'localhost:5000';
    
    // Necesitamos los datos del usuario dueño del certificado, no necesariamente los del que hace la petición (admin)
    let ownerUser = req.user;
    if (userId && req.user && userId.toString() !== req.user._id.toString()) {
      ownerUser = await User.findById(userId) as any;
    }

    await drawCertificatePDF(doc, ownerUser, curso, certificado, reqHost);

  } catch (err: any) {
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Error al generar certificado', error: err.message });
    }
  }
};

// @desc    Validar certificado por código (Público)
// @route   GET /api/certificates/verify/:codigo
// @access  Public
export const verifyCertificate = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { codigo } = req.params;

    const certificado = await Certificate.findOne({ codigoValidacion: codigo })
      .populate('usuario')
      .populate('curso');

    if (!certificado) {
      return res.status(404).send(`
        <html>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 50px; background-color: #f1f5f9;">
            <div style="background: white; padding: 40px; border-radius: 12px; max-width: 450px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <h1 style="color: #ef4444; margin-top: 0;">❌ Inválido</h1>
              <p style="color: #64748b; font-size: 1.1em;">El código de verificación no existe o el certificado ha sido revocado.</p>
            </div>
          </body>
        </html>
      `);
    }

    const usuario = certificado.usuario as any;
    const curso = certificado.curso as any;

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 0
    });

    res.setHeader('Content-Type', 'application/pdf');
    // En el QR, es mejor 'inline' para que el navegador móvil lo muestre en lugar de descargarlo forzosamente
    res.setHeader('Content-Disposition', `inline; filename=Certificado-${curso.titulo.replace(/ /g, '_')}.pdf`);

    doc.pipe(res);
    const reqHost = req.get('host') || 'localhost:5000';
    await drawCertificatePDF(doc, usuario, curso, certificado, reqHost);

  } catch (err: any) {
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Error al validar certificado', error: err.message });
    }
  }
};
