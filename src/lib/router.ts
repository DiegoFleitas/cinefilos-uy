import express from 'express';
import { proxy } from './proxy';

const router = express.Router();

router.get('/hello', async (_req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

// api/proxy/https://api.themoviedb.org/3/search/movie?query=%QUERY
router.all('/proxy/:url(*)', async (req, res) => {
  return proxy(req, res);
});

export default router;
