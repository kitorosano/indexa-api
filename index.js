import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import authRouter from './routes/authRoutes.js';
import bookRouter from './routes/bookRoutes.js';
import tagRouter from './routes/tagRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/health', function (request, response) {
  response.status(200).send('Server is healthy');
});

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/tags', tagRouter);

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
