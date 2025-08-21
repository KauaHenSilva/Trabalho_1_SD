import { Router } from 'express';
import authRoutes from './auth.routes.js';
import booksRoutes from './books.routes.js';

const api = Router();

api.use('/auth', authRoutes);
api.use('/books', booksRoutes);

export default api;
