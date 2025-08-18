import { Router } from 'express';
import supabase from '../config/supabase.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ id: data.user?.id, email: data.user?.email });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no registro.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    return res.json({
      token: data.session?.access_token,
      user: { id: data.user?.id, email: data.user?.email },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no login.' });
  }
});

router.get('/validate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : null;
    if (!token) return res.status(401).json({ error: 'Token ausente.' });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'Token inválido.' });
    return res.json({ user: { id: data.user.id, email: data.user.email } });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao validar token.' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'ID do usuário ausente.' });
    const { error } = await supabase.auth.admin.signOut(userId);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: 'Sessões do usuário encerradas.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no logout.' });
  }
});

export default router;
