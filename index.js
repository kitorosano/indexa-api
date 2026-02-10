import bcrypt from 'bcrypt';
import 'dotenv/config';
import express from 'express';
import db from './config/db.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Endpoint para verificar el estado del servidor
// Request: lo que envia el usuario
// Response: lo que responde el servidor, siempre tiene un codigo de estado, y puede tener un cuerpo
// Codigo de estado: 200 (Todo esta OK)
app.get('/health', function (request, response) {
  response.status(200).send('Server is healthy');
});

app.post('/users', async function (req, res) {
  try {
    // Validar datos de entrada
    if (
      req.body.name === '' ||
      req.body.email === '' ||
      req.body.password === ''
    ) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    }

    // Validar si existe usuario con email
    const resultFoundedUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [req.body.email],
    );

    if (resultFoundedUser.rows.length > 0) {
      return res.status(409).json({
        message: 'Ya existe un usuario con ese email',
      });
    }

    // Hashear la password
    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    // Insertar nuevo usuario en la tabla y devolverlo sin la contraseña
    const resultNewUser = await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id,name,email`,
      [req.body.name, req.body.email, hashedPassword],
    );

    // Devolver el nuevo usuario al cliente
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: resultNewUser.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
});

app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
