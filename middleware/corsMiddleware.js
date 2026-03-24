import cors from 'cors';
import { getOriginDomain } from '../utils/helpers.js';

const errorMessage = 'Not allowed by CORS';

const corsMiddleware = cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    let originDomain;
    try {
      originDomain = getOriginDomain(origin);
    } catch (err) {
      console.log('CORS error: Invalid origin URL:', origin);

      const corsError = new Error(errorMessage);
      corsError.status = 400;
      return callback(corsError);
    }

    const allowedOrigins = [];
    if (process.env.CORS_ORIGINS) {
      const origins = process.env.CORS_ORIGINS.split(',').map((item) =>
        item.trim().toLowerCase(),
      );
      allowedOrigins.push(...origins);
    }

    const isAllowedOrigin = allowedOrigins.includes(originDomain);
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
    return res
      .status(error.status)
      .json({ message: 'Origin not allowed by CORS' });

  next(error);
};

export { corsErrorHandler, corsMiddleware };
