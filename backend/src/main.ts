import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { authRouter } from './modules/auth/router.js';
import { notesRouter } from './modules/notes/router.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', issues: error.flatten() });
  }
  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(process.env.PORT || 4000, () => console.log(`API on ${process.env.PORT || 4000}`));
