/*
  # Attendance Management Module

  1. New Tables
    - `attendance_records`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references auth.users)
      - `subject` (text, NOT NULL)
      - `date` (date, NOT NULL)
      - `check_in_time` (timestamptz)
      - `check_out_time` (timestamptz)
      - `status` (text: 'present', 'absent', 'late', 'excused')
      - `rfid_tag` (text, for RFID simulation)
      - `notes` (text)
      - `created_at` (timestamptz)
    - `rfid_cards`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references auth.users)
      - `card_uid` (text, unique)
      - `is_active` (boolean)
      - `issued_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Students can only view and manage their own attendance
    - Authenticated users only

  3. Important Notes
    - Uses default NOW() for created_at timestamps
    - RFID card UIDs are unique for simulation
    - Status defaults to 'present' when checking in
*/

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  subject text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  check_in_time timestamptz,
  check_out_time timestamptz,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  rfid_tag text,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create rfid_cards table
CREATE TABLE IF NOT EXISTS rfid_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  card_uid text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  issued_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfid_cards ENABLE ROW LEVEL SECURITY;

-- Policies for attendance_records
CREATE POLICY "Students can view own attendance"
  ON attendance_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own attendance"
  ON attendance_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own attendance"
  ON attendance_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Policies for rfid_cards
CREATE POLICY "Students can view own rfid cards"
  ON rfid_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_records_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_subject ON attendance_records(subject);
CREATE INDEX IF NOT EXISTS idx_rfid_cards_student_id ON rfid_cards(student_id);
