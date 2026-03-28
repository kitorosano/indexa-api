import jwt from 'jsonwebtoken';

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No vino el accessToken en la cabecera de la peticion');
    return res.status(401).json({
      message: 'Usuario no autenticado',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {
      id: decoded.id,
    };
    next();
  } catch (error) {
    console.log('El accessToken que vino en la peticion no es valido');
    return res.status(403).json({
      message: 'La sesión no es válida',
    });
  }
};
