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

// Obtener un libro por su ID `GET /api/books/:id`

export async function getBookById(req, res) {
  try {
    const bookId = req.params.id;

    // 1 Validar UUID
    if (!validateUUID(bookId)) {
      return res.status(400).json({
        message: 'El ID proporcionado no es un UUID válido',
      });
    }

    // 2 Buscar libro
    const result = await db.query(
      'SELECT * FROM books WHERE id = $1',
      [bookId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No existe un libro con ese ID',
      });
    }

    const book = result.rows[0];

    // 3️ Mapear snake_case → camelCase
    const mappedBook = {
      id: book.id,
      userId: book.user_id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      publicationYear: book.publication_year,
      pages: book.pages,
      coverUrl: book.cover_url,
    };

    return res.status(200).json(mappedBook);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}