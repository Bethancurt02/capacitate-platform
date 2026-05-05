import Course from '../models/Course';
import Lesson from '../models/Lesson';
import Question from '../models/Question';
import User from '../models/User';
import Progress from '../models/Progress';

export const seedData = async () => {
  try {
    // Only seed if the database is empty
    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      console.log(`Database already has ${existingCourses} courses. Skipping seed.`);
      return;
    }

    console.log('Database is empty. Running seed for the first time...');

    const coursesInfo = [
      { 
        titulo: 'Secretaria', cat: 'Administración', img: '/uploads/course_secretaria_1777837999791.png',
        modulos: [
          { t: 'Gestión Administrativa', p: [
            { q: '¿Qué es un organigrama?', o: ['Un tipo de archivo', 'Representación gráfica de la estructura de una empresa', 'Un software'], r: 1 },
            { q: '¿Qué es la comunicación asertiva?', o: ['Hablar fuerte', 'Expresar ideas de forma clara y respetuosa', 'No hablar'], r: 1 },
            { q: 'Función de la agenda:', o: ['Organizar el tiempo y citas', 'Escribir cuentos', 'Dibujar'], r: 0 }
          ]},
          { t: 'Archivo y Documentación', p: [
            { q: '¿Qué es un archivo activo?', o: ['Documentos de uso diario', 'Papeles viejos', 'Basura'], r: 0 },
            { q: 'Orden alfabético de "Carlos" y "Carla":', o: ['Carlos va primero', 'Carla va primero', 'Son iguales'], r: 1 },
            { q: '¿Para qué sirve el foliado?', o: ['Dar brillo', 'Numerar hojas correlativamente', 'Garantizar que no se pierdan'], r: 1 }
          ]},
          { t: 'Atención al Cliente', p: [
            { q: '¿Qué es el lenguaje no verbal?', o: ['Hablar por señas', 'Gestos y posturas corporales', 'Escribir correos'], r: 1 },
            { q: 'Primer paso al contestar el teléfono:', o: ['¿Quién es?', 'Saludo y nombre de la empresa', 'Diga'], r: 1 },
            { q: '¿Qué es la empatía?', o: ['Sentir lástima', 'Ponerse en el lugar del otro', 'Ser amable'], r: 1 }
          ]},
          { t: 'Ofimática Básica', p: [
            { q: '¿Cuál es un dispositivo de entrada?', o: ['Impresora', 'Monitor', 'Teclado'], r: 2 },
            { q: 'Atajo para copiar en Windows:', o: ['Ctrl+V', 'Ctrl+C', 'Ctrl+X'], r: 1 },
            { q: '¿Qué es el hardware?', o: ['Programas', 'Componentes físicos', 'Internet'], r: 1 }
          ]},
          { t: 'Ética Profesional', p: [
            { q: '¿Qué es el secreto profesional?', o: ['Contar secretos', 'Deber de reserva sobre información del cliente', 'Mentir'], r: 1 },
            { q: '¿Qué es la puntualidad?', o: ['Llegar tarde', 'Disciplina de estar a tiempo', 'Llegar cuando uno pueda'], r: 1 },
            { q: '¿Qué es el trabajo en equipo?', o: ['Hacerlo todo uno solo', 'Colaboración para un fin común', 'Competir'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Cómo garantiza la ética la confidencialidad en archivos?', o: ['No afecta', 'Mediante el secreto profesional y manejo seguro', 'Haciendo el proceso más lento'], r: 1 },
          { q: 'En atención al cliente, ante un fallo técnico, ¿qué debe hacer?', o: ['Colgar', 'Mantener la calma y registrar manualmente', 'Gritar'], r: 1 },
          { q: '¿Cuál es la base de una buena comunicación administrativa?', o: ['Tener un buen PC', 'La asertividad y claridad en el mensaje', 'Saber inglés'], r: 1 },
          { q: '¿Qué documento define la jerarquía de la empresa?', o: ['La factura', 'El organigrama', 'El recibo'], r: 1 },
          { q: '¿Para qué sirve el foliado en la documentación?', o: ['Dar brillo', 'Mantener el orden y evitar pérdidas de hojas', 'Para vender papel'], r: 1 }
        ]
      },
      { 
        titulo: 'Informática', cat: 'Tecnología', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
        modulos: [
          { t: 'Hardware y Software', p: [
            { q: '¿Qué es la CPU?', o: ['Monitor', 'Procesador central', 'Memoria USB'], r: 1 },
            { q: '¿Qué es el software de sistema?', o: ['Office', 'Windows/Linux', 'Navegador'], r: 1 },
            { q: '¿Para qué sirve la RAM?', o: ['Guardar fotos', 'Memoria de acceso rápido temporal', 'Enfriar'], r: 1 }
          ]},
          { t: 'Sistemas Operativos', p: [
            { q: '¿Qué es una carpeta?', o: ['Un archivo', 'Contenedor de archivos', 'Un virus'], r: 1 },
            { q: 'Función de la papelera:', o: ['Borrado total', 'Almacén temporal de borrados', 'Crear archivos'], r: 1 },
            { q: '¿Qué es el escritorio?', o: ['Mueble', 'Interfaz principal de usuario', 'Teclado'], r: 1 }
          ]},
          { t: 'Internet y Navegación', p: [
            { q: '¿Qué es una URL?', o: ['Un correo', 'Dirección de un recurso en la web', 'Un buscador'], r: 1 },
            { q: '¿Modo Incógnito?', o: ['Ser invisible', 'No guardar historial localmente', 'Hackear'], r: 1 },
            { q: '¿Qué es Wi-Fi?', o: ['Internet por cable', 'Conexión inalámbrica', 'Satélite'], r: 1 }
          ]},
          { t: 'Seguridad Digital', p: [
            { q: '¿Qué es Phishing?', o: ['Pescar', 'Estafa para robar datos', 'Juego'], r: 1 },
            { q: '¿Para qué sirve un Firewall?', o: ['Fuego', 'Controlar tráfico de red', 'Velocidad'], r: 1 },
            { q: '¿Qué es Malware?', o: ['Bueno', 'Software malicioso', 'Mouse'], r: 1 }
          ]},
          { t: 'Ofimática (Word/Excel)', p: [
            { q: '¿Celda en Excel?', o: ['Cuarto', 'Intersección fila/columna', 'Botón'], r: 1 },
            { q: '¿PowerPoint?', o: ['Tablas', 'Presentaciones visuales', 'Libros'], r: 1 },
            { q: '¿Sangría en Word?', o: ['Bebida', 'Espacio entre margen y texto', 'Error'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Cómo interactúan el hardware y el software?', o: ['No se necesitan', 'El hardware ejecuta las órdenes del software', 'Son lo mismo'], r: 1 },
          { q: '¿Cuál es la función principal de un Sistema Operativo?', o: ['Dibujar', 'Gestionar recursos de hardware y aplicaciones', 'Ver videos'], r: 1 },
          { q: '¿Qué es la nube (Cloud Computing)?', o: ['Algo que llueve', 'Servicios de computación por internet', 'Disco duro físico'], r: 1 },
          { q: '¿Qué mide los Gigabytes?', o: ['Peso', 'Capacidad de almacenamiento', 'Velocidad'], r: 1 },
          { q: 'En Excel, ¿qué es lo más importante para cálculos?', o: ['El color', 'Las fórmulas y funciones', 'El tamaño de letra'], r: 1 }
        ]
      },
      { 
        titulo: 'Estilista', cat: 'Belleza', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800',
        modulos: [
          { t: 'Corte de Cabello', p: [
            { q: '¿Qué es el ángulo de proyección?', o: ['La luz', 'La elevación del cabello al cortar', 'El precio'], r: 1 },
            { q: 'Herramienta para degrafilado:', o: ['Peine', 'Tijera de entresacar', 'Plancha'], r: 1 },
            { q: '¿Qué es un corte bob?', o: ['Corte largo', 'Corte a la altura de la mandíbula', 'Corte rapado'], r: 1 }
          ]},
          { t: 'Colorimetría Básica', p: [
            { q: '¿Qué son los colores primarios?', o: ['Verde, naranja, violeta', 'Azul, rojo, amarillo', 'Blanco y negro'], r: 1 },
            { q: '¿Para qué sirve el peróxido?', o: ['Limpiar', 'Revelar el color en el tinte', 'Fijar el peinado'], r: 1 },
            { q: '¿Qué es el matizado?', o: ['Cortar puntas', 'Corregir reflejos no deseados', 'Lavar el cabello'], r: 1 }
          ]},
          { t: 'Tratamientos Capilares', p: [
            { q: '¿Qué es la keratina?', o: ['Un champú', 'Proteína natural del cabello', 'Un tinte'], r: 1 },
            { q: '¿Para qué sirve el acondicionador?', o: ['Abrir cutícula', 'Sellar cutícula y desenredar', 'Limpiar'], r: 1 },
            { q: '¿Qué es un baño de crema?', o: ['Un postre', 'Hidratación profunda del cabello', 'Lavar'], r: 1 }
          ]},
          { t: 'Peinados y Estilo', p: [
            { q: '¿Qué es el cardado?', o: ['Cortar', 'Dar volumen cepillando hacia la raíz', 'Planchar'], r: 1 },
            { q: '¿Para qué se usa el fijador?', o: ['Lavar', 'Mantener el peinado en su sitio', 'Brillo'], r: 1 },
            { q: '¿Qué es un recogido?', o: ['Cabello suelto', 'Peinado donde el cabello queda hacia arriba o atrás', 'Trenza'], r: 1 }
          ]},
          { t: 'Higiene en el Salón', p: [
            { q: '¿Qué es la sanitización?', o: ['Limpiar con agua', 'Reducir patógenos en superficies', 'Pintar'], r: 1 },
            { q: '¿Cómo limpiar las tijeras?', o: ['Soplar', 'Desinfectar con alcohol o esterilizador', 'No se limpian'], r: 1 },
            { q: 'Uso de la capa:', o: ['Moda', 'Protección del cliente', 'Abrigo'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Por qué es vital la proyección en un corte?', o: ['Para tardar menos', 'Para determinar la forma y longitud final', 'No es vital'], r: 1 },
          { q: '¿Cuál es el resultado de mezclar azul y amarillo?', o: ['Naranja', 'Verde', 'Violeta'], r: 1 },
          { q: '¿Cuándo se debe aplicar un tratamiento reconstructor?', o: ['Siempre', 'En cabellos químicamente procesados o dañados', 'Nunca'], r: 1 },
          { q: '¿Qué producto protege el cabello del calor?', o: ['Laca', 'Termoprotector', 'Gel'], r: 1 },
          { q: 'Norma principal ante un hongo en el cuero cabelludo:', o: ['Cortar igual', 'Remitir al dermatólogo y no realizar servicio', 'Aplicar tinte'], r: 1 }
        ]
      },
      { 
        titulo: 'Cajero', cat: 'Comercio', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
        modulos: [
          { t: 'Manejo de Efectivo', p: [
            { q: '¿Qué es el fondo de caja?', o: ['Dinero ganado', 'Cambio inicial para el turno', 'Deuda'], r: 1 },
            { q: '¿Cómo detectar un billete falso?', o: ['Olerlo', 'Revisar marca de agua y texturas', 'Mirar el color'], r: 1 },
            { q: '¿Qué es el arqueo de caja?', o: ['Cerrar la tienda', 'Verificar que el dinero físico coincida con el sistema', 'Limpiar'], r: 1 }
          ]},
          { t: 'Sistemas de Cobro', p: [
            { q: '¿Qué es un punto de venta (POS)?', o: ['Una mesa', 'Terminal para procesar pagos con tarjeta', 'Un estante'], r: 1 },
            { q: '¿Para qué sirve el escáner?', o: ['Tomar fotos', 'Leer códigos de barras de productos', 'Imprimir'], r: 1 },
            { q: '¿Qué es una devolución?', o: ['Regalo', 'Retorno de producto y dinero al cliente', 'Venta'], r: 1 }
          ]},
          { t: 'Atención al Cliente', p: [
            { q: '¿Qué es la venta sugestiva?', o: ['Obligar a comprar', 'Sugerir productos adicionales al cliente', 'Mentir'], r: 1 },
            { q: 'Importancia de la sonrisa:', o: ['Cansa', 'Genera confianza y amabilidad', 'No importa'], r: 1 },
            { q: '¿Cómo manejar una fila larga?', o: ['Gritar', 'Trabajar con agilidad y cortesía', 'Irse a descanso'], r: 1 }
          ]},
          { t: 'Prevención de Pérdidas', p: [
            { q: '¿Qué es el "robo hormiga"?', o: ['Robo de insectos', 'Sustracción de pequeñas cantidades de mercancía', 'Un juego'], r: 1 },
            { q: '¿Para qué sirve el ticket de compra?', o: ['Basura', 'Comprobante legal y de inventario', 'Dibujar'], r: 1 },
            { q: 'Función de las cámaras:', o: ['Ver películas', 'Seguridad y monitoreo', 'Decoración'], r: 1 }
          ]},
          { t: 'Cierre de Turno', p: [
            { q: '¿Qué es el sobrante?', o: ['Falta dinero', 'Hay más dinero del que indica el sistema', 'Está bien'], r: 1 },
            { q: '¿A quién se entrega el corte?', o: ['Al cliente', 'Al supervisor o gerente', 'Se deja ahí'], r: 1 },
            { q: '¿Qué hacer con los cupones?', o: ['Tirarlos', 'Contabilizarlos y entregarlos con el reporte', 'Regalarlos'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Cuál es la prioridad en el manejo de efectivo?', o: ['Rapidez', 'Precisión y seguridad', 'El orden'], r: 1 },
          { q: 'Si el POS falla, ¿qué debe hacer?', o: ['No cobrar', 'Informar al cliente y buscar alternativa (efectivo/reporte)', 'Llorar'], r: 1 },
          { q: '¿Qué define un buen servicio al cliente en caja?', o: ['No hablar', 'Rapidez, amabilidad y exactitud', 'Ser lento'], r: 1 },
          { q: '¿Cómo actuar ante un billete dudoso?', o: ['Aceptarlo igual', 'Informar cortésmente y solicitar otro pago', 'Llamar a la policía'], r: 1 },
          { q: '¿Qué indica un descuadre constante?', o: ['Buena suerte', 'Falla en el procedimiento o posible robo', 'Falta de clientes'], r: 1 }
        ]
      },
      { 
        titulo: 'Uñas', cat: 'Belleza', img: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800',
        modulos: [
          { t: 'Manicura Básica', p: [
            { q: '¿Para qué sirve el empujador de cutícula?', o: ['Cortar', 'Retirar la piel muerta de la uña', 'Pintar'], r: 1 },
            { q: '¿Qué es el limado?', o: ['Pintar', 'Dar forma al borde libre de la uña', 'Lavar'], r: 1 },
            { q: 'Uso de la base coat:', o: ['Brillo final', 'Proteger la uña natural del pigmento', 'Limpiar'], r: 1 }
          ]},
          { t: 'Uñas Acrílicas', p: [
            { q: '¿Qué es el monómero?', o: ['Polvo', 'Líquido reactivo para el acrílico', 'Limpiador'], r: 1 },
            { q: '¿Para qué sirve el polímero?', o: ['Líquido', 'Polvo que forma la uña acrílica', 'Pegamento'], r: 1 },
            { q: '¿Qué es el tip?', o: ['Consejo', 'Extensión de plástico para la uña', 'Pincel'], r: 1 }
          ]},
          { t: 'Esmaltado Semipermanente', p: [
            { q: '¿Para qué se usa la lámpara UV/LED?', o: ['Dar luz', 'Curar o secar el esmalte en gel', 'Calentar manos'], r: 1 },
            { q: '¿Qué es la capa de inhibición?', o: ['Un color', 'Capa pegajosa que queda tras el secado', 'Un error'], r: 1 },
            { q: '¿Cómo se retira el gel?', o: ['Arrancándolo', 'Con acetona pura o limado suave', 'Con agua'], r: 1 }
          ]},
          { t: 'Decoración (Nail Art)', p: [
            { q: '¿Qué es el dotting tool?', o: ['Pincel largo', 'Herramienta para hacer puntos', 'Lima'], r: 1 },
            { q: '¿Qué es el efecto espejo?', o: ['Ver la cara', 'Polvo pigmentado que da brillo metálico', 'Una pegatina'], r: 1 },
            { q: '¿Para qué sirve el pincel liner?', o: ['Rellenar', 'Hacer trazos finos y detalles', 'Limpiar'], r: 1 }
          ]},
          { t: 'Esterilización y Enfermedades', p: [
            { q: '¿Qué es la onicomicosis?', o: ['Uña rota', 'Hongos en las uñas', 'Color amarillo'], r: 1 },
            { q: '¿Para qué sirve el autoclave?', o: ['Pintar', 'Esterilización por calor y presión', 'Lavar manos'], r: 1 },
            { q: '¿Qué hacer ante una herida?', o: ['Seguir trabajando', 'Detener, desinfectar y proteger', 'Soplar'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Cuál es el orden correcto del esmaltado?', o: ['Color, Base, Top', 'Base, Color, Top', 'Top, Color, Base'], r: 1 },
          { q: '¿Qué sucede si el acrílico toca la piel?', o: ['Nada', 'Puede causar levantamiento prematuro o alergias', 'Se ve mejor'], r: 1 },
          { q: '¿Cuánto tiempo suele curar un gel en LED?', o: ['10 minutos', '30 a 60 segundos', '1 hora'], r: 1 },
          { q: '¿Qué herramienta es fundamental para el diseño a mano alzada?', o: ['Lima', 'Pincel liner', 'Alicate'], r: 1 },
          { q: '¿Por qué no se debe usar la misma lima en varios clientes?', o: ['Se gasta', 'Por higiene y evitar contagio de infecciones', 'Es mala suerte'], r: 1 }
        ]
      },
      { 
        titulo: 'Farmacia', cat: 'Salud', img: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800',
        modulos: [
          { t: 'Farmacología Básica', p: [
            { q: '¿Qué es un principio activo?', o: ['El nombre de la farmacia', 'Sustancia responsable del efecto terapéutico', 'El envase'], r: 1 },
            { q: '¿Qué es un medicamento genérico?', o: ['Uno falso', 'Mismo principio activo que el de marca pero sin patente', 'Uno más débil'], r: 1 },
            { q: 'Vía de administración oral:', o: ['Inyección', 'Cápsulas, tabletas, jarabes por la boca', 'Parches'], r: 1 }
          ]},
          { t: 'Dispensación de Recetas', p: [
            { q: '¿Qué debe revisar en una receta?', o: ['El papel', 'Nombre, dosis, firma y fecha', 'El precio'], r: 1 },
            { q: '¿Qué significa "antibiótico"?', o: ['Para el dolor', 'Para combatir infecciones bacterianas', 'Para la tos'], r: 1 },
            { q: '¿Qué es el consejo farmacéutico?', o: ['Vender más', 'Orientar al paciente sobre el uso del fármaco', 'Recetar'], r: 1 }
          ]},
          { t: 'Almacenamiento y Control', p: [
            { q: '¿Qué es la cadena de frío?', o: ['Hielo', 'Mantenimiento de temperatura (2-8°C) para vacunas/insulinas', 'Aire acondicionado'], r: 1 },
            { q: '¿Qué es el sistema FEFO?', o: ['Primero que entra, primero que sale', 'Lo primero que vence es lo primero que sale', 'Vender lo más caro'], r: 1 },
            { q: '¿Para qué sirve el registro de temperatura?', o: ['Perder tiempo', 'Asegurar la estabilidad de los medicamentos', 'Adorno'], r: 1 }
          ]},
          { t: 'Normativa Legal', p: [
            { q: '¿Qué es un medicamento controlado?', o: ['Medicamento de venta libre', 'Requiere receta especial por riesgo de dependencia', 'Medicamento caro'], r: 1 },
            { q: '¿Qué es el libro de control?', o: ['Diario personal', 'Registro oficial de entradas y salidas de controlados', 'Catálogo'], r: 1 },
            { q: '¿Qué es the farmacovigilancia?', o: ['Vigilar la farmacia', 'Detección y reporte de efectos adversos de fármacos', 'Cámaras'], r: 1 }
          ]},
          { t: 'Primeros Auxilios', p: [
            { q: '¿Qué es un botiquín?', o: ['Una maleta', 'Conjunto de elementos para atención primaria', 'Caja de herramientas'], r: 1 },
            { q: '¿Cómo actuar ante una quemadura leve?', o: ['Aplicar pasta dental', 'Lavar con agua fría corriente', 'Explotar ampollas'], r: 1 },
            { q: '¿Qué es el RCP?', o: ['Un examen', 'Reanimación Cardio Pulmonar', 'Una vitamina'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Cuál es la diferencia entre marca y genérico?', o: ['El efecto', 'Solo el nombre comercial y el precio', 'La calidad'], r: 1 },
          { q: '¿Por qué no se debe vender antibióticos sin receta?', o: ['Es más caro', 'Para evitar la resistencia bacteriana', 'No hay stock'], r: 1 },
          { q: '¿Qué indica una fecha de vencimiento próxima?', o: ['Oferta', 'Retirar del anaquel para devolución o desecho', 'Vender rápido'], r: 1 },
          { q: '¿Qué documento avala la venta de un psicotrópico?', o: ['DNI', 'Receta médica archivada', 'Factura'], r: 1 },
          { q: 'Ante una reacción alérgica grave, ¿qué es lo primero?', o: ['Dar agua', 'Llamar a emergencias y buscar ayuda médica', 'Dar un dulce'], r: 1 }
        ]
      },
      { 
        titulo: 'Barbería', cat: 'Belleza', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800',
        modulos: [
          { t: 'Herramientas del Barbero', p: [
            { q: '¿Qué es una Clipper?', o: ['Tijera', 'Máquina de corte eléctrica', 'Navaja'], r: 1 },
            { q: '¿Para qué sirve el Shavette?', o: ['Peine', 'Navaja de afeitar de hojas intercambiables', 'Cepillo'], r: 1 },
            { q: 'Uso del bledo:', o: ['Cortar', 'Limpiar los pelos sueltos del cliente', 'Lavar'], r: 1 }
          ]},
          { t: 'Técnicas de Degradado (Fade)', p: [
            { q: '¿Qué es un Skin Fade?', o: ['Corte largo', 'Degradado que empieza desde la piel (cero)', 'Corte con tijera'], r: 1 },
            { q: '¿Para qué sirve la palanca de la máquina?', o: ['Apagar', 'Ajustar la longitud de la cuchilla', 'Velocidad'], r: 1 },
            { q: '¿Qué es la técnica "C-Stroke"?', o: ['Un golpe', 'Movimiento en forma de C para borrar líneas', 'Cortar recto'], r: 1 }
          ]},
          { t: 'Afeitado y Barba', p: [
            { q: '¿Para qué sirve la toalla caliente?', o: ['Secar', 'Abrir poros y ablandar el vello facial', 'Limpiar'], r: 1 },
            { q: '¿Qué es el After Shave?', o: ['Jabón', 'Loción para calmar la piel tras el afeitado', 'Aceite'], r: 1 },
            { q: 'Dirección del afeitado:', o: ['Hacia arriba', 'A favor del crecimiento del vello', 'Como sea'], r: 1 }
          ]},
          { t: 'Diseño y Perfilado', p: [
            { q: '¿Qué es el "lining"?', o: ['Cortar', 'Marcar los contornos y líneas del cabello', 'Pintar'], r: 1 },
            { q: '¿Para qué sirve el lápiz de barbero?', o: ['Escribir', 'Resaltar el diseño y contornos', 'Dibujar'], r: 1 },
            { q: '¿Qué es un pompadour?', o: ['Un peine', 'Peinado con volumen en la parte frontal', 'Rapado'], r: 1 }
          ]},
          { t: 'Bioseguridad', p: [
            { q: '¿Qué es el Barbicide?', o: ['Un tinte', 'Solución desinfectante para herramientas', 'Champú'], r: 1 },
            { q: '¿Cada cuánto cambiar la navaja?', o: ['Cada mes', 'Después de cada cliente', 'Cuando no corte'], r: 1 },
            { q: 'Importancia del talco:', o: ['Olor', 'Evitar irritación y facilitar limpieza', 'Moda'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Cuál es la herramienta principal para un degradado?', o: ['Navaja', 'Clipper con diferentes niveles', 'Tijera'], r: 1 },
          { q: '¿Cómo se borra la línea de la guía?', o: ['Cortando más', 'Usando la técnica de palanca abierta/cerrada', 'Lavando'], r: 1 },
          { q: 'Paso previo al afeitado con navaja:', o: ['Cortar con tijera', 'Aplicar gel de afeitar o espuma', 'No hacer nada'], r: 1 },
          { q: '¿Qué define un buen perfilado?', o: ['La rapidez', 'La simetría y limpieza de las líneas', 'El precio'], r: 1 },
          { q: '¿Por qué desinfectar las máquinas?', o: ['Para que brillen', 'Para prevenir transmisión de bacterias y hongos', 'Por ley'], r: 1 }
        ]
      },
      { 
        titulo: 'Enfermería', cat: 'Salud', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800',
        modulos: [
          { t: 'Signos Vitales', p: [
            { q: 'Presión arterial normal (adulto):', o: ['150/90', '120/80 mmHg', '100/60'], r: 1 },
            { q: '¿Dónde se mide el pulso radial?', o: ['En el cuello', 'En la muñeca', 'En el pie'], r: 1 },
            { q: 'Frecuencia respiratoria normal:', o: ['5-10 rpm', '12-20 respiraciones por minuto', '30-40 rpm'], r: 1 }
          ]},
          { t: 'Higiene y Confort', p: [
            { q: '¿Qué es el baño en cama?', o: ['Nadar', 'Aseo total del paciente con movilidad limitada', 'Lavar la sábana'], r: 1 },
            { q: '¿Para qué sirve el cambio de posición?', o: ['Cansar al paciente', 'Prevenir úlceras por presión', 'Por orden'], r: 1 },
            { q: '¿Qué es la asepsia?', o: ['Estar sucio', 'Ausencia de microorganismos patógenos', 'Pintar'], r: 1 }
          ]},
          { t: 'Administración de Medicamentos', p: [
            { q: 'Regla de los "5 correctos":', o: ['Paciente, fármaco, dosis, vía, hora', 'Rapidez, color, forma, caja, precio', 'Nombre, apellido, edad, sexo, peso'], r: 0 },
            { q: '¿Qué es la vía intravenosa?', o: ['Por la boca', 'Directamente al torrente sanguíneo por vena', 'En el músculo'], r: 1 },
            { q: '¿Para qué sirve el kárdex?', o: ['Agenda personal', 'Registro de medicación del paciente', 'Un libro'], r: 1 }
          ]},
          { t: 'Curación de Heridas', p: [
            { q: '¿Qué es una herida limpia?', o: ['Una con jabón', 'Herida quirúrgica no infectada', 'Un raspón'], r: 1 },
            { q: 'Uso de solución salina:', o: ['Beber', 'Lavado y limpieza de tejidos', 'Pegar'], r: 1 },
            { q: '¿Qué es un apósito?', o: ['Una pastilla', 'Material de cobertura para heridas', 'Una crema'], r: 1 }
          ]},
          { t: 'Ética en Enfermería', p: [
            { q: '¿Qué es la autonomía?', o: ['Hacer todo solo', 'Respeto a las decisiones del paciente', 'Poder'], r: 1 },
            { q: 'Confidencialidad:', o: ['Contar todo', 'No revelar datos del paciente sin autorización', 'Mentir'], r: 1 },
            { q: '¿Qué es la empatía?', o: ['Lástima', 'Comprender y compartir los sentimientos del otro', 'Ser serio'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Qué indica una fiebre (38.5°C)?', o: ['Salud', 'Posible proceso infeccioso o inflamatorio', 'Frío'], r: 1 },
          { q: '¿Cuál es el primer paso antes de cualquier procedimiento?', o: ['Hablar con el jefe', 'Lavado de manos clínico', 'Preparar el café'], r: 1 },
          { q: 'Si un paciente es alérgico, ¿qué debe hacer?', o: ['Dar el fármaco lento', 'Marcar la historia clínica y no administrarlo', 'Ignorarlo'], r: 1 },
          { q: '¿Cómo prevenir caídas en el hospital?', o: ['Atar al paciente', 'Mantener barandales arriba y suelo seco', 'No dejar que camine'], r: 1 },
          { q: '¿Qué define la negligencia?', o: ['Hacerlo bien', 'Falta de cuidado o abandono de deberes profesionales', 'Ser rápido'], r: 1 }
        ]
      },
      { 
        titulo: 'Inglés', cat: 'Idiomas', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
        modulos: [
          { t: 'Greetings and Basics', p: [
            { q: 'How do you say "Hello"?', o: ['Bye', 'Hello', 'Please'], r: 1 },
            { q: 'Which is a color?', o: ['Book', 'Blue', 'Run'], r: 1 },
            { q: 'Translate: "Thank you"', o: ['Sorry', 'Thank you', 'Welcome'], r: 1 }
          ]},
          { t: 'Verb To Be', p: [
            { q: 'I ____ a student.', o: ['is', 'am', 'are'], r: 1 },
            { q: 'She ____ happy.', o: ['am', 'is', 'are'], r: 1 },
            { q: 'They ____ at home.', o: ['am', 'is', 'are'], r: 2 }
          ]},
          { t: 'Numbers and Time', p: [
            { q: 'What is 10 + 5?', o: ['Ten', 'Fifteen', 'Twelve'], r: 1 },
            { q: 'How do you ask the time?', o: ['What time is it?', 'Where are you?', 'Who is he?'], r: 0 },
            { q: 'Translate: "Monday"', o: ['Tuesday', 'Monday', 'Friday'], r: 1 }
          ]},
          { t: 'Common Verbs', p: [
            { q: 'Translate: "To Eat"', o: ['Sleep', 'Eat', 'Work'], r: 1 },
            { q: 'I ____ water every day.', o: ['eat', 'drink', 'see'], r: 1 },
            { q: 'They ____ soccer.', o: ['play', 'read', 'listen'], r: 0 }
          ]},
          { t: 'Simple Conversations', p: [
            { q: 'How are you?', o: ['I am fine', 'Yes', 'No'], r: 0 },
            { q: 'What is your name?', o: ['I am 20', 'My name is John', 'I live here'], r: 1 },
            { q: 'Where are you from?', o: ['I am tall', 'I am from Mexico', 'I like music'], r: 1 }
          ]}
        ],
        examen: [
          { q: 'Which is a proper greeting?', o: ['Good morning', 'Red', 'Laptop'], r: 0 },
          { q: 'Complete: "You ____ my friend."', o: ['am', 'are', 'is'], r: 1 },
          { q: 'How do you say "Twelve" in English?', o: ['Ten', 'Twelve', 'Twenty'], r: 1 },
          { q: 'Translate: "I want to eat."', o: ['Quiero dormir', 'Quiero comer', 'Quiero agua'], r: 1 },
          { q: 'What is the answer to "Nice to meet you"?', o: ['Hello', 'Nice to meet you too', 'Goodbye'], r: 1 }
        ]
      },
      { 
        titulo: 'Celulares', cat: 'Tecnología', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
        modulos: [
          { t: 'Componentes de un Smartphone', p: [
            { q: '¿Qué es el display?', o: ['La batería', 'La pantalla que muestra imagen', 'El procesador'], r: 1 },
            { q: '¿Para qué sirve el Flex?', o: ['Cargar', 'Cables planos que conectan componentes', 'Protección'], r: 1 },
            { q: '¿Qué es la batería Li-Ion?', o: ['Un chip', 'Batería de iones de litio recargable', 'El cristal'], r: 1 }
          ]},
          { t: 'Herramientas de Reparación', p: [
            { q: '¿Para qué sirve el multímetro?', o: ['Pintar', 'Medir voltajes y continuidad eléctrica', 'Soldar'], r: 1 },
            { q: '¿Qué es la estación de calor?', o: ['Ventilador', 'Herramienta para desoldar y remover pantallas', 'Estufa'], r: 1 },
            { q: 'Uso de la ventosa:', o: ['Limpiar', 'Levantar pantallas con succión', 'Pegar'], r: 1 }
          ]},
          { t: 'Software y Flasheo', p: [
            { q: '¿Qué es el Android?', o: ['Una marca', 'Sistema operativo móvil', 'Un hardware'], r: 1 },
            { q: '¿Qué es el Hard Reset?', o: ['Apagar', 'Restablecimiento de fábrica mediante botones', 'Limpiar pantalla'], r: 1 },
            { q: '¿Para qué sirve el IMEI?', o: ['Llamar', 'Identificador único del equipo móvil', 'Navegar'], r: 1 }
          ]},
          { t: 'Fallas Comunes', p: [
            { q: '¿Por qué no carga un celular?', o: ['Falta de luz', 'Pin de carga sucio o dañado', 'Pantalla rota'], r: 1 },
            { q: 'Celular mojado, primer paso:', o: ['Encenderlo', 'Retirar batería (si es posible) y no encender', 'Cargarlo'], r: 1 },
            { q: '¿Qué es el Bootloop?', o: ['Un juego', 'Reinicio constante en el logo', 'Pantalla azul'], r: 1 }
          ]},
          { t: 'Cambio de Pantallas', p: [
            { q: '¿Qué es el pegamento B7000?', o: ['Champú', 'Adhesivo especial para pantallas y marcos', 'Pintura'], r: 1 },
            { q: '¿Para qué sirve el isopropílico?', o: ['Beber', 'Limpieza de circuitos y residuos de pegamento', 'Soldar'], r: 1 },
            { q: '¿Qué es un cristal templado?', o: ['Un vaso', 'Protección extra para la pantalla', 'Un espejo'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Cuál es el cerebro del celular?', o: ['La batería', 'El procesador (SoC)', 'La cámara'], r: 1 },
          { q: '¿Cómo verificar si un componente tiene corto?', o: ['Mirándolo', 'Usando el multímetro en modo continuidad', 'Probando otro'], r: 1 },
          { q: '¿Qué riesgo hay al abrir un celular con calor?', o: ['Ninguno', 'Dañar componentes internos o la pantalla', 'Que se apague'], r: 1 },
          { q: '¿Qué indica un IMEI reportado?', o: ['Buena señal', 'Equipo bloqueado por robo o pérdida', 'Falta saldo'], r: 1 },
          { q: 'Paso final tras cambiar una pantalla:', o: ['Cobrar', 'Probar táctil, imagen y brillo antes de entregar', 'Limpiar por fuera'], r: 1 }
        ]
      },
      { 
        titulo: 'Maquillaje', cat: 'Belleza', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800',
        modulos: [
          { t: 'Preparación de la Piel', p: [
            { q: '¿Qué es el primer?', o: ['Un tinte', 'Pre-base para preparar y alisar la piel', 'Sombra'], r: 1 },
            { q: '¿Para qué sirve el hidratante?', o: ['Para que brille', 'Mantener el agua en la piel y evitar parches', 'Limpiar'], r: 1 },
            { q: '¿Qué es el agua micelar?', o: ['Bebida', 'Limpiador que atrae suciedad y grasa', 'Perfume'], r: 1 }
          ]},
          { t: 'Bases y Correctores', p: [
            { q: '¿Cómo elegir el tono de base?', o: ['En la mano', 'Probando en la mandíbula o cuello', 'Mirando la caja'], r: 1 },
            { q: '¿Para qué sirve el corrector verde?', o: ['Dar color', 'Neutralizar rojeces e imperfecciones rojas', 'Ojeras'], r: 1 },
            { q: '¿Qué es la técnica "Baking"?', o: ['Cocinar', 'Sellar con polvo translúcido por unos minutos', 'Difuminar'], r: 1 }
          ]},
          { t: 'Ojos y Cejas', p: [
            { q: '¿Qué es el degradado en sombras?', o: ['Un solo color', 'Transición suave entre varios colores', 'Pintar fuerte'], r: 1 },
            { q: '¿Para qué sirve el delineador?', o: ['Pestañas', 'Resaltar y definir la forma del ojo', 'Cejas'], r: 1 },
            { q: '¿Qué es el "cut crease"?', o: ['Un corte', 'Técnica de marcar el pliegue del párpado', 'Lavar'], r: 1 }
          ]},
          { t: 'Contorno e Iluminación', p: [
            { q: '¿Qué es el contouring?', o: ['Brillo', 'Uso de sombras oscuras para definir facciones', 'Ponerse blanco'], r: 1 },
            { q: '¿Dónde se aplica el iluminador?', o: ['En todo el rostro', 'En puntos altos como pómulos y nariz', 'Bajo la barbilla'], r: 1 },
            { q: '¿Para qué sirve el rubor?', o: ['Ojeras', 'Dar un aspecto saludable y color a las mejillas', 'Labios'], r: 1 }
          ]},
          { t: 'Sellado y Labios', p: [
            { q: '¿Para qué sirve el setting spray?', o: ['Lavar', 'Fijar el maquillaje para que dure más', 'Brillo'], r: 1 },
            { q: '¿Qué es un labial mate?', o: ['Con brillo', 'Acabado sin brillo y larga duración', 'Transparente'], r: 1 },
            { q: 'Uso del delineador de labios:', o: ['Dibujar', 'Evitar que el labial se corra y definir', 'Pintar ojos'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Por qué es vital la limpieza de la piel antes?', o: ['Para gastar producto', 'Para que el maquillaje se adhiera y luzca mejor', 'No es vital'], r: 1 },
          { q: '¿Qué color neutraliza las ojeras moradas?', o: ['Verde', 'Naranja o melocotón', 'Azul'], r: 1 },
          { q: '¿Qué brocha se usa para difuminar sombras?', o: ['Plana', 'De pelo suelto y redondeada', 'Abanico'], r: 1 },
          { q: '¿Cuál es el objetivo del iluminador?', o: ['Tapar granos', 'Atraer luz a ciertas zonas del rostro', 'Oscurecer'], r: 1 },
          { q: '¿Cómo evitar que el maquillaje se cuartee?', o: ['Poniendo mucho', 'Buena hidratación y sellado adecuado', 'No mojarlo'], r: 1 }
        ]
      },
      { 
        titulo: 'Cejas', cat: 'Belleza', img: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800',
        modulos: [
          { t: 'Morfología del Rostro', p: [
            { q: '¿Qué es el visagismo?', o: ['Un tinte', 'Estudio de las proporciones del rostro', 'Cortar pelos'], r: 1 },
            { q: '¿Dónde debe empezar la ceja?', o: ['En la oreja', 'Alineada con la aleta de la nariz', 'En el centro'], r: 1 },
            { q: '¿Qué define el punto más alto?', o: ['El ojo', 'El arco de la ceja según la pupila', 'La frente'], r: 1 }
          ]},
          { t: 'Depilación y Perfilado', p: [
            { q: '¿Para qué sirve la pinza?', o: ['Pintar', 'Extraer el vello de raíz uno a uno', 'Peinar'], r: 1 },
            { q: '¿Qué es la depilación con hilo?', o: ['Coser', 'Técnica hindú usando hilo de algodón', 'Pegar'], r: 1 },
            { q: 'Uso de la cera:', o: ['Brillo', 'Retirar vello de zonas más amplias rápido', 'Lavar'], r: 1 }
          ]},
          { t: 'Tinte y Henna', p: [
            { q: '¿Qué es la henna para cejas?', o: ['Un tinte permanente', 'Pigmento natural que sombrea piel y vello', 'Maquillaje'], r: 1 },
            { q: 'Duración de la henna:', o: ['Un año', 'De 7 a 15 días aproximadamente', 'Para siempre'], r: 1 },
            { q: '¿Para qué sirve la prueba de alergia?', o: ['Perder tiempo', 'Evitar reacciones adversas en el cliente', 'Ver el color'], r: 1 }
          ]},
          { t: 'Laminado de Cejas', p: [
            { q: '¿Qué es el laminado?', o: ['Cortarlas', 'Técnica para dar dirección y volumen al vello', 'Pintarlas'], r: 1 },
            { q: '¿Para qué sirve el neutralizante?', o: ['Lavar', 'Fijar la nueva forma del vello', 'Dar color'], r: 1 },
            { q: 'Cuidado post-laminado (24h):', o: ['Maquillar', 'No mojar las cejas', 'Hacer ejercicio'], r: 1 }
          ]},
          { t: 'Diseño de Cejas (Mapping)', p: [
            { q: '¿Qué es el hilo marcador?', o: ['Para coser', 'Hilo impregnado de color para marcar líneas', 'Un metro'], r: 1 },
            { q: 'Importancia de la simetría:', o: ['No importa', 'Lograr armonía entre ambas cejas', 'Se ve feo'], r: 1 },
            { q: '¿Qué es el microblading (teoría)?', o: ['Maquillaje', 'Técnica de tatuaje semipermanente pelo a pelo', 'Una crema'], r: 1 }
          ]}
        ],
        examen: [
          { q: '¿Cuál es la clave de un buen diseño de cejas?', o: ['Hacerlas muy gruesas', 'Respetar la forma natural y morfología', 'Hacerlas negras'], r: 1 },
          { q: 'Dirección al extraer el vello con pinza:', o: ['En contra', 'A favor del crecimiento del vello', 'Como sea'], r: 1 },
          { q: '¿Qué hacer si la henna queda muy oscura?', o: ['Llorar', 'Aclarar con champú o removedor especial', 'No hacer nada'], r: 1 },
          { q: '¿Qué producto nutre las cejas tras un proceso químico?', o: ['Agua', 'Aceite de ricino o sérum nutritivo', 'Alcohol'], r: 1 },
          { q: '¿Por qué es vital el mapeo?', o: ['Para tardar más', 'Para asegurar medidas precisas y simetría', 'Para fotos'], r: 1 }
        ]
      }
    ];

    for (const info of coursesInfo) {
      console.log(`Seeding course: ${info.titulo}`);
      const videoMap: Record<string, string> = {
        'Secretaria': 'https://www.youtube.com/embed/egqcVcjeL38',
        'Informática': 'https://www.youtube.com/embed/m8jS0i8n9z4',
        'Estilista': 'https://www.youtube.com/embed/4B6O8ONWJJs',
        'Cajero': 'https://www.youtube.com/embed/cAMGSEWTZ9Y',
        'Uñas': 'https://www.youtube.com/embed/KW7KjDQYa5g',
        'Farmacia': 'https://www.youtube.com/embed/jIs2qgAhxSI',
        'Barbería': 'https://www.youtube.com/embed/sA-WJGgxYsc',
        'Enfermería': 'https://www.youtube.com/embed/eTyOS343c8s',
        'Inglés': 'https://www.youtube.com/embed/l0Xtt9WpHVY',
        'Celulares': 'https://www.youtube.com/embed/51HubHTj-xk',
        'Maquillaje': 'https://www.youtube.com/embed/hNFCxTbrmEs',
        'Cejas': 'https://www.youtube.com/embed/SxOf1GPvVjQ'
      };
      const course = await Course.create({
        titulo: `Curso de ${info.titulo}`,
        descripcion: `Conviértete en un experto ${info.titulo.toLowerCase()} con nuestro programa profesional de 5 módulos.`,
        categoria: info.cat,
        imagen: info.img,
        videoIntro: videoMap[info.titulo] || '',
        isActive: true
      });

      for (let i = 0; i < info.modulos.length; i++) {
        const mod = info.modulos[i];
        const lesson = await Lesson.create({
          curso: course._id,
          titulo: `Módulo ${i + 1}: ${mod.t}`,
          contenido: `<h3>Contenido del Módulo</h3><p>En esta lección aprenderás todo sobre ${mod.t.toLowerCase()}.</p>`,
          orden: i + 1
        });

        for (const p of mod.p) {
          await Question.create({
            leccion: lesson._id,
            pregunta: p.q,
            opciones: p.o,
            respuestaCorrecta: p.r
          });
        }
      }

      // Examen final
      for (const ex of info.examen) {
        await Question.create({
          curso: course._id,
          pregunta: ex.q,
          opciones: ex.o,
          respuestaCorrecta: ex.r
        });
      }
    }

    console.log('Database Seeded Successfully with 12 real courses and cohesive exams!');
    
    // SAVE TO JSON FILES to update persistence with the latest content
    const { saveCoursesToFile, saveLessonsToFile, saveQuestionsToFile } = await import('./userPersist');
    await saveCoursesToFile();
    await saveLessonsToFile();
    await saveQuestionsToFile();
    console.log('Persistence JSON files updated with latest seed data.');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
