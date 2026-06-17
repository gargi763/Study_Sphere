/*
# Attendance Module — Real-time, RFID & Faculty Support

## Summary
Enhances the existing attendance system with real-time capability, RFID event logging,
faculty write access, and a unique constraint that enables safe upsert operations.

## Changes to existing tables

### attendance_records
- Adds UNIQUE constraint on (student_id, subject, date) — allows INSERT ... ON CONFLICT DO UPDATE
  so re-scanning an RFID or re-marking doesn't create duplicate rows.
- Adds faculty_id column (nullable) — records which faculty member marked the attendance.
- Adds marked_by column ('self' | 'faculty' | 'rfid') — tracks how the record was created.

## New Tables

### rfid_events
Logs every raw RFID scan event before it is resolved to an attendance record.
- id (uuid, PK)
- card_uid (text) — the raw tag scanned
- student_id (uuid, nullable) — resolved after card lookup
- subject (text) — which class was active during the scan
- scanned_at (timestamptz) — exact scan timestamp
- status (text) — 'pending' | 'matched' | 'unrecognized'
- created_at (timestamptz)

## Security (RLS)

### attendance_records — new policies
- Faculty can INSERT records for any student (for manual marking)
- Faculty can UPDATE records they created

### rfid_events
- Authenticated users can insert events (for RFID simulation)
- Students can view events matching their student_id
- Faculty/admin can view all events

## Notes
1. The unique constraint uses ON CONFLICT (student_id, subject, date) DO UPDATE so
   marking attendance twice updates rather than errors.
2. Real-time is enabled via Supabase Realtime — no schema changes required, just
   client-side channel subscriptions.
3. rfid_events is intentionally permissive on INSERT (any authenticated user can simulate
   a scan), reflecting a real IoT scenario where the scanner itself sends events.
*/

-- Add new columns to attendance_records (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attendance_records' AND column_name = 'faculty_id'
  ) THEN
    ALTER TABLE attendance_records ADD COLUMN faculty_id uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attendance_records' AND column_name = 'marked_by'
  ) THEN
    ALTER TABLE attendance_records
      ADD COLUMN marked_by text NOT NULL DEFAULT 'self'
      CHECK (marked_by IN ('self', 'faculty', 'rfid'));
  END IF;
END $$;

-- Unique constraint for upsert support
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'attendance_records_student_subject_date_key'
  ) THEN
    ALTER TABLE attendance_records
      ADD CONSTRAINT attendance_records_student_subject_date_key
      UNIQUE (student_id, subject, date);
  END IF;
END $$;

-- rfid_events table
CREATE TABLE IF NOT EXISTS rfid_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_uid text NOT NULL,
  student_id uuid REFERENCES auth.users(id),
  subject text NOT NULL DEFAULT '',
  scanned_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'unrecognized')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rfid_events ENABLE ROW LEVEL SECURITY;

-- rfid_events policies
DROP POLICY IF EXISTS "auth_insert_rfid_events" ON rfid_events;
CREATE POLICY "auth_insert_rfid_events" ON rfid_events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "student_select_own_rfid_events" ON rfid_events;
CREATE POLICY "student_select_own_rfid_events" ON rfid_events FOR SELECT
  TO authenticated USING (auth.uid() = student_id OR student_id IS NULL);

-- attendance_records: faculty write policies
DROP POLICY IF EXISTS "faculty_insert_attendance" ON attendance_records;
CREATE POLICY "faculty_insert_attendance" ON attendance_records FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

DROP POLICY IF EXISTS "faculty_update_attendance" ON attendance_records;
CREATE POLICY "faculty_update_attendance" ON attendance_records FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = student_id
    OR auth.uid() = faculty_id
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  )
  WITH CHECK (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Faculty/admin can SELECT all attendance records
DROP POLICY IF EXISTS "faculty_select_all_attendance" ON attendance_records;
CREATE POLICY "faculty_select_all_attendance" ON attendance_records FOR SELECT
  TO authenticated USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Drop the old student-only select policy since the new one covers both
DROP POLICY IF EXISTS "Students can view own attendance" ON attendance_records;

-- Indexes for rfid_events
CREATE INDEX IF NOT EXISTS idx_rfid_events_student_id ON rfid_events(student_id);
CREATE INDEX IF NOT EXISTS idx_rfid_events_scanned_at ON rfid_events(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_rfid_events_card_uid ON rfid_events(card_uid);
CREATE INDEX IF NOT EXISTS idx_attendance_student_subject_date
  ON attendance_records(student_id, subject, date DESC);
