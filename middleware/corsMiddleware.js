import cors from 'cors';

const errorMessage = 'Not allowed by CORS';

const corsMiddleware = cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [];
    if (process.env.CORS_ORIGINS) {
      const origins = process.env.CORS_ORIGINS.split(',');
      allowedOrigins.push(...origins);
    }

    const isAllowedOrigin = allowedOrigins.includes(origin);
    if (!isAllowedOrigin) {
      console.log('CORS error: Request blocked for origin:', origin);

      const corsError = new Error(errorMessage);
      corsError.status = 403;
      return callback(corsError);
    }

    callback(null, true);
  },
});

const corsErrorHandler = function (error, req, res, next) {
  if (error && error.message === errorMessage)
    return res.status(error.status).json({ message: 'Origin not allowed by CORS' });

  next(error);
};

export { corsErrorHandler, corsMiddleware };
