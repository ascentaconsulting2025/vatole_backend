# Backend Migration Summary: MongoDB to Supabase

## Overview

Successfully migrated the Gram Panchayat backend from MongoDB/Mongoose to Supabase (PostgreSQL + Storage).

## Changes Made

### 1. Dependencies Updated (`package.json`)

**Removed:**

- `mongoose` - MongoDB ODM
- `multer` - Local file upload

**Added:**

- `@supabase/supabase-js` v2.39.0 - Supabase client library
- `pg` v8.11.3 - PostgreSQL driver for Node.js
- `uuid` v9.0.1 - UUID generation for primary keys

### 2. Configuration Files

#### Created:

- **`config/supabase.js`** - Supabase client initialization with service role key
- **`config/database.js`** - PostgreSQL connection pool configuration
- **`database/schema.sql`** - Complete database schema with:
  - 9 tables with UUID primary keys
  - JSONB columns for flexible data
  - Indexes for performance
  - Row Level Security (RLS) policies
  - Automatic timestamp triggers

#### Updated:

- **`.env.example`** - New environment variables:
  ```
  SUPABASE_URL
  SUPABASE_SERVICE_KEY
  SUPABASE_ANON_KEY
  DATABASE_URL
  SUPABASE_BUCKET_NAME
  ```

### 3. Server Configuration (`server.js`)

**Changes:**

- Removed MongoDB connection (`mongoose.connect()`)
- Added PostgreSQL connection test
- Added Supabase client initialization test
- Server now verifies both connections on startup

### 4. Models Converted (8 Total)

All models converted from Mongoose schemas to PostgreSQL query-based functions:

#### ✅ User.js

- Methods: `create()`, `findByEmail()`, `findById()`, `comparePassword()`, `updateLastLogin()`
- Uses bcrypt for password hashing
- Returns properly formatted user objects

#### ✅ Representative.js

- Methods: `findAll()`, `createMany()`, `deleteAll()`
- Uses transactions for bulk operations
- Handles bilingual data (Marathi + English)

#### ✅ Certificate.js

- Methods: `findAll()`, `createMany()`
- Transforms nested data (requiredDocuments JSONB)
- Returns bilingual certificate names

#### ✅ Infrastructure.js

- Methods: `findAll()`, `createMany()`, `deleteAll()`
- Supports bilingual categories
- Bulk insert/delete with transactions

#### ✅ Image.js

- Methods: `findAll()`, `create()`, `delete()`
- Category-based filtering
- Proper field name transformation (snake_case ↔ camelCase)

#### ✅ HistoricalData.js

- Methods: `findAll()`, `saveAll()`
- Handles two separate tables: `historical_events` and `historical_places`
- Returns combined data structure
- Transaction-based updates

#### ✅ GrampanchayatInfo.js

- Methods: `find()`, `save()`
- Single-row table pattern
- Upsert-style updates (delete + insert)

#### ✅ Document.js

- Methods: `findAll()`, `findByCategory()`, `findById()`, `create()`, `update()`, `delete()`, `deleteMany()`
- JSONB data field for flexible storage
- Category-based organization

### 5. Middleware Updated

#### ✅ upload.js

**Complete rewrite:**

**Old (Multer + Local Storage):**

- Saved files to `uploads/` directory
- Used disk storage
- File paths were local filesystem paths

**New (Supabase Storage):**

- `upload` - Multer with memory storage
- `uploadToSupabase` - Single file upload middleware
- `uploadMultipleToSupabase` - Multiple files upload middleware
- `deleteFromSupabase` - File deletion helper
- Files stored in Supabase Storage bucket
- Returns public CDN URLs
- UUID-based file naming

### 6. Database Schema (`database/schema.sql`)

**Tables Created:**

1. `users` - Admin authentication
2. `representatives` - Village officials
3. `certificates` - Certificate services
4. `infrastructure` - Infrastructure details
5. `images` - Gallery images
6. `historical_events` - Historical events
7. `historical_places` - Historical places
8. `grampanchayat_info` - Village information
9. `documents` - Generic documents

**Features:**

- UUID primary keys (using `uuid_extension`)
- JSONB columns for flexible data
- Timestamp columns (`created_at`, `updated_at`)
- Automatic timestamp updates via triggers
- Row Level Security (RLS) policies
- Indexes for better query performance
- Foreign key constraints where needed

### 7. Scripts Updated

#### ✅ createAdmin.js

- Uses new User model API
- Async/await pattern
- Checks for existing admin
- Proper error handling

### 8. Documentation Created

#### ✅ MIGRATION_GUIDE.md

Comprehensive guide covering:

