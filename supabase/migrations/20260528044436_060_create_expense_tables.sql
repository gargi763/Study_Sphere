/*
  # Expense Management Module

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `title` (text, NOT NULL)
      - `description` (text)
      - `amount` (decimal, NOT NULL)
      - `category` (text: 'food', 'transport', 'entertainment', 'utilities', 'supplies', 'other')
      - `date` (date, NOT NULL)
      - `payer_id` (uuid, references auth.users)
      - `is_shared` (boolean)
      - `split_with` (jsonb array of user names)
      - `split_amount` (decimal)
      - `created_at` (timestamptz)

    - `roommates`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references auth.users)
      - `name` (text, NOT NULL)
      - `email` (text)
      - `avatar` (text)
      - `is_active` (boolean)

    - `expense_settlements`
      - `id` (uuid, primary key)
      - `expense_id` (uuid, references expenses)
      - `from_user` (text, NOT NULL)
      - `to_user` (text, NOT NULL)
      - `amount` (decimal, NOT NULL)
      - `is_settled` (boolean)
      - `settled_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only manage their own expenses and roommates
    - Authenticated users only

  3. Important Notes
    - Uses DECIMAL for accurate monetary calculations
    - JSONB for split_with array flexibility
    - Settlements track who owes whom
*/

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  amount decimal(10,2) NOT NULL,
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('food', 'transport', 'entertainment', 'utilities', 'supplies', 'other')),
  date date NOT NULL DEFAULT CURRENT_DATE,
  payer_id uuid NOT NULL,
  is_shared boolean DEFAULT false,
  split_with jsonb DEFAULT '[]'::jsonb,
  split_amount decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create roommates table
CREATE TABLE IF NOT EXISTS roommates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  name text NOT NULL,
  email text DEFAULT '',
  avatar text DEFAULT '',
  is_active boolean DEFAULT true
);

-- Create expense_settlements table
CREATE TABLE IF NOT EXISTS expense_settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid REFERENCES expenses(id) ON DELETE CASCADE,
  from_user text NOT NULL,
  to_user text NOT NULL,
  amount decimal(10,2) NOT NULL,
  is_settled boolean DEFAULT false,
  settled_at timestamptz
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_settlements ENABLE ROW LEVEL SECURITY;

-- Policies for expenses
CREATE POLICY "Users can view own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = payer_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = payer_id);

CREATE POLICY "Users can update own expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = payer_id)
  WITH CHECK (auth.uid() = payer_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = payer_id);

-- Policies for roommates
CREATE POLICY "Users can view own roommates"
  ON roommates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own roommates"
  ON roommates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update own roommates"
  ON roommates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can delete own roommates"
  ON roommates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- Policies for expense_settlements
CREATE POLICY "Users can view settlements involving them"
  ON expense_settlements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = (SELECT payer_id FROM expenses WHERE id = expense_id));

CREATE POLICY "Users can insert settlements"
  ON expense_settlements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update settlements"
  ON expense_settlements
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_payer_id ON expenses(payer_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_roommates_student_id ON roommates(student_id);
CREATE INDEX IF NOT EXISTS idx_settlements_expense_id ON expense_settlements(expense_id);
