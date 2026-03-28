const loggerMiddleware = function (req, res, next) {
  const { method, originalUrl } = req;

  if (method === 'OPTIONS') return next();

  console.log('[IN]', {
    timestamp: new Date().toISOString(),
    method,
    url: originalUrl,
  });

  let jsonResponseBody;
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    jsonResponseBody = body;
    return originalJson(body);
  };

  res.on('finish', function () {
    console.log('[OUT]', {
      timestamp: new Date().toISOString(),
      method,
      url: originalUrl,
      statusCode: res.statusCode,
      message: jsonResponseBody?.message ?? res.statusMessage,
    });
  });

  next();
};

export default loggerMiddleware;
