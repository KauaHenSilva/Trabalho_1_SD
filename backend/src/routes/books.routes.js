import { Router } from 'express';
import supabase from '../config/supabase.js';
import requireAuth from '../middlewares/requireAuth.js';

const router = Router();

// GET /books - lista todos os livros
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar livros.' });
  }
});

// GET /books/:id - busca livro por id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Livro não encontrado.' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar livro.' });
  }
});

// POST /books - cria um novo livro
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, author, pages, year } = req.body || {};
    if (!title || !author || !pages || !year) {
      return res.status(400).json({ error: 'Título, autor, páginas e ano são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('books')
      .insert({ title, author, pages, year })
      .select('*')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar livro.' });
  }
});

// PUT /books/:id - edita um livro por id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, pages, year } = req.body || {};

    const patch = {};
    if (title !== undefined) patch.title = title;
    if (author !== undefined) patch.author = author;
    if (pages !== undefined) patch.pages = pages;
    if (year !== undefined) patch.year = year;

    if (Object.keys(patch).length === 0)
      return res.status(400).json({ error: 'Nada para atualizar.' });

    const { data, error } = await supabase
      .from('books')
      .update(patch)
      .eq('id', id)
      .select('*');

    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Livro não encontrado.' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar livro.' });
  }
});

// DELETE /books/:id - remove um livro por id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: 'sucess' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir livro.' });
  }
});

export default router;