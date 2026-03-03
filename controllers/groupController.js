import db from '../config/db.js';
import { validateUUID } from '../utils/validations.js';

export async function createGroup(req, res) {
  try {
    // Validar datos de entrada
    const { name } = req.body;
    if (name === '') {
      return res.status(400).json({
        message: 'El campo nombre es obligatorio',
      });
    }

    // Validar que no exista un grupo con el name proporcionado
    const resultFoundedGroup = await db.query(
      'SELECT * FROM groups WHERE name = $1',
      [name],
    );
    if (resultFoundedGroup.rows.length > 0) {
      return res.status(409).json({
        message: 'Ya existe un grupo con ese nombre',
      });
    }

    // Insertar nuevo grupo en la tabla y devolverlo
    const resultNewGroup = await db.query(
      `INSERT INTO groups (user_id, name) VALUES ($1, $2) RETURNING *`,
      [req.user.id, name],
    );

    const newGroup = {
      id: resultNewGroup.rows[0].id,
      userId: resultNewGroup.rows[0].user_id,
      name: resultNewGroup.rows[0].name,
    };

    // Devolver el nuevo grupo al cliente
    return res.status(201).json({
      message: 'Grupo creado correctamente',
      group: newGroup,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}
