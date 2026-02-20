# Paz Talent Journey - Hiring Application Portal

A comprehensive hiring application system for Globe Life AIL Division - Paz Organization, featuring reception forms, assessment room, admin dashboard, and candidate status tracking.

## Features

- **Reception Pre-Interview Form**: First QR code form with basic info, professional background, and resume upload
- **Post-Interview Confirmation**: Follow-up questions after initial interview
- **Assessment Room Form**: Second QR code form with professional background and leadership assessment (30 questions)
- **Admin Dashboard**: Full candidate management, CSV export, notes, pipeline tracking
- **Status Check**: Public page for candidates to check their application status via email
- **Resume Upload**: File upload functionality with Supabase storage

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: React Router (HashRouter)
- **UI**: Custom components with Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Icons**: Lucide React
- **QR Codes**: react-qr-code

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/aleekaay1/PazTalentJourney.git
   cd PazTalentJourney
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   - Create a new Supabase project at https://app.supabase.com
   - Run the SQL scripts in order:
     - `supabase_setup.sql` - Creates the candidates table
     - `supabase_migration_add_admin_data.sql` - Adds admin data column
   - Create a storage bucket named `candidate-resumes` (or update `RESUMES_BUCKET` in `storageService.ts`)
   - Set up the Edge Function `upload-resume` (optional, for bypassing Storage RLS)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Deployment to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub** (already done)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import the `PazTalentJourney` repository

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
     - `GEMINI_API_KEY` = (optional, if using AI features)

4. **Deploy**
   - Vercel will automatically detect the Vite framework
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

## Project Structure

```
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   └── UI.tsx          # Button, Input, Select components
├── pages/              # Page components
│   ├── Landing.tsx     # Home page
│   ├── InterviewForm.tsx      # Reception form (first QR)
│   ├── AssessmentRoomForm.tsx  # Assessment room form (second QR)
│   ├── AdminDashboard.tsx       # Admin panel
│   ├── CheckStatus.tsx          # Public status check
│   └── ...
├── services/           # Business logic
│   ├── storageService.ts        # Supabase operations
│   ├── supabaseClient.ts        # Supabase client
│   └── assessmentSummary.ts     # Assessment calculations
├── types.ts            # TypeScript type definitions
├── vercel.json         # Vercel configuration
└── vite.config.ts      # Vite configuration
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `GEMINI_API_KEY` | Gemini API key (for AI features) | No |

## Routes

- `/` - Landing page
- `/interview` - Reception pre-interview form
- `/check-status` - Public status check page
- `/assessment-room/:id` - Assessment room form (second QR)
- `/assessment-lookup` - Assessment lookup by email
- `/admin` - Admin dashboard
- `/qr` - QR code generator page

## License

Private - Paz Organization
