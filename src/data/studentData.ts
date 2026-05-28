export const student = {
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  id: 'STU-2024-0847',
  major: 'Computer Science',
  year: '3rd Year',
  gpa: 3.8,
  avatar: 'AJ',
  university: 'Tech University',
};

export const attendanceData = {
  overall: 87,
  subjects: [
    { name: 'Data Structures', percentage: 92, total: 48, attended: 44 },
    { name: 'Operating Systems', percentage: 85, total: 40, attended: 34 },
    { name: 'Database Systems', percentage: 78, total: 36, attended: 28 },
    { name: 'Computer Networks', percentage: 90, total: 44, attended: 40 },
    { name: 'Software Engineering', percentage: 88, total: 32, attended: 28 },
  ],
};

export const assignments = [
  { id: 1, title: 'Binary Search Tree Implementation', subject: 'Data Structures', dueDate: '2026-05-30', priority: 'high' as const, status: 'pending' as const, progress: 60 },
  { id: 2, title: 'Process Scheduling Report', subject: 'Operating Systems', dueDate: '2026-06-02', priority: 'medium' as const, status: 'in-progress' as const, progress: 35 },
  { id: 3, title: 'SQL Query Optimization', subject: 'Database Systems', dueDate: '2026-06-05', priority: 'low' as const, status: 'pending' as const, progress: 0 },
  { id: 4, title: 'TCP/IP Protocol Analysis', subject: 'Computer Networks', dueDate: '2026-06-08', priority: 'high' as const, status: 'pending' as const, progress: 15 },
  { id: 5, title: 'UML Diagram Design', subject: 'Software Engineering', dueDate: '2026-06-10', priority: 'medium' as const, status: 'completed' as const, progress: 100 },
];

export const notifications = [
  { id: 1, type: 'assignment' as const, message: 'Assignment due tomorrow: Binary Search Tree', time: '2 hours ago', read: false },
  { id: 2, type: 'grade' as const, message: 'Grade posted: OS Mid-term — 88/100', time: '5 hours ago', read: false },
  { id: 3, type: 'announcement' as const, message: 'Class cancelled: DB Systems on June 3rd', time: '1 day ago', read: true },
  { id: 4, type: 'reminder' as const, message: 'Study group meeting at 6PM today', time: '1 day ago', read: true },
  { id: 5, type: 'achievement' as const, message: 'You earned "Consistent Learner" badge!', time: '2 days ago', read: true },
];

export const expenses = {
  budget: 1500,
  spent: 987,
  categories: [
    { name: 'Books & Supplies', amount: 320, color: '#3b82f6', icon: 'book' },
    { name: 'Food & Dining', amount: 280, color: '#10b981', icon: 'utensils' },
    { name: 'Transport', amount: 180, color: '#f59e0b', icon: 'car' },
    { name: 'Entertainment', amount: 120, color: '#ef4444', icon: 'tv' },
    { name: 'Stationery', amount: 87, color: '#8b5cf6', icon: 'pen' },
  ],
  monthly: [
    { month: 'Jan', amount: 820 },
    { month: 'Feb', amount: 950 },
    { month: 'Mar', amount: 780 },
    { month: 'Apr', amount: 1100 },
    { month: 'May', amount: 987 },
  ],
};

export const studyPlan = [
  { id: 1, time: '08:00', subject: 'Data Structures', duration: 90, color: '#3b82f6', completed: true },
  { id: 2, time: '10:00', subject: 'OS Review', duration: 60, color: '#8b5cf6', completed: true },
  { id: 3, time: '11:30', subject: 'Lunch Break', duration: 60, color: '#10b981', completed: true, isBreak: true },
  { id: 4, time: '13:00', subject: 'Database Systems', duration: 120, color: '#f59e0b', completed: false },
  { id: 5, time: '15:30', subject: 'Networks Lab', duration: 90, color: '#ef4444', completed: false },
  { id: 6, time: '17:30', subject: 'Break & Refresh', duration: 30, color: '#10b981', completed: false, isBreak: true },
  { id: 7, time: '18:00', subject: 'Assignment Work', duration: 120, color: '#06b6d4', completed: false },
];

export const productivityData = {
  weekly: [
    { day: 'Mon', hours: 4.5, tasks: 6 },
    { day: 'Tue', hours: 6.2, tasks: 8 },
    { day: 'Wed', hours: 3.8, tasks: 5 },
    { day: 'Thu', hours: 7.1, tasks: 10 },
    { day: 'Fri', hours: 5.5, tasks: 7 },
    { day: 'Sat', hours: 8.0, tasks: 12 },
    { day: 'Sun', hours: 2.5, tasks: 3 },
  ],
  streakDays: 14,
  totalHoursThisWeek: 37.6,
  tasksCompleted: 51,
  focusScore: 82,
};
