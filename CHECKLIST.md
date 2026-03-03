# Migration Checklist

Use this checklist to track your migration progress from MongoDB to Supabase.

## ✅ Completed Tasks

- [x] Update `package.json` dependencies

  - Removed: mongoose, multer
  - Added: @supabase/supabase-js, pg, uuid

- [x] Create configuration files

  - [x] `config/supabase.js` - Supabase client
  - [x] `config/database.js` - PostgreSQL pool

- [x] Create database schema

  - [x] `database/schema.sql` - Complete schema with 9 tables
  - [x] UUID primary keys
  - [x] JSONB columns
  - [x] Indexes
  - [x] RLS policies
  - [x] Triggers

- [x] Update environment configuration

  - [x] `.env.example` updated
  - [x] New variables added (SUPABASE_URL, DATABASE_URL, etc.)

- [x] Update server configuration

  - [x] `server.js` - Removed MongoDB, added PostgreSQL connection test

- [x] Convert all models to PostgreSQL

  - [x] `User.js`
  - [x] `Representative.js`
  - [x] `Certificate.js`
  - [x] `Infrastructure.js`
  - [x] `Image.js`
  - [x] `HistoricalData.js`
  - [x] `GrampanchayatInfo.js`
  - [x] `Document.js`

- [x] Update middleware

  - [x] `middleware/upload.js` - Converted to Supabase Storage

- [x] Update scripts

  - [x] `scripts/createAdmin.js` - Uses new User model API

- [x] Create documentation
  - [x] `QUICK_START.md`
  - [x] `MIGRATION_GUIDE.md`
  - [x] `MIGRATION_SUMMARY.md`
  - [x] `README.md` updated
  - [x] `CHECKLIST.md` (this file)

## 🔄 Pending Tasks

### 1. Supabase Setup

- [ ] Create Supabase account
- [ ] Create new project
- [ ] Get credentials (URL, service key, anon key)
- [ ] Get database connection string
- [ ] Note down database password

### 2. Database Setup

- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `database/schema.sql`
- [ ] Run the SQL script
- [ ] Verify all 9 tables created in Table Editor
- [ ] Check indexes created
- [ ] Verify RLS policies active

### 3. Storage Setup

- [ ] Go to Storage in Supabase dashboard
- [ ] Create bucket: `grampanchayat-files`
- [ ] Make bucket public
- [ ] Set up storage policies:
  - [ ] Public read access
  - [ ] Authenticated upload
  - [ ] Authenticated delete

### 4. Local Configuration

- [ ] Copy `.env.example` to `.env`
- [ ] Fill in Supabase credentials:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `DATABASE_URL`
  - [ ] `SUPABASE_BUCKET_NAME`
- [ ] Set JWT secret
- [ ] Configure admin credentials
- [ ] Set CORS origins

### 5. Install and Test

- [ ] Run `npm install` in backend folder
- [ ] Run `node scripts/createAdmin.js`
- [ ] Start server with `npm run dev`
- [ ] Verify connections:
  - [ ] PostgreSQL connection successful
  - [ ] Supabase client initialized

### 6. Update Route Files

**Note:** Routes need to be updated to work with new model APIs. This is the main remaining work.

- [ ] `routes/auth.js`

  - Update User model calls
  - Test login
  - Test get profile

- [ ] `routes/representatives.js`

  - Update Representative model calls
  - Test get all
  - Test create/update
  - Test file upload (if applicable)

- [ ] `routes/certificates.js`

  - Update Certificate model calls
  - Test get all
  - Test create/update

- [ ] `routes/images.js`

  - Update Image model calls
  - Update upload middleware usage
  - Test upload to Supabase Storage
  - Test delete (including from storage)
  - Test get all with category filter

- [ ] `routes/infrastructure.js`

  - Update Infrastructure model calls
  - Test get all
  - Test create/update

- [ ] `routes/historical.js`

  - Update HistoricalData model calls
  - Handle events and places separately
  - Test get all
  - Test save all

- [ ] `routes/grampanchayat.js`

  - Update GrampanchayatInfo model calls
  - Test get
  - Test save

- [ ] `routes/documents.js`

  - Update Document model calls
  - Test all CRUD operations
  - Test category filtering
  - Test file upload (if applicable)

- [ ] `routes/websiteData.js`
  - Update all model calls
  - Test public API endpoints
  - Verify data format matches frontend expectations

### 7. Testing

#### API Testing

- [ ] Test authentication flow

  - [ ] Login with admin credentials
  - [ ] Get profile with token
  - [ ] Test with invalid token

- [ ] Test Task 1 - Representatives

  - [ ] GET /api/representatives
  - [ ] POST /api/representatives (with auth)

