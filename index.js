import 'dotenv/config';
import express from 'express';
import userRouter from './routes/userRoutes.js'
import bookRouter from './routes/bookRoutes.js'
import tagRouter from './routes/tagRoutes.js'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Endpoint para verificar el estado del servidor
// Request: lo que envia el usuario
// Response: lo que responde el servidor, siempre tiene un codigo de estado, y puede tener un cuerpo
// Codigo de estado: 200 (Todo esta OK)
app.get('/health', function (request, response) {
  response.status(200).send('Server is healthy');
});

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/tags', tagRouter);

app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
