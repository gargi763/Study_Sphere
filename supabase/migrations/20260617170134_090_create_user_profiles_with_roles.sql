/*
# Create User Profiles with Roles

## Summary
Adds a unified `user_profiles` table that stores role information (student, faculty, admin)
for every authenticated user. The existing `student_profiles` table remains unchanged.

## New Tables
- `user_profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, not null)
  - `full_name` (text, not null)
  - `role` (text, not null, one of: 'student', 'faculty', 'admin')
  - `avatar_url` (text, nullable)
  - `department` (text, nullable)
  - `phone` (text, nullable)
  - `bio` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

## Security
- RLS enabled on `user_profiles`
- Users can read/update only their own profile
- Service role can insert profiles (used during signup trigger)
- A trigger auto-creates a user_profiles row when a new auth.users row is inserted

## Notes
1. Role is stored as text with a CHECK constraint for type safety.
2. The trigger function uses `raw_user_meta_data` to pick up role at signup time.
3. `student_profiles` is unchanged — student-specific fields remain there.
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  avatar_url text,
  department text,
  phone text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON user_profiles;
CREATE POLICY "delete_own_profile" ON user_profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_profiles_updated_at ON user_profiles;
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_user_profiles_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Faculty profiles table
CREATE TABLE IF NOT EXISTS faculty_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id text UNIQUE,
  designation text,
  specialization text,
  office_location text,
  office_hours text,
  courses_teaching text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_faculty_profile" ON faculty_profiles;
CREATE POLICY "select_own_faculty_profile" ON faculty_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_faculty_profile" ON faculty_profiles;
CREATE POLICY "insert_own_faculty_profile" ON faculty_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_faculty_profile" ON faculty_profiles;
CREATE POLICY "update_own_faculty_profile" ON faculty_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_faculty_profile" ON faculty_profiles;
CREATE POLICY "delete_own_faculty_profile" ON faculty_profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Admin profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id text UNIQUE,
  access_level text NOT NULL DEFAULT 'standard' CHECK (access_level IN ('standard', 'super')),
  managed_departments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_admin_profile" ON admin_profiles;
CREATE POLICY "select_own_admin_profile" ON admin_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_admin_profile" ON admin_profiles;
CREATE POLICY "insert_own_admin_profile" ON admin_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_admin_profile" ON admin_profiles;
CREATE POLICY "update_own_admin_profile" ON admin_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_admin_profile" ON admin_profiles;
CREATE POLICY "delete_own_admin_profile" ON admin_profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);
