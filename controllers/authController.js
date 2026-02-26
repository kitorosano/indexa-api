import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export async function login(req, res) {
  try {
    // Validar datos de entrada
    if (req.body.email === '' || req.body.password === '') {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    }

    // Validar si existe usuario con email
    const resultFoundedUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [req.body.email],
    );
    if (resultFoundedUser.rows.length === 0) {
      return res.status(401).json({
        message: 'El email o la contraseña son incorrectos',
      });
    }

    // Validar que la contraseña sea correcta
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      resultFoundedUser.rows[0].password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'El email o la contraseña son incorrectos',
      });
    }

    // Generar token JWT
    const accessToken = jwt.sign(
      { id: resultFoundedUser.rows[0].id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' },
    );

    const refreshToken = jwt.sign(
      { id: resultFoundedUser.rows[0].id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' },
    );

    const currentRefreshTokenOnCookie = req.cookies?.refreshToken;
    // Obtener todos los refresh tokens del usuario
    const resultSessions = await db.query(
      'SELECT refresh_token FROM sessions WHERE user_id = $1',
      [resultFoundedUser.rows[0].id],
    );

    const userRefreshTokens = !currentRefreshTokenOnCookie
      ? resultSessions.rows.map((session) => session.refresh_token)
      : resultSessions.rows
          .filter(
            (session) => session.refresh_token !== currentRefreshTokenOnCookie,
          )
          .map((session) => session.refresh_token);

    if (currentRefreshTokenOnCookie) {
      // Verificar si el refresh token actual existe en la base de datos
      const isRefreshTokenValid = userRefreshTokens.includes(
        currentRefreshTokenOnCookie,
      );

      if (!isRefreshTokenValid) {
        // Si el refresh token no es válido, eliminar todos los refresh tokens del usuario
        await db.query('DELETE FROM sessions WHERE user_id = $1', [
          resultFoundedUser.rows[0].id,
        ]);
      } else {
        // Sino, solamente eliminar el refresh token actual de la base de datos
        await db.query('DELETE FROM sessions WHERE refresh_token = $1', [
          currentRefreshTokenOnCookie,
        ]);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    // Almacenar el refresh token en la base de datos
    await db.query(
      'INSERT INTO sessions (user_id, refresh_token) VALUES ($1, $2)',
      [resultFoundedUser.rows[0].id, refreshToken],
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return res.status(200).json({
      message: 'Login exitoso',
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}

export async function logout(req, res) {
  try {
    const refreshTokenOnCookie = req.cookies?.refreshToken;

    if (refreshTokenOnCookie) {
      // Eliminar el refresh token de la base de datos
      await db.query('DELETE FROM sessions WHERE refresh_token = $1', [
        refreshTokenOnCookie,
      ]);
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const currentRefreshTokenOnCookie = req.cookies?.refreshToken;

    if (!currentRefreshTokenOnCookie) {
      return res.status(401).json({
        message: 'Usuario no autenticado',
      });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Validar que el refresh token exista en la base de datos
    const resultSession = await db.query(
      'SELECT * FROM sessions WHERE refresh_token = $1',
      [currentRefreshTokenOnCookie],
    );
    if (resultSession.rows.length === 0) {
      jwt.verify(
        currentRefreshTokenOnCookie,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decodedUser) => {
          if (err) return console.log(err);

          // El refresh token es válido pero no existe en la base de datos, por lo que se asume que ha sido robado
          // Eliminar todos los refresh tokens del usuario
          await db.query('DELETE FROM sessions WHERE user_id = $1', [
            decodedUser.id,
          ]);
        },
      );

      return res.status(403).json({
        message: 'La sesión no es válida',
      });
    }

    // Verificar que el refresh token sea válido
    jwt.verify(
      currentRefreshTokenOnCookie,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          // El refresh token no es válido, eliminarlo de la base de datos
          await db.query('DELETE FROM sessions WHERE refresh_token = $1', [
            currentRefreshTokenOnCookie,
          ]);
          return res.status(403).json({
            message: 'La sesión no es válida',
          });
        }

        // Verificar que el refresh token corresponda al usuario que lo ha generado
        if (resultSession.rows[0].user_id !== decodedUser.id) {
          return res.status(403).json({
            message: 'La sesión no es válida',
          });
        }

        // El refresh token es válido, generar un nuevos access token y refresh token
        const accessToken = jwt.sign(
          { id: decodedUser.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '5m' },
        );

        const refreshToken = jwt.sign(
          { id: decodedUser.id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '7d' },
        );

        // Eliminar el refresh token actual de la base de datos y almacenar el nuevo refresh token
        await Promise.all([
          db.query('DELETE FROM sessions WHERE refresh_token = $1', [
            currentRefreshTokenOnCookie,
          ]),
          db.query(
            'INSERT INTO sessions (user_id, refresh_token) VALUES ($1, $2)',
            [decodedUser.id, refreshToken],
          ),
        ]);

        // Enviar el nuevo refresh token en una cookie y el nuevo access token en la respuesta
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });

        return res
          .status(200)
          .json({ message: 'Sesión renovada', accessToken });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        'Ha ocurrido un error inesperado. Por favor, intenta más tarde...',
    });
  }
}
