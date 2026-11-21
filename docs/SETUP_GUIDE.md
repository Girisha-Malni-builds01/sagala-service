# 🚀 Non-Expert Step-by-Step Setup Guide

This guide walks you through setting up a **100% free** Supabase backend and deploying SAGALA SERVICE to Cloudflare Pages or Vercel with zero credit card required.

---

## Part 1: Create a Free Supabase Project

1. Visit [supabase.com](https://supabase.com) and click **Start your project** (Sign up using GitHub or Google).
2. Click **New Project**:
   - **Name**: `sagala-service`
   - **Database Password**: Choose a strong password (save it safely).
   - **Region**: Choose `ap-south-1` (Mumbai, India) for the lowest latency in Madurai.
   - **Pricing Plan**: Free ($0/month).
3. Wait ~1 minute while Supabase provisions your PostgreSQL database.

---

## Part 2: Run the Database Migration (SQL)

1. In your Supabase project dashboard, open the **SQL Editor** from the left sidebar (icon with `>_`).
2. Click **New query**.
3. Open the file [`schema.sql`](file:///Users/girishamalni/Downloads/sagala-service/schema.sql) from this project.
4. Copy the entire contents of `schema.sql` and paste them into the Supabase SQL Editor.
5. Click **Run** (or press `Cmd + Enter` / `Ctrl + Enter`).
6. You will see:
   - `Success. No rows returned`
   - All 10 tables (`profiles`, `categories`, `localities`, `shops`, `products`, `variants`, `offers`, `favourites`, `events`, `sales`) are created.
   - 2 SQL Analytics Views (`view_vendor_analytics`, `view_offer_analytics`) are created.
   - Indexes and Row Level Security (RLS) policies are active.
   - Initial Madurai seed data (shops, localities, categories, active offers) is populated.

---

## Part 3: Get Your Free API Keys

1. In Supabase, click **Project Settings** (gear icon at the bottom of the left sidebar).
2. Go to **API** in the menu:
   - Copy **Project URL** (e.g. `https://xyzcompany.supabase.co`).
   - Copy **Project API keys** → `anon` `public` key.
3. In your local project folder:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Paste your keys:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
     ```

---

## Part 4: Push to GitHub

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SAGALA SERVICE PWA"
   ```
2. Create a new repository on [github.com](https://github.com) called `sagala-service`.
3. Push your code:
   ```bash
   git remote add origin https://github.com/your-username/sagala-service.git
   git branch -M main
   git push -u origin main
   ```

---

## Part 5: Deploy to Cloudflare Pages (or Vercel) for Free

### Option A: Cloudflare Pages (Recommended)
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**.
2. Click **Create Application** → **Pages** → **Connect to Git**.
3. Select your `sagala-service` GitHub repository.
4. Set build configurations:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Environment variables (advanced)**:
   - Add `VITE_SUPABASE_URL` = your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` = your Supabase Anon key
6. Click **Save and Deploy**. Your website is live worldwide with free SSL (e.g. `https://sagala-service.pages.dev`)!

### Option B: Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Import your `sagala-service` repository.
3. Add the two environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
4. Click **Deploy**. Your live app is ready in under 60 seconds!
