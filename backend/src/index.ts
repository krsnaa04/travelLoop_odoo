import { app } from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`Traveloop API running on port ${config.port}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use. Stop the other process or change PORT in backend/.env.`);
    process.exit(1);
  }
  throw error;
});