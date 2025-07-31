# Database Migration Instructions

## Problem
New users are being added to Supabase's `auth.users` table but not to your custom `users` table, causing display names and profile data to not appear in blog posts.

## Solution
Apply the database migration to create a trigger that automatically creates user profiles in your custom table.

## Steps to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_migration.sql`
4. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Apply the migration
supabase db push
```

## What This Migration Does

1. **Creates the users table** (if it doesn't exist) with proper structure
2. **Enables Row Level Security** (RLS) for data protection
3. **Creates security policies** to control access to user data
4. **Creates a trigger function** that automatically creates user profiles
5. **Sets up the trigger** to fire when new users are created in `auth.users`
6. **Adds an index** for better query performance

## How It Works

- When a user signs up, they're automatically added to `auth.users` (Supabase's built-in table)
- The trigger automatically creates a corresponding record in your custom `users` table
- The display name is extracted from the user metadata or generated automatically
- OAuth functionality remains completely intact

## Verification

After applying the migration:

1. Create a new test user account
2. Check that the user appears in both:
   - **Authentication > Users** (Supabase's auth table)
   - **Table Editor > users** (your custom table)
3. Verify that display names appear correctly in blog posts

## Benefits

- ✅ **Automatic user profile creation**
- ✅ **OAuth functionality preserved**
- ✅ **No manual intervention required**
- ✅ **Secure with RLS policies**
- ✅ **Better performance with indexes**

## Troubleshooting

If you encounter issues:

1. **Check the SQL Editor logs** for any error messages
2. **Verify the trigger exists** by running: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
3. **Test with a new user** to ensure the trigger is working
4. **Check RLS policies** if users can't access their own data

## Rollback (if needed)

If you need to rollback the changes:

```sql
-- Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop the table (WARNING: This will delete all user data)
DROP TABLE IF EXISTS public.users;
``` 