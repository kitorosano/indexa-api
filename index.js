import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import {
  corsErrorHandler,
  corsMiddleware,
} from './middleware/corsMiddleware.js';
import authRouter from './routes/authRoutes.js';
import bookRouter from './routes/bookRoutes.js';
import groupRouter from './routes/groupRoutes.js';
import tagRouter from './routes/tagRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(corsErrorHandler);

app.get('/health', function (req, res) {
  res.status(200).send({ message: 'Server is healthy' });
});
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/groups', groupRouter);
app.use('/tags', tagRouter);

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
