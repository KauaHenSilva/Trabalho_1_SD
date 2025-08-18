import supabase from '../config/supabase.js';

export default async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : null;
    if (!token) return res.status(401).json({ error: 'Token ausente.' });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'Token inválido.' });
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Falha na autenticação.' });
  }
}
