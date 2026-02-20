# upload-resume

Uploads resume files to the `candidate-resumes` bucket using the **service role**, so Storage RLS does not block anonymous form submissions.

## Deploy

1. Install Supabase CLI and log in: <https://supabase.com/docs/guides/cli>  
2. Link the project (if not already): `supabase link --project-ref YOUR_REF`  
3. Set the service role secret (Dashboard → Project Settings → Edge Functions → Secrets):  
   - Name: `SUPABASE_SERVICE_ROLE_KEY`  
   - Value: your project’s **service_role** key (Settings → API)  
4. Deploy:  
   ```bash
   supabase functions deploy upload-resume
   ```

After deployment, the app will call this function when uploading resumes (it uses the same `VITE_SUPABASE_URL` and sends the anon key in `Authorization`).
