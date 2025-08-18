import { Router } from 'express';
import supabase from '../config/supabase.js';
import requireAuth from '../middlewares/requireAuth.js';

const router = Router();

// GET /books/search?q=term
router.get('/search', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;
    if (!q || String(q).trim() === '') return res.json([]);

    const term = String(q);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${term}%,author.ilike.%${term}%`)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: 'Erro na busca de livros.' });
  }
});

// GET /books
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, author, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from('books')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (title) query = query.ilike('title', `%${title}%`);
    if (author) query = query.ilike('author', `%${author}%`);

    const { data, error, count } = await query;
    if (error) return res.status(400).json({ error: error.message });

    return res.json({
      data: data || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.max(Math.ceil((count || 0) / limitNum), 1),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar livros.' });
  }
});

// GET /books/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error) return res.status(404).json({ error: 'Livro não encontrado.' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar livro.' });
  }
});

// POST /books
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, author, pages, year } = req.body || {};
    if (!title || !author) return res.status(400).json({ error: 'Título e autor são obrigatórios.' });

    const insert = { title, author, pages: pages ?? null, year: year ?? null, user_id: userId };

    const { data, error } = await supabase
      .from('books')
      .insert(insert)
      .select('*')
      .single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar livro.' });
  }
});

// PUT /books/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, author, pages, year } = req.body || {};

    const patch = {};
    if (title !== undefined) patch.title = title;
    if (author !== undefined) patch.author = author;
    if (pages !== undefined) patch.pages = pages;
    if (year !== undefined) patch.year = year;
    if (Object.keys(patch).length === 0) return res.status(400).json({ error: 'Nada para atualizar.' });

    const { data, error } = await supabase
      .from('books')
      .update(patch)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();
    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Livro não encontrado.' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar livro.' });
  }
});

// DELETE /books/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir livro.' });
  }
});

export default router;
