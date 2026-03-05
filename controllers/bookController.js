import db from "../config/db.js";
import { validateUUID } from "../utils/validations.js";

export async function deleteBook(req, res) {
  try {
    // Obtener el ID del libro a eliminar desde los parametros de la URL
    const bookId = req.params.id;

    // Validar que el ID proporcionado sea un UUID válido
    if (!validateUUID(bookId)) {
      return res.status(400).json({
        message: "El ID proporcionado no es un UUID válido",
      });
    }

    // Validar que exista un libro con el ID proporcionado
    const resultFoundedBook = await db.query(
      "SELECT * FROM books WHERE id = $1",
      [bookId],
    );

    if (resultFoundedBook.rows.length === 0) {
      return res.status(404).json({
        message: "No existe un libro con ese ID",
      });
    }

    // Eliminar el libro de la tabla
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        "Ha ocurrido un error inesperado. Por favor, intenta más tarde...",
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
        message: "El ID proporcionado no es un UUID válido",
      });
    }

    // 2 Buscar libro
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe un libro con ese ID",
      });
    }

    const book = result.rows[0];

    // 3️ Mapear snake_case → camelCase
    const mappedBook = {
      id: book.id ?? "",
      userId: book.user_id ?? "",
      title: book.title ?? "",
      author: book.author ?? "",
      publisher: book.publisher ?? "",
      publicationYear: book.publication_year ?? "",
      pages: book.pages ?? "",
      coverUrl: book.cover_url ?? "",
    };

    return res.status(200).json(mappedBook);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        "Ha ocurrido un error inesperado. Por favor, intenta más tarde...",
    });
  }
}

export async function createBook(req, res) {
  try {
    const { title, author, publisher, publicationYear, pages, coverUrl } =
      req.body;

    // Validar campo obligatorio
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "El campo title es obligatorio",
      });
    }

    // Validar formato de campos opcionales (solo si vienen con valor)
    if (author !== undefined && author !== null && typeof author !== "string") {
      return res.status(400).json({
        message: "El campo author debe ser texto",
      });
    }

    if (
      publisher !== undefined &&
      publisher !== null &&
      typeof publisher !== "string"
    ) {
      return res.status(400).json({
        message: "El campo publisher debe ser texto",
      });
    }

    if (
      coverUrl !== undefined &&
      coverUrl !== null &&
      typeof coverUrl !== "string"
    ) {
      return res.status(400).json({
        message: "El campo coverUrl debe ser texto",
      });
    }

    if (publicationYear !== undefined && publicationYear !== null) {
      const year = Number(publicationYear);
      if (
        !Number.isInteger(year) ||
        year < 1000 ||
        year > new Date().getFullYear()
      ) {
        return res.status(400).json({
          message: "El campo publicationYear debe ser un año válido",
        });
      }
    }

    if (pages !== undefined && pages !== null) {
      if (!Number.isInteger(pages) || pages <= 0) {
        return res.status(400).json({
          message: "El campo pages debe ser un entero positivo",
        });
      }
    }

    // Validar que no exista un libro con el mismo título
    const resultFoundedBook = await db.query(
      "SELECT id FROM books WHERE title = $1",
      [title.trim()],
    );
    if (resultFoundedBook.rows.length > 0) {
      return res.status(409).json({
        message: "Ya existe un libro con ese título",
      });
    }

    // Insertar mapeando camelCase → snake_case
    const resultNewBook = await db.query(
      `INSERT INTO books
        (user_id, title, author, publisher, publication_year, pages, cover_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.id,
        title.trim(),
        author ?? null,
        publisher ?? null,
        publicationYear ?? null,
        pages ?? null,
        coverUrl ?? null,
      ],
    );

    // Mapear snake_case → camelCase en la respuesta
    const newBook = {
      id: resultNewBook.rows[0].id,
      userId: resultNewBook.rows[0].user_id,
      title: resultNewBook.rows[0].title,
      author: resultNewBook.rows[0].author,
      publisher: resultNewBook.rows[0].publisher,
      publicationYear: resultNewBook.rows[0].publication_year,
      pages: resultNewBook.rows[0].pages,
      coverUrl: resultNewBook.rows[0].cover_url,
    };

    return res.status(201).json({
      message: "Libro creado correctamente",
      book: newBook,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        "Ha ocurrido un error inesperado. Por favor, intenta más tarde...",
    });
  }
}
