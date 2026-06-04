/*
  # Create student profiles, faculty, notifications, AI recommendations, and study plans tables

  1. New Tables
    - `student_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text, unique)
      - `student_id` (text, unique) — display ID like STU-2024-0847
      - `major` (text)
      - `year` (text)
      - `gpa` (numeric)
      - `avatar` (text) — initials for avatar display
      - `university` (text)
      - `budget` (numeric, default 1500)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `faculty`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `department` (text)
      - `title` (text)
      - `office` (text, nullable)
      - `avatar` (text)
      - `created_at` (timestamptz)

    - `notifications`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references student_profiles)
      - `type` (text) — 'assignment', 'grade', 'announcement', 'reminder', 'achievement'
      - `message` (text)
      - `read` (boolean, default false)
      - `created_at` (timestamptz)

    - `ai_recommendations`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references student_profiles)
      - `category` (text) — 'study', 'schedule', 'wellness', 'career'
      - `title` (text)
      - `description` (text)
      - `priority` (text, default 'medium') — 'low', 'medium', 'high'
      - `actionable` (boolean, default true)
      - `action_label` (text, nullable)
      - `is_read` (boolean, default false)
      - `created_at` (timestamptz)

    - `study_plans`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references student_profiles)
      - `time_slot` (text) — e.g. '08:00'
      - `subject` (text)
      - `duration` (integer) — minutes
      - `color` (text) — hex color
      - `completed` (boolean, default false)
      - `is_break` (boolean, default false)
      - `day_of_week` (integer, default 0) — 0=Monday..6=Sunday
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Student profiles: users can read/update own profile
    - Faculty: all authenticated users can read
    - Notifications: users can CRUD own notifications
    - AI Recommendations: users can read/update own
    - Study Plans: users can CRUD own plans

  3. Important Notes
    1. student_profiles.id is also a foreign key to auth.users, linking profile to auth account
    2. Notifications use a CHECK constraint for valid type values
    3. AI recommendations use a CHECK constraint for valid category and priority values
    4. Study plans include day_of_week for weekly recurring schedules
    5. All tables have created_at with default now()
*/

-- Student profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL DEFAULT '',
  student_id text UNIQUE NOT NULL DEFAULT '',
  major text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  gpa numeric(3,2) NOT NULL DEFAULT 0.00,
  avatar text NOT NULL DEFAULT '',
  university text NOT NULL DEFAULT '',
  budget numeric(10,2) NOT NULL DEFAULT 1500.00,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own profile"
  ON student_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Students can update own profile"
  ON student_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can insert own profile"
  ON student_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Faculty table
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT 'Professor',
  office text,
  avatar text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read faculty"
  ON faculty FOR SELECT
  TO authenticated
  USING (true);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'announcement'
    CHECK (type IN ('assignment', 'grade', 'announcement', 'reminder', 'achievement')),
  message text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- AI Recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'study'
    CHECK (category IN ('study', 'schedule', 'wellness', 'career')),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  actionable boolean NOT NULL DEFAULT true,
  action_label text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own recommendations"
  ON ai_recommendations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can update own recommendations"
  ON ai_recommendations FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can insert own recommendations"
  ON ai_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Study Plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  time_slot text NOT NULL DEFAULT '08:00',
  subject text NOT NULL DEFAULT '',
  duration integer NOT NULL DEFAULT 60,
  color text NOT NULL DEFAULT '#3b82f6',
  completed boolean NOT NULL DEFAULT false,
  is_break boolean NOT NULL DEFAULT false,
  day_of_week integer NOT NULL DEFAULT 0
    CHECK (day_of_week BETWEEN 0 AND 6),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own study plans"
  ON study_plans FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own study plans"
  ON study_plans FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own study plans"
  ON study_plans FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete own study plans"
  ON study_plans FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- Add updated_at trigger for student_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_student_profiles_updated_at ON student_profiles;
CREATE TRIGGER set_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_notifications_student_id ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(student_id, read);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_student_id ON ai_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_student_id ON study_plans(student_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_day ON study_plans(student_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(student_id, date);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_expenses_payer_id ON expenses(payer_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(payer_id, date);
