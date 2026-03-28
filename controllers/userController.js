import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { validateUUID } from '../utils/validations.js';

export async function registerUser(req, res) {
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

    const newUser = {
      id: resultNewUser.rows[0].id,
      name: resultNewUser.rows[0].name,
      email: resultNewUser.rows[0].email,
    };

    // Devolver el nuevo usuario al cliente
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}

export async function getUserById(req, res) {
  try {
    const userId = req.params.id;

    if (!validateUUID(userId)) {
      console.log('El ID proporcionado no es un UUID válido');
      return res.status(400).json({
        message: 'El ID de usuario proporcionado no es válido',
      });
    }

    const resultFoundedUser = await db.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [userId],
    );
    if (resultFoundedUser.rows.length === 0) {
      console.log('Usuario no encontrado con el ID proporcionado');
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    const user = {
      id: resultFoundedUser.rows[0].id,
      name: resultFoundedUser.rows[0].name,
      email: resultFoundedUser.rows[0].email,
    };

    return res.status(200).json({
      message: 'Usuario encontrado',
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}
