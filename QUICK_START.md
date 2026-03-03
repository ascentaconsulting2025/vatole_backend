# Quick Start Guide - Supabase Backend

This is a quick reference for setting up the migrated backend. For detailed instructions, see `MIGRATION_GUIDE.md`.

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Set Up Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Wait for setup to complete
4. Get your credentials from Settings → API

## 3. Configure Environment

Copy and edit `.env`:

```bash
cp .env.example .env
```

Update these values:

- `SUPABASE_URL` - From Supabase dashboard
- `SUPABASE_SERVICE_KEY` - From Supabase dashboard (keep secret!)
- `SUPABASE_ANON_KEY` - From Supabase dashboard
- `DATABASE_URL` - From Supabase dashboard (Settings → Database)
- `JWT_SECRET` - Generate a random string

## 4. Run Database Schema

1. Open Supabase dashboard → SQL Editor
2. Copy contents of `database/schema.sql`
3. Paste and run
4. Check Table Editor to verify tables were created

## 5. Create Storage Bucket

1. Go to Storage in Supabase
2. Create new bucket: `grampanchayat-files`
3. Make it public
4. Set up policies (see MIGRATION_GUIDE.md)

## 6. Create Admin User

```bash
node scripts/createAdmin.js
```

## 7. Start Server

```bash
npm run dev
```

## 8. Test API

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grampanchayat.gov.in","password":"admin123"}'
```

## Environment Variables Checklist

- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_KEY
- [ ] SUPABASE_ANON_KEY
- [ ] DATABASE_URL
- [ ] SUPABASE_BUCKET_NAME
- [ ] JWT_SECRET
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASSWORD

## Common Issues

### "Connection refused"

→ Check your `DATABASE_URL` is correct

### "Invalid API key"

→ Verify `SUPABASE_SERVICE_KEY` (not anon key)

### "Bucket not found"

→ Create storage bucket in Supabase dashboard

### "Table does not exist"

→ Run `database/schema.sql` in SQL Editor

## Next Steps

After setup:

1. Test all API endpoints
2. Update admin panel `.env.local` with API URL
3. Update static website `.env.local` with API URL
4. Start developing!

## Need Help?

See detailed guides:

- `MIGRATION_GUIDE.md` - Complete setup instructions
- `MIGRATION_SUMMARY.md` - Technical changes overview
- `README.md` - General project information
