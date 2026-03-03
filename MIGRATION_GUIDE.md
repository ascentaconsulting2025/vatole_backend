# Supabase Migration Guide

This guide will help you migrate your Gram Panchayat backend from MongoDB to Supabase (PostgreSQL + Storage).

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **Git**: For version control (optional but recommended)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Project Name**: `grampanchayat-backend`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Credentials

After project creation, navigate to **Project Settings** → **API**:

- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: Starts with `eyJh...`
- **service_role key**: Starts with `eyJh...` (keep secret!)

Navigate to **Project Settings** → **Database**:

- **Connection String** (URI): `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
- Replace `[PASSWORD]` with your database password

## Step 3: Set Up Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Copy the entire contents of `database/schema.sql` file
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. Verify all tables were created: Go to **Table Editor** to see your tables

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Bucket settings:
   - **Name**: `grampanchayat-files` (or any name you prefer)
   - **Public bucket**: ✅ Enable (so images are publicly accessible)
4. Click "Create bucket"

### Set Up Storage Policies

After creating the bucket, you need to set up policies:

1. Click on the bucket name
2. Go to **Policies** tab
3. Click "New Policy"
4. Add these policies:

**Policy 1: Public Read Access**

```sql
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'grampanchayat-files');
```

**Policy 2: Authenticated Upload**

```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'grampanchayat-files');
```

**Policy 3: Authenticated Delete**

```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'grampanchayat-files');
```

Or simply enable "Public access" for read operations through the UI.

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your credentials:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Supabase Storage
SUPABASE_BUCKET_NAME=grampanchayat-files

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Admin Credentials
ADMIN_EMAIL=admin@grampanchayat.gov.in
ADMIN_PASSWORD=admin123

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Step 6: Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages including:

- `@supabase/supabase-js` - Supabase client
- `pg` - PostgreSQL driver
- `uuid` - For generating unique IDs

## Step 7: Create Admin User

Run the admin creation script:

```bash
node scripts/createAdmin.js
```

This will create an admin user with the credentials from your `.env` file.

## Step 8: Start the Server

```bash
npm run dev
```

The server should start on `http://localhost:5000` (or your configured PORT).

## Step 9: Verify Everything Works

### Test Database Connection

The server will automatically test the database connection on startup. Check the console for:

```
✅ PostgreSQL connection successful
✅ Supabase client initialized
```

### Test API Endpoints

1. **Login**:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grampanchayat.gov.in","password":"admin123"}'
```

2. **Get Profile** (use the token from login):

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 10: Update Frontend Configuration

Update your admin panel and static website to point to the new backend:

**Admin Panel** (`admin/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Static Website** (`static_basic/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Database Connection Issues

**Error**: "Connection timeout" or "ECONNREFUSED"

**Solution**:

- Verify your `DATABASE_URL` is correct
- Check if your IP is allowed (Supabase allows all IPs by default)
- Ensure database password doesn't contain special characters (URL encode if needed)

### Supabase Client Errors

**Error**: "Invalid API key"

**Solution**:

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct
- Make sure there are no extra spaces or quotes
- The service role key should be used (not the anon key)

### Storage Upload Issues

**Error**: "Policy violation" or "Bucket not found"

**Solution**:

- Verify bucket name matches `SUPABASE_BUCKET_NAME`
- Check bucket exists in Supabase dashboard
- Ensure storage policies are set up correctly
- Make bucket public for read access

### Schema Errors

**Error**: "Table already exists" or "Column does not exist"

**Solution**:

- Drop all tables and run schema.sql again:
  ```sql
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  -- Then run schema.sql
  ```

## Data Migration (If You Have Existing Data)

If you have existing data in MongoDB:

1. **Export from MongoDB**:

   ```bash
   mongoexport --db grampanchayat --collection users --out users.json
   ```

2. **Transform and Import**:
   - You'll need to write scripts to transform MongoDB documents to PostgreSQL format
   - Use the model methods (create, createMany) to insert data
   - Contact support if you need help with this

## Key Differences from MongoDB

### 1. IDs

- **MongoDB**: Uses `_id` (ObjectId)
- **PostgreSQL**: Uses `id` (UUID)

### 2. Relationships

- **MongoDB**: Embedded documents
- **PostgreSQL**: Foreign keys and joins

### 3. Queries

- **MongoDB**: `Model.find({})`
- **PostgreSQL**: `pool.query('SELECT * FROM table')`

### 4. File Storage

- **MongoDB/Local**: Files stored in `uploads/` folder
- **Supabase**: Files stored in cloud bucket with CDN

## Production Deployment

When deploying to production:

1. **Update Environment Variables**:

   - Set `NODE_ENV=production`
   - Use production Supabase project
   - Change JWT_SECRET to a strong random string
   - Update CORS_ORIGINS to your production domains

2. **Database Security**:

   - Row Level Security (RLS) is already set up in schema.sql
   - Review and adjust policies based on your needs
   - Never expose service_role key to frontend

3. **Storage Security**:

   - Configure bucket policies carefully
   - Consider signed URLs for sensitive files
   - Set up file size limits

4. **Monitoring**:
   - Use Supabase dashboard to monitor database usage
   - Set up alerts for storage quota
   - Monitor API requests

## Support

If you encounter any issues:

1. Check the console logs in terminal
2. Check Supabase dashboard logs (Logs & Analytics)
3. Review this guide carefully
4. Contact the development team

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js pg Driver](https://node-postgres.com/)

---

**Last Updated**: January 2025
