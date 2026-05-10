import express from 'express';
import cors from 'cors';
import { config } from './config';
import { authRouter } from './routes/auth';
import { activityRouter, catalogRouter, publicRouter, stopRouter, tripRouter } from './routes/trips';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: false,
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'traveloop-backend' });
});

app.use('/api/auth', authRouter);
app.use('/api/trips', tripRouter);
app.use('/api/stops', stopRouter);
app.use('/api/activities', activityRouter);
app.use('/api', catalogRouter);
app.use('/api/public', publicRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);
