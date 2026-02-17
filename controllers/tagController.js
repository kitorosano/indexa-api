import db from '../config/db.js';
import { validateUUID } from '../utils/validations.js';

export async function createTag(req, res) {
  try {
    // Validar datos de entrada
    const { groupId, name, color } = req.body;
    if (groupId === '' || name === '' || color === '') {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    }

    // Validar que el groupId proporcionado sea un UUID válido
    if (!validateUUID(groupId)) {
      return res.status(400).json({
        message: 'El groupId proporcionado no es un UUID válido',
      });
    }

    // Validar que exista un grupo con el groupId proporcionado
    const resultFoundedGroup = await db.query(
      'SELECT * FROM groups WHERE id = $1',
      [groupId],
    );
    if (resultFoundedGroup.rows.length === 0) {
      return res.status(404).json({
        message: 'No existe un grupo con ese groupId',
      });
    }

    // Insertar nueva etiqueta en la tabla y devolverla
    const resultNewTag = await db.query(
      `INSERT INTO tags (group_id, name, color) VALUES ($1,$2,$3) RETURNING id,group_id,name,color`,
      [groupId, name, color],
    );

    const newTag = {
      id: resultNewTag.rows[0].id,
      groupId: resultNewTag.rows[0].group_id,
      name: resultNewTag.rows[0].name,
      color: resultNewTag.rows[0].color,
    };

    // Devolver la nueva etiqueta al cliente
    return res.status(201).json({
      message: `Etiqueta creada correctamente para el grupo ${resultFoundedGroup.rows[0].name}`,
      tag: newTag,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}
