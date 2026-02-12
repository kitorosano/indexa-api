import db from '../config/db.js';
import { validateUUID } from '../utils/validations.js';

export async function deleteBook(req, res) {
  try {
    // Obtener el ID del libro a eliminar desde los parametros de la URL
    const bookId = req.params.id;

    // Validar que el ID proporcionado sea un UUID válido
    if (!validateUUID(bookId)) {
      return res.status(400).json({
        message: 'El ID proporcionado no es un UUID válido',
      });
    }

    // Validar que exista un libro con el ID proporcionado
    const resultFoundedBook = await db.query(
      'SELECT * FROM books WHERE id = $1',
      [bookId],
    );

    if (resultFoundedBook.rows.length === 0) {
      return res.status(404).json({
        message: 'No existe un libro con ese ID',
      });
    }

    // Eliminar el libro de la tabla
    await db.query('DELETE FROM books WHERE id = $1', [bookId]);

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}
