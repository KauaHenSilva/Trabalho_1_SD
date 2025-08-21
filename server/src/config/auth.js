const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL || '';
const SUPABASE_AUTO_CONFIRM = String(process.env.SUPABASE_AUTO_CONFIRM || '').toLowerCase() === 'true';

export const authConfig = {
  siteUrl: PUBLIC_SITE_URL,
  autoConfirm: SUPABASE_AUTO_CONFIRM,
};

