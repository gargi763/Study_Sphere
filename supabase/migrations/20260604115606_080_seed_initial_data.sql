/*
  # Seed initial data for all tables

  1. Inserts
    - 3 faculty members
    - Initial data will be created per-student upon signup via application logic

  2. Important Notes
    1. No student_profiles are seeded here — they are created when users sign up
    2. Faculty data is global and shared across all users
    3. The application will create sample data for new users
*/

-- Insert faculty members
INSERT INTO faculty (id, name, email, department, title, office, avatar) VALUES
  (gen_random_uuid(), 'Dr. Sarah Chen', 's.chen@university.edu', 'Computer Science', 'Professor', 'Room 301A', 'SC'),
  (gen_random_uuid(), 'Dr. James Miller', 'j.miller@university.edu', 'Computer Science', 'Associate Professor', 'Room 205B', 'JM'),
  (gen_random_uuid(), 'Dr. Emily Rodriguez', 'e.rodriguez@university.edu', 'Information Systems', 'Assistant Professor', 'Room 102C', 'ER')
ON CONFLICT (email) DO NOTHING;
