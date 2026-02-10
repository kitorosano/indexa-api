
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
}

