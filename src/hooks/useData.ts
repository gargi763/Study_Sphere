import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables, InsertTables, UpdateTables } from '../types/database';

type StudentProfile = Tables<'student_profiles'>;
type Assignment = Tables<'assignments'>;
type Submission = Tables<'submissions'>;
type AttendanceRecord = Tables<'attendance_records'>;
type Expense = Tables<'expenses'>;
type Notification = Tables<'notifications'>;
type AIRecommendation = Tables<'ai_recommendations'>;
type StudyPlan = Tables<'study_plans'>;
type Faculty = Tables<'faculty'>;
type Task = Tables<'tasks'>;

// ─── Auth Hook ────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: Record<string, string>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from('student_profiles').insert({
        id: data.user.id,
        name: metadata.name || '',
        email,
        student_id: metadata.student_id || `STU-${Date.now().toString().slice(-8)}`,
        major: metadata.major || 'Undeclared',
        year: metadata.year || '1st Year',
        gpa: 0.00,
        avatar: metadata.name ? metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??',
        university: metadata.university || 'University',
      });
    }
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, loading, signUp, signIn, signOut };
}

// ─── Generic fetch hook ───────────────────────────────────────
function useFetch<T>(tableName: string, queryBuilder: (q: any) => any, deps: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase.from(tableName).select('*');
      query = queryBuilder(query);
      const { data: rows, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setData((rows as T[]) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData, setData };
}

// ─── Student Profile ──────────────────────────────────────────
export function useStudentProfile(userId: string | null) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (fetchError) throw fetchError;
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const updateProfile = async (updates: UpdateTables<'student_profiles'>) => {
    if (!userId) return;
    const { data, error: updateError } = await supabase
      .from('student_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    if (updateError) throw updateError;
    setProfile(data);
    return data;
  };

  return { profile, loading, error, updateProfile };
}

// ─── Assignments & Submissions ────────────────────────────────
export function useAssignments(userId: string | null) {
  const { data: assignments, loading, error, refetch, setData } = useFetch<Assignment>(
    'assignments',
    (q: any) => q.order('due_date', { ascending: true }),
    [userId]
  );

  const { data: submissions } = useFetch<Submission>(
    'submissions',
    (q: any) => userId ? q.eq('student_id', userId) : q,
    [userId]
  );

  const addAssignment = async (assignment: InsertTables<'assignments'>) => {
    const { data, error: insertError } = await supabase.from('assignments').insert(assignment).select().maybeSingle();
    if (insertError) throw insertError;
    setData(prev => [...prev, data]);
    return data;
  };

  const updateAssignment = async (id: string, updates: UpdateTables<'assignments'>) => {
    const { data, error: updateError } = await supabase.from('assignments').update(updates).eq('id', id).select().maybeSingle();
    if (updateError) throw updateError;
    setData(prev => prev.map(a => a.id === id ? data : a));
    return data;
  };

  const deleteAssignment = async (id: string) => {
    const { error: deleteError } = await supabase.from('assignments').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setData(prev => prev.filter(a => a.id !== id));
  };

  const addSubmission = async (submission: InsertTables<'submissions'>) => {
    const { data, error: insertError } = await supabase.from('submissions').insert(submission).select().maybeSingle();
    if (insertError) throw insertError;
    return data;
  };

  const updateSubmission = async (id: string, updates: UpdateTables<'submissions'>) => {
    const { data, error: updateError } = await supabase.from('submissions').update(updates).eq('id', id).select().maybeSingle();
    if (updateError) throw updateError;
    return data;
  };

  const getSubmissionForAssignment = (assignmentId: string) =>
    submissions.find(s => s.assignment_id === assignmentId);

  return {
    assignments,
    submissions,
    loading,
    error,
    refetch,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addSubmission,
    updateSubmission,
    getSubmissionForAssignment,
  };
}

// ─── Attendance ───────────────────────────────────────────────
export function useAttendance(userId: string | null) {
  const { data: records, loading, error, refetch, setData } = useFetch<AttendanceRecord>(
    'attendance_records',
    (q: any) => userId ? q.eq('student_id', userId).order('date', { ascending: false }) : q.order('date', { ascending: false }),
    [userId]
  );

  const addRecord = async (record: InsertTables<'attendance_records'>) => {
    const { data, error: insertError } = await supabase.from('attendance_records').insert(record).select().maybeSingle();
    if (insertError) throw insertError;
    setData(prev => [data, ...prev]);
    return data;
  };

  const updateRecord = async (id: string, updates: UpdateTables<'attendance_records'>) => {
    const { data, error: updateError } = await supabase.from('attendance_records').update(updates).eq('id', id).select().maybeSingle();
    if (updateError) throw updateError;
    setData(prev => prev.map(r => r.id === id ? data : r));
    return data;
  };

  const deleteRecord = async (id: string) => {
    const { error: deleteError } = await supabase.from('attendance_records').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setData(prev => prev.filter(r => r.id !== id));
  };

  const getSubjectStats = useCallback(() => {
    const subjects: Record<string, { total: number; attended: number; percentage: number }> = {};
    records.forEach(r => {
      if (!subjects[r.subject]) subjects[r.subject] = { total: 0, attended: 0, percentage: 0 };
      subjects[r.subject].total += 1;
      if (r.status === 'present' || r.status === 'late') subjects[r.subject].attended += 1;
    });
    Object.keys(subjects).forEach(key => {
      const s = subjects[key];
      s.percentage = s.total > 0 ? Math.round((s.attended / s.total) * 100) : 0;
    });
    return subjects;
  }, [records]);

  const getOverallPercentage = useCallback(() => {
    if (records.length === 0) return 0;
    const attended = records.filter(r => r.status === 'present' || r.status === 'late').length;
    return Math.round((attended / records.length) * 100);
  }, [records]);

  return { records, loading, error, refetch, addRecord, updateRecord, deleteRecord, getSubjectStats, getOverallPercentage };
}

// ─── Expenses ─────────────────────────────────────────────────
export function useExpenses(userId: string | null) {
  const { data: expenses, loading, error, refetch, setData } = useFetch<Expense>(
    'expenses',
    (q: any) => userId ? q.eq('payer_id', userId).order('date', { ascending: false }) : q.order('date', { ascending: false }),
    [userId]
  );

  const addExpense = async (expense: InsertTables<'expenses'>) => {
    const { data, error: insertError } = await supabase.from('expenses').insert(expense).select().maybeSingle();
    if (insertError) throw insertError;
    setData(prev => [data, ...prev]);
    return data;
  };

  const updateExpense = async (id: string, updates: UpdateTables<'expenses'>) => {
    const { data, error: updateError } = await supabase.from('expenses').update(updates).eq('id', id).select().maybeSingle();
    if (updateError) throw updateError;
    setData(prev => prev.map(e => e.id === id ? data : e));
    return data;
  };

  const deleteExpense = async (id: string) => {
    const { error: deleteError } = await supabase.from('expenses').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setData(prev => prev.filter(e => e.id !== id));
  };

  const getTotalsByCategory = useCallback(() => {
    const totals: Record<string, number> = {};
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });
    return totals;
  }, [expenses]);

  const getTotalSpent = useCallback(() => {
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  const getMonthlyTotals = useCallback(() => {
    const monthly: Record<string, number> = {};
    expenses.forEach(e => {
      const month = new Date(e.date).toLocaleString('default', { month: 'short' });
      monthly[month] = (monthly[month] || 0) + Number(e.amount);
    });
    return Object.entries(monthly).map(([month, amount]) => ({ month, amount }));
  }, [expenses]);

  return { expenses, loading, error, refetch, addExpense, updateExpense, deleteExpense, getTotalsByCategory, getTotalSpent, getMonthlyTotals };
}

// ─── Notifications ────────────────────────────────────────────
export function useNotifications(userId: string | null) {
  const { data: notifications, loading, error, refetch, setData } = useFetch<Notification>(
    'notifications',
    (q: any) => userId ? q.eq('student_id', userId).order('created_at', { ascending: false }) : q.order('created_at', { ascending: false }),
    [userId]
  );

  const addNotification = async (notification: InsertTables<'notifications'>) => {
    const { data, error: insertError } = await supabase.from('notifications').insert(notification).select().maybeSingle();
    if (insertError) throw insertError;
    setData(prev => [data, ...prev]);
    return data;
  };

  const markAsRead = async (id: string) => {
    const { data, error: updateError } = await supabase.from('notifications').update({ read: true }).eq('id', id).select().maybeSingle();
    if (updateError) throw updateError;
    setData(prev => prev.map(n => n.id === id ? data : n));
    return data;
  };

  const markAllRead = async () => {
    if (!userId) return;
    const { error: updateError } = await supabase.from('notifications').update({ read: true }).eq('student_id', userId).eq('read', false).select();
    if (updateError) throw updateError;
    setData(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (id: string) => {
    const { error: deleteError } = await supabase.from('notifications').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setData(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, error, refetch, addNotification, markAsRead, markAllRead, deleteNotification, unreadCount };
}

// ─── AI Recommendations ─────────────────────────────────────
export function useAIRecommendations(userId: string | null) {
  const { data: recommendations, loading, error, refetch, setData } = useFetch<AIRecommendation>(
    'ai_recommendations',
    (q: any) => userId ? q.eq('student_id', userId).order('created_at', { ascending: false }) : q.order('created_at', { ascending: false }),
    [userId]
  );

  const addRecommendation = async (rec: InsertTables<'ai_recommendations'>) => {
    const { data, error: insertError } = await supabase.from('ai_recommendations').insert(rec).select().maybeSingle();
    if (insertError) throw insertError;
    setData(prev => [data, ...prev]);
    return data;
  };

  const markAsRead = async (id: string) => {
    const { data, error: updateError } = await supabase.from('ai_recommendations').update({ is_read: true }).eq('id', id).select().maybeSingle();
    if (updateError) throw updateError;
    setData(prev => prev.map(r => r.id === id ? data : r));
    return data;
  };

  const dismissRecommendation = async (id: string) => {
    const { error: deleteError } = await supabase.from('ai_recommendations').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setData(prev => prev.filter(r => r.id !== id));
  };

  return { recommendations, loading, error, refetch, addRecommendation, markAsRead, dismissRecommendation };
}

// ─── Study Plans ──────────────────────────────────────────────
export function useStudyPlans(userId: string | null) {
  const { data: plans, loading, error, refetch, setData } = useFetch<StudyPlan>(
    'study_plans',
    (q: any) => userId ? q.eq('student_id', userId).order('sort_order', { ascending: true }) : q.order('sort_order', { ascending: true }),
    [userId]
  );

  const addPlan = async (plan: InsertTables<'study_plans'>) => {
    const { data, error: insertError } = await supabase.from('study_plans').insert(plan).select().maybeSingle();
    if (insertError) throw insertError;
    setData(prev => [...prev, data]);
    return data;
  };

  const updatePlan = async (id: string, updates: UpdateTables<'study_plans'>) => {
    const { data, error: updateError } = await supabase.from('study_plans').update(updates).eq('id', id).select().maybeSingle();
    if (updateError) throw updateError;
    setData(prev => prev.map(p => p.id === id ? data : p));
    return data;
  };

  const deletePlan = async (id: string) => {
    const { error: deleteError } = await supabase.from('study_plans').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setData(prev => prev.filter(p => p.id !== id));
  };

  const toggleCompleted = async (id: string, completed: boolean) => {
    return updatePlan(id, { completed: !completed });
  };

  return { plans, loading, error, refetch, addPlan, updatePlan, deletePlan, toggleCompleted };
}

// ─── Faculty ──────────────────────────────────────────────────
export function useFaculty() {
  const { data: faculty, loading, error, refetch } = useFetch<Faculty>(
    'faculty',
    (q: any) => q.order('name', { ascending: true }),
    []
  );
  return { faculty, loading, error, refetch };
}

// ─── Tasks ───────────────────────────────────────────────────
export function useTasks(userId: string | null) {
  const { data: tasks, loading, error, refetch, setData } = useFetch<Task>(
    'tasks',
    (q: any) => userId ? q.eq('student_id', userId).order('created_at', { ascending: false }) : q.order('created_at', { ascending: false }),
    [userId]
  );

  const addTask = async (task: InsertTables<'tasks'>) => {
    const { data, error: insertError } = await supabase.from('tasks').insert(task).select().maybeSingle();
    if (insertError) throw insertError;
    setData(prev => [data, ...prev]);
    return data;
  };

  const updateTask = async (id: string, updates: UpdateTables<'tasks'>) => {
    const { data, error: updateError } = await supabase.from('tasks').update(updates).eq('id', id).select().maybeSingle();
    if (updateError) throw updateError;
    setData(prev => prev.map(t => t.id === id ? data : t));
    return data;
  };

  const deleteTask = async (id: string) => {
    const { error: deleteError } = await supabase.from('tasks').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setData(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, error, refetch, addTask, updateTask, deleteTask };
}

// ─── Submissions (standalone) ─────────────────────────────────
export function useSubmissions(userId: string | null) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('student_id', userId);
        if (error) throw error;
        setSubmissions(data || []);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return { submissions, loading };
}