- [ ] Test Task 2 - Documents

  - [ ] GET /api/documents
  - [ ] POST /api/documents (with auth)
  - [ ] PUT /api/documents/:id (with auth)
  - [ ] DELETE /api/documents/:id (with auth)

- [ ] Test Task 3 - Certificates

  - [ ] GET /api/certificates
  - [ ] POST /api/certificates (with auth)

- [ ] Test Task 4 - Images/Gallery

  - [ ] GET /api/images
  - [ ] POST /api/images/upload (with auth and file)
  - [ ] DELETE /api/images/:id (with auth)
  - [ ] Verify image accessible via public URL

- [ ] Test Task 5 - Infrastructure

  - [ ] GET /api/infrastructure
  - [ ] POST /api/infrastructure (with auth)

- [ ] Test Task 6 - Historical Data

  - [ ] GET /api/historical
  - [ ] POST /api/historical (with auth)

- [ ] Test Task 7 - Grampanchayat Info

  - [ ] GET /api/grampanchayat
  - [ ] POST /api/grampanchayat (with auth)

- [ ] Test Public Website API
  - [ ] GET /api/website/all
  - [ ] GET /api/website/officials
  - [ ] GET /api/website/gallery
  - [ ] GET /api/website/info

#### File Upload Testing

- [ ] Upload single image
- [ ] Verify file in Supabase Storage bucket
- [ ] Verify public URL works
- [ ] Delete image
- [ ] Verify file removed from bucket

#### Database Testing

- [ ] Check data persists after server restart
- [ ] Test bulk operations
- [ ] Test transactions rollback on error
- [ ] Verify timestamps auto-update

### 8. Frontend Integration

#### Admin Panel

- [ ] Update `.env.local` with backend API URL
- [ ] Test login page
- [ ] Test all 7 task pages
- [ ] Test file uploads
- [ ] Test data display
- [ ] Test data editing

#### Static Website

- [ ] Update `.env.local` with backend API URL
- [ ] Test homepage data loading
- [ ] Test gallery page
- [ ] Test officials page
- [ ] Test all public pages

### 9. Error Handling

- [ ] Test with invalid credentials
- [ ] Test with missing fields
- [ ] Test with oversized files
- [ ] Test with invalid file types
- [ ] Test database connection failure
- [ ] Test storage bucket errors
- [ ] Verify error messages are helpful

### 10. Production Preparation

- [ ] Create production Supabase project
- [ ] Run schema in production database
- [ ] Create production storage bucket
- [ ] Set up production environment variables
- [ ] Test with production credentials
- [ ] Review RLS policies
- [ ] Review storage policies
- [ ] Set up monitoring/alerts

### 11. Deployment

- [ ] Choose deployment platform
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Test production API endpoints
- [ ] Update frontend to use production API
- [ ] Deploy frontend
- [ ] Test end-to-end

### 12. Documentation

- [ ] Document API endpoints
- [ ] Document deployment process
- [ ] Create user guide (if needed)
- [ ] Document common issues and solutions

## 📝 Notes

### Model API Changes

When updating routes, note these changes:

**Old (Mongoose):**

```javascript
const data = await Model.find({});
const doc = await Model.findById(id);
const created = await Model.create(data);
```

**New (PostgreSQL):**

```javascript
const data = await Model.findAll();
const doc = await Model.findById(id);
const created = await Model.create(data);
```

### File Upload Changes

**Old (Multer):**

```javascript
upload.single("file");
// req.file.path - local path
```

**New (Supabase):**

```javascript
upload.single("file"), uploadToSupabase;
// req.uploadedFile.filePath - public URL
```

### Data Format Changes

- IDs are now UUIDs instead of MongoDB ObjectIds
- Timestamps are ISO strings
- Nested data uses JSONB (certificates, documents)
- Some fields renamed to snake_case in database, but converted back to camelCase in models

## 🚨 Important Reminders

1. **Never commit `.env` file** - Contains sensitive credentials
2. **Use service role key server-side only** - Never expose to frontend
3. **Test thoroughly before deploying** - Especially file uploads and deletes
4. **Backup data before migration** - If migrating from existing MongoDB
5. **Review RLS policies** - Ensure proper access control
6. **Monitor Supabase quotas** - Free tier has limits

## 📊 Progress Tracking

Total Tasks: ~100
Completed: ~30 ✅
Pending: ~70 ⏳

**Estimated Time:**

- Route updates: 4-6 hours
- Testing: 3-4 hours
- Frontend integration: 2-3 hours
- Production setup: 1-2 hours

**Total: ~10-15 hours**

## 🎯 Next Immediate Steps

1. Set up Supabase account and project
2. Run database schema
3. Create storage bucket
4. Configure `.env` file
5. Test server starts successfully
6. Begin updating route files one by one

---

**Last Updated:** January 2025

**Status:** Models & Middleware Complete ✅ | Routes Pending ⏳
