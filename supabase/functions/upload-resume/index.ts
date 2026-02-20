// Resume upload via Edge Function so we use the service role and bypass Storage RLS.
// Deploy: supabase functions deploy upload-resume
// Set secret: SUPABASE_SERVICE_ROLE_KEY (Dashboard → Project Settings → Edge Functions → Secrets)

import { Application } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const MB = 1024 * 1024;
const BUCKET = 'candidate-resumes';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
};

const app = new Application();

// CORS: handle preflight and add headers to all responses
app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', ctx.request.headers.get('Origin') ?? '*');
  ctx.response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  ctx.response.headers.set('Access-Control-Max-Age', '86400');
  if (ctx.request.method === 'OPTIONS') {
    ctx.response.status = 204;
    return;
  }
  await next();
});

app.use(async (ctx) => {
  if (ctx.request.method !== 'POST') {
    ctx.response.status = 405;
    ctx.response.body = { error: 'Method not allowed' };
    return;
  }

  try {
    const body = ctx.request.body({ type: 'form-data' });
    const formData = await body.value.read({
      maxSize: 10 * MB,
    });

    const candidateId = formData.fields?.candidateId as string | undefined;
    const file = formData.files?.[0];
    if (!candidateId?.trim() || !file) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Missing candidateId or file' };
      return;
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      ctx.response.status = 500;
      ctx.response.body = { error: 'Server configuration error' };
      return;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const safeName = (file.name || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${candidateId.trim()}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file.content!.buffer, {
      contentType: file.contentType ?? 'application/octet-stream',
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Storage upload error:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    ctx.response.status = 200;
    ctx.response.type = 'json';
    ctx.response.body = { url: data.publicUrl };
  } catch (e) {
    console.error(e);
    ctx.response.status = 500;
    ctx.response.body = { error: 'Upload failed' };
  }
});

await app.listen({ port: 8000 });
