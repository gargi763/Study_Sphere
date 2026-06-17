import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types/database';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
      }, { onConflict: 'id' });
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

  return { user, session, loading, signUp, signIn, signOut };
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data as UserProfile | null);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    setProfile(data as UserProfile);
    return data;
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
}

// ─── Student Profile ──────────────────────────────────────────────────────────

export function useStudentProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('student_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [userId]);

  const updateProfile = async (updates: Record<string, unknown>) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('student_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  };

  return { profile, loading, updateProfile };
}

// ─── Generic Fetch ────────────────────────────────────────────────────────────

export function useFetch<T>(
  table: string,
  filter?: { column: string; value: string | null }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (filter && !filter.value) { setLoading(false); return; }
    let query = supabase.from(table).select('*').order('created_at', { ascending: false });
    if (filter) query = query.eq(filter.column, filter.value as string);
    const { data: rows } = await query;
    setData((rows ?? []) as T[]);
    setLoading(false);
  }, [table, filter?.value]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, refetch: fetchData };
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export function useAssignments(userId?: string) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const [aRes, sRes] = await Promise.all([
      supabase.from('assignments').select('*').order('due_date', { ascending: true }),
      supabase.from('submissions').select('*').eq('student_id', userId),
    ]);
    setAssignments(aRes.data ?? []);
    setSubmissions(sRes.data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addAssignment = async (assignment: Record<string, unknown>) => {
    const { data, error } = await supabase.from('assignments').insert(assignment).select().single();
    if (error) throw error;
    setAssignments(prev => [...prev, data]);
    return data;
  };

  const updateAssignment = async (id: string, updates: Record<string, unknown>) => {
    const { data, error } = await supabase.from('assignments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setAssignments(prev => prev.map(a => a.id === id ? data : a));
    return data;
  };

  const deleteAssignment = async (id: string) => {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) throw error;
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const submitAssignment = async (submission: Record<string, unknown>) => {
    const { data, error } = await supabase.from('submissions').insert(submission).select().single();
    if (error) throw error;
    setSubmissions(prev => [...prev, data]);
    return data;
  };

  return { assignments, submissions, loading, addAssignment, updateAssignment, deleteAssignment, submitAssignment, refetch: fetchAll };
}

// ─── Attendance (real-time) ───────────────────────────────────────────────────

export interface AttendanceRecord {
  id: string;
  student_id: string;
  subject: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late' | 'excused';
  rfid_tag: string | null;
  notes: string;
  marked_by: 'self' | 'faculty' | 'rfid';
  faculty_id: string | null;
  created_at: string;
}

export interface SubjectStat {
  subject: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
}

export function useAttendance(userId?: string) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('student_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    setRecords((data ?? []) as AttendanceRecord[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`attendance:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance_records',
          filter: `student_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRecords(prev => {
              const exists = prev.some(r => r.id === (payload.new as AttendanceRecord).id);
              if (exists) return prev;
              return [payload.new as AttendanceRecord, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setRecords(prev =>
              prev.map(r => r.id === (payload.new as AttendanceRecord).id ? payload.new as AttendanceRecord : r)
            );
          } else if (payload.eventType === 'DELETE') {
            setRecords(prev => prev.filter(r => r.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Upsert — inserts or updates by (student_id, subject, date)
  const upsertRecord = async (record: {
    student_id: string;
    subject: string;
    date: string;
    status: AttendanceRecord['status'];
    check_in_time?: string | null;
    rfid_tag?: string | null;
    marked_by?: AttendanceRecord['marked_by'];
    faculty_id?: string | null;
    notes?: string;
  }) => {
    const { data, error } = await supabase
      .from('attendance_records')
      .upsert(record, { onConflict: 'student_id,subject,date' })
      .select()
      .single();
    if (error) throw error;
    return data as AttendanceRecord;
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase.from('attendance_records').delete().eq('id', id);
    if (error) throw error;
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const getSubjectStats = (): SubjectStat[] => {
    const map: Record<string, SubjectStat> = {};
    records.forEach(r => {
      if (!map[r.subject]) {
        map[r.subject] = { subject: r.subject, present: 0, absent: 0, late: 0, excused: 0, total: 0, percentage: 0 };
      }
      const s = map[r.subject];
      s.total++;
      if (r.status === 'present') s.present++;
      else if (r.status === 'absent') s.absent++;
      else if (r.status === 'late') s.late++;
      else if (r.status === 'excused') s.excused++;
      // present + late count as attended
      s.percentage = s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0;
    });
    return Object.values(map);
  };

  const getOverallPercentage = () => {
    if (!records.length) return 0;
    const attended = records.filter(r => r.status === 'present' || r.status === 'late').length;
    return Math.round((attended / records.length) * 100);
  };

  const getTodayRecords = () => {
    const today = new Date().toISOString().split('T')[0];
    return records.filter(r => r.date === today);
  };

  return {
    records,
    loading,
    upsertRecord,
    deleteRecord,
    getSubjectStats,
    getOverallPercentage,
    getTodayRecords,
    refetch: fetchRecords,
  };
}

// ─── RFID Events (real-time) ──────────────────────────────────────────────────

export interface RfidEvent {
  id: string;
  card_uid: string;
  student_id: string | null;
  subject: string;
  scanned_at: string;
  status: 'pending' | 'matched' | 'unrecognized';
  created_at: string;
}

export function useRfidEvents(userId?: string) {
  const [events, setEvents] = useState<RfidEvent[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('rfid_events')
      .select('*')
      .eq('student_id', userId)
      .order('scanned_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setEvents((data ?? []) as RfidEvent[]));
  }, [userId]);

  // Real-time subscription for RFID events
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`rfid:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rfid_events',
          filter: `student_id=eq.${userId}`,
        },
        (payload) => {
          setEvents(prev => [payload.new as RfidEvent, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const simulateScan = async (userId: string, subject: string): Promise<RfidEvent> => {
    setScanning(true);
    const cardUid = `RFID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    await new Promise(r => setTimeout(r, 1800));

    const { data, error } = await supabase
      .from('rfid_events')
      .insert({
        card_uid: cardUid,
        student_id: userId,
        subject,
        scanned_at: new Date().toISOString(),
        status: 'matched',
      })
      .select()
      .single();

    setScanning(false);
    if (error) throw error;
    return data as RfidEvent;
  };

  return { events, scanning, simulateScan };
}

// ─── Expenses ─────────────────────────────────────────────────────────────────

export function useExpenses(userId?: string) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('student_id', userId)
      .order('date', { ascending: false });
    setExpenses(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const addExpense = async (expense: Record<string, unknown>) => {
    const { data, error } = await supabase.from('expenses').insert(expense).select().single();
    if (error) throw error;
    setExpenses(prev => [data, ...prev]);
    return data;
  };

  const updateExpense = async (id: string, updates: Record<string, unknown>) => {
    const { data, error } = await supabase.from('expenses').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setExpenses(prev => prev.map(e => e.id === id ? data : e));
    return data;
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const getCategoryTotals = () => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + e.amount; });
    return map;
  };

  const getMonthlyTotals = () => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      const month = e.date?.slice(0, 7) ?? '';
      map[month] = (map[month] ?? 0) + e.amount;
    });
    return map;
  };

  return { expenses, loading, addExpense, updateExpense, deleteExpense, getCategoryTotals, getMonthlyTotals, refetch: fetchExpenses };
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setNotifications(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    if (!userId) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, markAsRead, markAllRead, deleteNotification, unreadCount, refetch: fetchNotifications };
}

// ─── AI Recommendations ───────────────────────────────────────────────────────

export function useAIRecommendations(userId?: string) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRecommendations(data ?? []);
        setLoading(false);
      });
  }, [userId]);

  const addRecommendation = async (rec: Record<string, unknown>) => {
    const { data, error } = await supabase.from('ai_recommendations').insert(rec).select().single();
    if (error) throw error;
    setRecommendations(prev => [data, ...prev]);
    return data;
  };

  const markAsRead = async (id: string) => {
    await supabase.from('ai_recommendations').update({ is_read: true }).eq('id', id);
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, is_read: true } : r));
  };

  const dismiss = async (id: string) => {
    await supabase.from('ai_recommendations').update({ is_dismissed: true }).eq('id', id);
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  return { recommendations, loading, addRecommendation, markAsRead, dismiss };
}

// ─── Study Plans ──────────────────────────────────────────────────────────────

export function useStudyPlans(userId?: string) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('study_plans')
      .select('*, tasks(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPlans(data ?? []);
        setLoading(false);
      });
  }, [userId]);

  const addPlan = async (plan: Record<string, unknown>) => {
    const { data, error } = await supabase.from('study_plans').insert(plan).select().single();
    if (error) throw error;
    setPlans(prev => [data, ...prev]);
    return data;
  };

  const updatePlan = async (id: string, updates: Record<string, unknown>) => {
    const { data, error } = await supabase.from('study_plans').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setPlans(prev => prev.map(p => p.id === id ? data : p));
    return data;
  };

  const deletePlan = async (id: string) => {
    await supabase.from('study_plans').delete().eq('id', id);
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const toggleCompleted = async (id: string, completed: boolean) => updatePlan(id, { completed });

  return { plans, loading, addPlan, updatePlan, deletePlan, toggleCompleted };
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTasks(data ?? []);
        setLoading(false);
      });
  }, [userId]);

  const addTask = async (task: Record<string, unknown>) => {
    const { data, error } = await supabase.from('tasks').insert(task).select().single();
    if (error) throw error;
    setTasks(prev => [data, ...prev]);
    return data;
  };

  const updateTask = async (id: string, updates: Record<string, unknown>) => {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setTasks(prev => prev.map(t => t.id === id ? data : t));
    return data;
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export function useSubmissions(userId?: string) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('submissions')
      .select('*')
      .eq('student_id', userId)
      .order('submitted_at', { ascending: false })
      .then(({ data }) => {
        setSubmissions(data ?? []);
        setLoading(false);
      });
  }, [userId]);

  return { submissions, loading };
}

// ─── Faculty ──────────────────────────────────────────────────────────────────

export function useFaculty() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('faculty')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setFaculty(data ?? []);
        setLoading(false);
      });
  }, []);

  return { faculty, loading };
}