- Supabase project setup
- Database schema installation
- Storage bucket configuration
- Environment variables
- Testing procedures
- Troubleshooting
- Production deployment tips

## Database Schema Details

### Key Design Decisions

1. **UUID vs Auto-increment IDs**

   - UUIDs chosen for better distribution and security
   - Prevents ID enumeration attacks

2. **JSONB for Flexible Data**

   - `requiredDocuments` in certificates
   - `data` field in documents
   - Better than relational for nested structures

3. **Bilingual Support**

   - Separate columns for Marathi and English
   - Better query performance than JSONB
   - Used in: representatives, certificates, infrastructure, historical data

4. **Row Level Security**
   - Policies defined in schema
   - Extra security layer
   - Can be customized per table

## File Storage Architecture

### Old (Local Multer):

```
uploads/
  ├── general/
  ├── certificates/
  └── gallery/
```

### New (Supabase Storage):

```
grampanchayat-files/ (bucket)
  ├── general/
  │   └── uuid-filename.jpg
  ├── certificates/
  │   └── uuid-filename.pdf
  └── gallery/
      └── uuid-filename.jpg
```

**Benefits:**

- CDN-backed URLs (faster delivery)
- No server disk space needed
- Built-in image transformations
- Better scalability

## API Compatibility

All model methods maintain the same public API, ensuring minimal changes to route files:

**Example:**

```javascript
// Old (Mongoose)
const user = await User.findOne({ email });

// New (PostgreSQL)
const user = await User.findByEmail(email);
```

The route files will need minor updates, but the overall structure remains the same.

## Next Steps Required

### 1. Update Route Files (Pending)

All routes need to be updated to use the new model APIs:

- ✅ Models converted
- ⏳ `routes/auth.js`
- ⏳ `routes/representatives.js`
- ⏳ `routes/certificates.js`
- ⏳ `routes/images.js`
- ⏳ `routes/infrastructure.js`
- ⏳ `routes/historical.js`
- ⏳ `routes/grampanchayat.js`
- ⏳ `routes/documents.js`
- ⏳ `routes/websiteData.js`

### 2. Testing

- Test all API endpoints
- Verify file uploads work
- Check data transformation
- Test error handling

### 3. Frontend Updates

- Update admin panel API calls if needed
- Update static website API integration
- Test image loading from Supabase URLs

## Migration Checklist

- [x] Update package.json dependencies
- [x] Create Supabase configuration
- [x] Create PostgreSQL connection pool
- [x] Design and create database schema
- [x] Update environment variables
- [x] Convert all 8 models
- [x] Update upload middleware
- [x] Update createAdmin script
- [x] Create migration documentation
- [ ] Update route files
- [ ] Test all endpoints
- [ ] Deploy database schema to Supabase
- [ ] Create storage bucket
- [ ] Test file uploads
- [ ] Update frontend configuration

## Performance Considerations

1. **Connection Pooling**: Using `pg` pool for efficient connections
2. **Indexes**: Created on frequently queried columns
3. **Transactions**: Used for bulk operations
4. **Prepared Statements**: Parameterized queries prevent SQL injection

## Security Improvements

1. **Row Level Security**: Database-level access control
2. **Parameterized Queries**: Prevents SQL injection
3. **Service Role Key**: Used server-side only
4. **UUID IDs**: Harder to enumerate than sequential IDs
5. **Password Hashing**: bcrypt with salt (unchanged)

## Environment Variables Reference

```bash
# Required for Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJh...
SUPABASE_ANON_KEY=eyJh...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
SUPABASE_BUCKET_NAME=grampanchayat-files

# Existing (unchanged)
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@grampanchayat.gov.in
ADMIN_PASSWORD=admin123
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Benefits of Migration

1. **Better Scalability**: PostgreSQL handles larger datasets better
2. **Cloud Storage**: Files served via CDN
3. **Real-time Features**: Supabase supports subscriptions (future use)
4. **Better Tools**: Supabase dashboard for database management
5. **Relational Queries**: More efficient joins and complex queries
6. **Industry Standard**: PostgreSQL is battle-tested
7. **Cost Effective**: Supabase free tier is generous

## Potential Challenges

1. **Learning Curve**: PostgreSQL SQL vs MongoDB queries
2. **Migration**: Existing data needs to be migrated
3. **Schema Changes**: More rigid than MongoDB
4. **Route Updates**: All routes need updating

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Node pg Docs: https://node-postgres.com/
- Migration Guide: See `MIGRATION_GUIDE.md`

---

**Migration Date**: January 2025  
**Status**: Models & Middleware Complete ✅  
**Next**: Update Route Files
