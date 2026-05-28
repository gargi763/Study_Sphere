/*
  # Assignment and Task Management Module

  1. New Tables
    - `assignments`
      - `id` (uuid, primary key)
      - `title` (text, NOT NULL)
      - `description` (text)
      - `subject` (text, NOT NULL)
      - `faculty_id` (uuid, references auth.users)
      - `faculty_name` (text)
      - `due_date` (timestamptz, NOT NULL)
      - `max_score` (integer)
      - `assignment_type` (text: 'homework', 'project', 'quiz', 'exam')
      - `priority` (text: 'low', 'medium', 'high')
      - `attachments` (jsonb array for file URLs)
      - `instructions` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `submissions`
      - `id` (uuid, primary key)
      - `assignment_id` (uuid, references assignments)
      - `student_id` (uuid, references auth.users)
      - `submitted_at` (timestamptz)
      - `status` (text: 'pending', 'submitted', 'graded', 'late')
      - `score` (integer)
      - `feedback` (text)
      - `file_url` (text)
      - `notes` (text)

    - `tasks`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references auth.users)
      - `title` (text, NOT NULL)
      - `description` (text)
      - `due_date` (timestamptz)
      - `priority` (text: 'low', 'medium', 'high')
      - `status` (text: 'todo', 'in-progress', 'completed')
      - `category` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Students can view assignments and manage own submissions/tasks
    - Authenticated users only

  3. Important Notes
    - Uses default NOW() for created_at timestamps
    - JSONB attachments for flexibility
    - Cascade delete for submissions when assignment is deleted
*/

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  subject text NOT NULL,
  faculty_id uuid,
  faculty_name text DEFAULT 'Dr. Smith',
  due_date timestamptz NOT NULL,
  max_score integer DEFAULT 100,
  assignment_type text NOT NULL DEFAULT 'homework' CHECK (assignment_type IN ('homework', 'project', 'quiz', 'exam')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  attachments jsonb DEFAULT '[]'::jsonb,
  instructions text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  submitted_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'late')),
  score integer,
  feedback text DEFAULT '',
  file_url text DEFAULT '',
  notes text DEFAULT ''
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  due_date timestamptz,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed')),
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies for assignments (all authenticated users can view)
CREATE POLICY "Authenticated users can view assignments"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for submissions
CREATE POLICY "Students can view own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Policies for tasks
CREATE POLICY "Students can view own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_subject ON assignments(subject);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_tasks_student_id ON tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
