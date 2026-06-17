export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  department: string | null;
  phone: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      student_profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          student_id: string;
          major: string;
          year: string;
          gpa: number;
          avatar: string;
          university: string;
          budget: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string;
          student_id?: string;
          major?: string;
          year?: string;
          gpa?: number;
          avatar?: string;
          university?: string;
          budget?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          student_id?: string;
          major?: string;
          year?: string;
          gpa?: number;
          avatar?: string;
          university?: string;
          budget?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      faculty: {
        Row: {
          id: string;
          name: string;
          email: string;
          department: string;
          title: string;
          office: string | null;
          avatar: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string;
          email?: string;
          department?: string;
          title?: string;
          office?: string | null;
          avatar?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          department?: string;
          title?: string;
          office?: string | null;
          avatar?: string;
          created_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          title: string;
          description: string;
          subject: string;
          faculty_id: string | null;
          faculty_name: string;
          due_date: string;
          max_score: number;
          assignment_type: 'homework' | 'project' | 'quiz' | 'exam';
          priority: 'low' | 'medium' | 'high';
          attachments: unknown;
          instructions: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string;
          description?: string;
          subject?: string;
          faculty_id?: string | null;
          faculty_name?: string;
          due_date?: string;
          max_score?: number;
          assignment_type?: 'homework' | 'project' | 'quiz' | 'exam';
          priority?: 'low' | 'medium' | 'high';
          attachments?: unknown;
          instructions?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          subject?: string;
          faculty_id?: string | null;
          faculty_name?: string;
          due_date?: string;
          max_score?: number;
          assignment_type?: 'homework' | 'project' | 'quiz' | 'exam';
          priority?: 'low' | 'medium' | 'high';
          attachments?: unknown;
          instructions?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          submitted_at: string | null;
          status: 'pending' | 'submitted' | 'graded' | 'late';
          score: number | null;
          feedback: string | null;
          file_url: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          submitted_at?: string | null;
          status?: 'pending' | 'submitted' | 'graded' | 'late';
          score?: number | null;
          feedback?: string | null;
          file_url?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_id?: string;
          submitted_at?: string | null;
          status?: 'pending' | 'submitted' | 'graded' | 'late';
          score?: number | null;
          feedback?: string | null;
          file_url?: string | null;
          notes?: string | null;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          date: string;
          check_in_time: string | null;
          check_out_time: string | null;
          status: 'present' | 'absent' | 'late' | 'excused';
          rfid_tag: string | null;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject: string;
          date?: string;
          check_in_time?: string | null;
          check_out_time?: string | null;
          status?: 'present' | 'absent' | 'late' | 'excused';
          rfid_tag?: string | null;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject?: string;
          date?: string;
          check_in_time?: string | null;
          check_out_time?: string | null;
          status?: 'present' | 'absent' | 'late' | 'excused';
          rfid_tag?: string | null;
          notes?: string;
          created_at?: string;
        };
      };
      rfid_cards: {
        Row: {
          id: string;
          student_id: string;
          card_uid: string;
          is_active: boolean;
          issued_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          card_uid: string;
          is_active?: boolean;
          issued_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          card_uid?: string;
          is_active?: boolean;
          issued_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          amount: number;
          category: 'food' | 'transport' | 'entertainment' | 'utilities' | 'supplies' | 'other';
          date: string;
          payer_id: string;
          is_shared: boolean;
          split_with: unknown;
          split_amount: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string;
          description?: string | null;
          amount: number;
          category?: 'food' | 'transport' | 'entertainment' | 'utilities' | 'supplies' | 'other';
          date?: string;
          payer_id: string;
          is_shared?: boolean;
          split_with?: unknown;
          split_amount?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          amount?: number;
          category?: 'food' | 'transport' | 'entertainment' | 'utilities' | 'supplies' | 'other';
          date?: string;
          payer_id?: string;
          is_shared?: boolean;
          split_with?: unknown;
          split_amount?: number | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          student_id: string;
          type: 'assignment' | 'grade' | 'announcement' | 'reminder' | 'achievement';
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          type: 'assignment' | 'grade' | 'announcement' | 'reminder' | 'achievement';
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          type?: 'assignment' | 'grade' | 'announcement' | 'reminder' | 'achievement';
          message?: string;
          read?: boolean;
          created_at?: string;
        };
      };
      ai_recommendations: {
        Row: {
          id: string;
          student_id: string;
          category: 'study' | 'schedule' | 'wellness' | 'career';
          title: string;
          description: string;
          priority: 'low' | 'medium' | 'high';
          actionable: boolean;
          action_label: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          category?: 'study' | 'schedule' | 'wellness' | 'career';
          title: string;
          description: string;
          priority?: 'low' | 'medium' | 'high';
          actionable?: boolean;
          action_label?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          category?: 'study' | 'schedule' | 'wellness' | 'career';
          title?: string;
          description?: string;
          priority?: 'low' | 'medium' | 'high';
          actionable?: boolean;
          action_label?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      study_plans: {
        Row: {
          id: string;
          student_id: string;
          time_slot: string;
          subject: string;
          duration: number;
          color: string;
          completed: boolean;
          is_break: boolean;
          day_of_week: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          time_slot?: string;
          subject: string;
          duration?: number;
          color?: string;
          completed?: boolean;
          is_break?: boolean;
          day_of_week?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          time_slot?: string;
          subject?: string;
          duration?: number;
          color?: string;
          completed?: boolean;
          is_break?: boolean;
          day_of_week?: number;
          sort_order?: number;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          priority: 'low' | 'medium' | 'high';
          status: 'todo' | 'in-progress' | 'completed';
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          priority?: 'low' | 'medium' | 'high';
          status?: 'todo' | 'in-progress' | 'completed';
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          priority?: 'low' | 'medium' | 'high';
          status?: 'todo' | 'in-progress' | 'completed';
          category?: string | null;
          created_at?: string;
        };
      };
      roommates: {
        Row: {
          id: string;
          student_id: string;
          name: string;
          email: string;
          avatar: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          student_id: string;
          name: string;
          email?: string;
          avatar?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          student_id?: string;
          name?: string;
          email?: string;
          avatar?: string;
          is_active?: boolean;
        };
      };
      expense_settlements: {
        Row: {
          id: string;
          expense_id: string | null;
          from_user: string;
          to_user: string;
          amount: number;
          is_settled: boolean;
          settled_at: string | null;
        };
        Insert: {
          id?: string;
          expense_id?: string | null;
          from_user: string;
          to_user: string;
          amount: number;
          is_settled?: boolean;
          settled_at?: string | null;
        };
        Update: {
          id?: string;
          expense_id?: string | null;
          from_user?: string;
          to_user?: string;
          amount?: number;
          is_settled?: boolean;
          settled_at?: string | null;
        };
      };
    };
  };
}
