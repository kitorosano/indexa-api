import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT;

// Endpoint para verificar el estado del servidor
// Request: lo que envia el usuario
// Response: lo que responde el servidor, siempre tiene un codigo de estado, y puede tener un cuerpo
// Codigo de estado: 200 (Todo esta OK)
app.get('/health', function (request, response) {
  response.status(200).send('Server is healthy');
});

app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
