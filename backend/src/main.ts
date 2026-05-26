import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/router.js';
import { notesRouter } from './modules/notes/router.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(process.env.PORT || 4000, () => console.log('API on 4000'));
