# Gram Panchayat Backend - Setup Guide

This guide will help you set up the backend for a **new Gram Panchayat** on any machine.

---

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL Database** (Supabase account recommended)
3. **Text Editor** (VS Code recommended)

---

## 🚀 Quick Start (New Gram Panchayat)

### Step 1: Clone/Copy the Project

```bash
# Clone or copy the backend folder to your machine
cd /path/to/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the backend folder:

```env
# Database Configuration (from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-ID].supabase.co:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
SUPABASE_KEY=[YOUR-ANON-KEY]

# Admin Credentials (Change after first login!)
ADMIN_EMAIL=admin@yourvillage.gov.in
ADMIN_PASSWORD=admin123

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS (Frontend URLs)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT Secret (Generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### Step 4: Get Supabase Credentials

1. Go to https://supabase.com
2. Create a new project (Free tier is enough)
3. Wait for database to initialize (~2 minutes)
4. Go to **Project Settings** → **Database**
   - Copy the **Connection String** (URI format)
   - Replace `[YOUR-PASSWORD]` with your database password
5. Go to **Project Settings** → **API**
   - Copy **Project URL** → Put in `SUPABASE_URL`
   - Copy **anon public** key → Put in `SUPABASE_KEY`

### Step 5: Start the Server

```bash
npm run dev
```

You should see:

```
🚀 Starting Gram Panchayat Backend...
🚀 Server running on 0.0.0.0:5000
📡 Environment: development
🌐 API URL: http://0.0.0.0:5000/api
✅ Supabase Connected Successfully
✅ PostgreSQL Connected Successfully

🔧 Running auto-setup...
🔧 Starting database setup...
📋 Creating tables and indexes...
✅ Database schema created successfully
👤 Creating default admin user...
✅ Admin user created: admin@yourvillage.gov.in
🔑 Password: admin123
⚠️  IMPORTANT: Change this password after first login!

✅ Database setup complete!
📊 Tables created: 11
✅ Auto-setup completed
```

---

## ❓ Common Issues & Solutions

### Issue 1: "Could not find the table 'public.users'"

**Cause**: Tables haven't been created yet (first time setup).

**Solution**: This is normal! The server will automatically create the tables. Just wait a few seconds and the setup will complete.

**What happens**:

1. Server checks Supabase (fails because no tables)
2. Server creates all 11 tables
3. Server retests Supabase (now succeeds)
4. Server is ready!

### Issue 2: "Database connection failed"

**Cause**: Wrong DATABASE_URL or Supabase project not ready.

**Solution**:

1. Check your DATABASE_URL in `.env`
2. Make sure Supabase project is fully initialized (green status)
3. Verify the password in connection string is correct
4. Check if your IP is allowed (Supabase → Settings → Database → Connection Pooling)

### Issue 3: "listen EADDRINUSE: address already in use"

**Cause**: Port 5000 is already in use.

**Solution**:

**Windows:**

```powershell
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID [PID-NUMBER] /F
```

**Linux/Mac:**

```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

Or change the port in `.env`:

```env
PORT=5001
```

### Issue 4: Server starts but tables are not created

**Cause**: Database permissions or SQL error.

**Solution**:

1. Check server logs for detailed error
2. Ensure Supabase database is active
3. Manually run setup script:
   ```bash
   node scripts/setupDatabase.js
   ```

---

## 📁 What Gets Created Automatically?

When you start the server for the first time, it automatically creates:

### 11 Database Tables:

1. ✅ `users` - Admin/editor accounts
2. ✅ `representatives` - Sarpanch, officials (Task 1)
3. ✅ `documents` - General documents (Task 2)
4. ✅ `certificates` - Certificate information (Task 3)
5. ✅ `images` - Gallery and other images (Task 4)
6. ✅ `hero_images` - Homepage slider images (Task 9)
7. ✅ `infrastructure` - Village infrastructure/statistics (Task 2 & 5)
8. ✅ `historical_events` - Historical timeline (Task 6)
9. ✅ `historical_places` - Historical places (Task 6)
10. ✅ `grampanchayat_info` - Basic village info (Task 7)
11. ✅ `announcements` - Public announcements (Task 8)

### Plus:

- ✅ Indexes for better performance
- ✅ Triggers for auto-updating timestamps
- ✅ Row Level Security (RLS) policies
- ✅ Default admin user

---

## 🔐 Security Notes

### After First Setup:

1. **Change Admin Password**:

   - Login to admin panel
   - Go to settings
   - Change password from `admin123`

2. **Update JWT Secret**:

   ```env
   # Generate a random string (at least 32 characters)
   JWT_SECRET=use-a-long-random-string-here-minimum-32-chars
   ```

3. **Restrict CORS** (for production):
   ```env
   CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
   ```

---

## 🌐 Production Deployment

### Deploy to Render.com (Recommended)

1. Push code to GitHub
2. Go to https://render.com
3. Create **New Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables (all from your `.env`)
7. Click **Create Web Service**
8. Wait for deployment (~5 minutes)
9. Your backend is live! 🎉

### Important for Production:

Update your `.env` on Render:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your-supabase-url
CORS_ORIGINS=https://yourvillage.vercel.app,https://admin-yourvillage.vercel.app
```

---

## 📞 Support

If you face any issues:

1. Check the server logs for detailed errors
2. Verify all environment variables are set correctly
3. Ensure Supabase project is active and accessible
4. Check if tables were created:
   - Go to Supabase Dashboard
   - Click **Table Editor**
   - You should see 11 tables

---

## ✅ Checklist for New Village Setup

- [ ] Created Supabase project
- [ ] Copied `.env.example` to `.env`
- [ ] Updated all credentials in `.env`
- [ ] Ran `npm install`
- [ ] Started server with `npm run dev`
- [ ] Verified all 11 tables created
- [ ] Changed default admin password
- [ ] Tested admin login
- [ ] Ready to enter village data! 🎉

---

**Note**: The system is designed to be **fully automatic**. You don't need to manually create any tables or run migration scripts. Just set up the `.env` file and start the server!
