import { Router } from 'express';
import supabase from '../config/supabase.js';
import requireAuth from '../middlewares/requireAuth.js';
import { authConfig } from '../config/auth.js';
import { normalizeEmail, isValidEmail, isValidPassword } from '../utils/validators.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = normalizeEmail(email);

    if (!email || !password) return res.status(422).json({ error: 'Email e senha são obrigatórios.' });
    if (!isValidEmail(email)) return res.status(422).json({ error: 'Email inválido.' });
    if (!isValidPassword(password)) return res.status(422).json({ error: 'Senha deve ter ao menos 6 caracteres.' });

    if (authConfig.autoConfirm) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) {
        const msg = (error.message || '').toLowerCase();
        const isConflict = msg.includes('already') || msg.includes('registered') || error.status === 409;
        return res.status(isConflict ? 409 : 400).json({ error: 'Não foi possível registrar. ' + error.message });
      }
      return res.status(201).json({ id: data.user?.id, email: data.user?.email, confirmed: true });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: authConfig.siteUrl 
          ? `${authConfig.siteUrl}/auth/callback` 
          : undefined,
      },
    });

    if (error) {
      const msg = (error.message || '').toLowerCase();
      const isConflict = msg.includes('already') || msg.includes('registered') || error.status === 409;
      return res.status(isConflict ? 409 : 400).json({ error: 'Não foi possível registrar. ' + error.message });
    }

    return res.status(201).json({
      id: data.user?.id ?? null,
      email: data.user?.email ?? email,
      confirmationRequired: !data.user,
    });

  } catch (err) {
    return res.status(500).json({ error: `Erro interno no registro. ${err}` });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body || {};
    const email = normalizeEmail(rawEmail);
    if (!email || !password) return res.status(422).json({ error: 'Email e senha são obrigatórios.' });
    if (!isValidEmail(email)) return res.status(422).json({ error: 'Email inválido.' });

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

function getBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length)
    : null;
}

async function validateToken(token) {
  if (!token) return { error: 'Token ausente.' };
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return { error: `Token inválido. ${token}` };
  return { user: data.user };
}

router.get('/validate', async (req, res) => {
  try {
    const token = getBearerToken(req);
    const { user, error } = await validateToken(token);
    if (error) return res.status(401).json({ error });

    return res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao validar token.' });
  }
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Não autenticado.' });
    
    const { error } = await supabase.auth.admin.signOut(userId);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no logout.' });
  }
});

export default router;
