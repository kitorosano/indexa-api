import jwt from 'jsonwebtoken';

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
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
    return res.status(403).json({
      message: 'La sesión no es válida',
    });
  }
};
