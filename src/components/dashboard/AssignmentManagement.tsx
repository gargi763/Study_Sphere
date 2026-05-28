import { useState, useEffect } from 'react';
import {
  Calendar, Clock, AlertCircle, CheckCircle2, FileText, Upload,
  Filter, Search, ChevronDown, Plus, X, UploadCloud, Trash2,
  BookOpen, Code, Brain, Cpu, FolderKanban, BarChart3, ListTodo,
  TrendingUp, AlertTriangle, Award, Sparkles
} from 'lucide-react';

const subjects = ['Data Structures', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Software Engineering'];
const subjectIcons: Record<string, React.ElementType> = {
  'Data Structures': Code,
  'Operating Systems': Cpu,
  'Database Systems': FolderKanban,
  'Computer Networks': Brain,
  'Software Engineering': BookOpen,
};

type AssignmentType = 'homework' | 'project' | 'quiz' | 'exam';
type Priority = 'low' | 'medium' | 'high';
type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'late';
type TaskStatus = 'todo' | 'in-progress' | 'completed';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  facultyName: string;
  dueDate: string;
  maxScore: number;
  assignmentType: AssignmentType;
  priority: Priority;
  instructions: string;
  createdAt: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  submittedAt?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
}

const typeConfig = {
  homework: { label: 'Homework', color: 'text-blue-400', bg: 'bg-blue-500/15', icon: FileText },
  project: { label: 'Project', color: 'text-purple-400', bg: 'bg-purple-500/15', icon: FolderKanban },
  quiz: { label: 'Quiz', color: 'text-cyan-400', bg: 'bg-cyan-500/15', icon: Brain },
  exam: { label: 'Exam', color: 'text-red-400', bg: 'bg-red-500/15', icon: AlertTriangle },
};

const priorityConfig = {
  high: { label: 'High', color: 'text-red-400', bg: 'bg-red-500/15' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  low: { label: 'Low', color: 'text-green-400', bg: 'bg-green-500/15' },
};

const submissionStatusConfig = {
  pending: { label: 'Pending', color: 'text-gray-400', bg: 'bg-gray-500/15', icon: Clock },
  submitted: { label: 'Submitted', color: 'text-blue-400', bg: 'bg-blue-500/15', icon: Upload },
  graded: { label: 'Graded', color: 'text-green-400', bg: 'bg-green-500/15', icon: CheckCircle2 },
  late: { label: 'Late', color: 'text-red-400', bg: 'bg-red-500/15', icon: AlertCircle },
};

const taskStatusConfig = {
  todo: { label: 'To Do', color: 'text-gray-400', bg: 'bg-gray-500/15', icon: ListTodo },
  'in-progress': { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/15', icon: TrendingUp },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/15', icon: CheckCircle2 },
};

// Generate mock assignments
const generateMockAssignments = (): Assignment[] => {
  return [
    { id: '1', title: 'Binary Search Tree Implementation', description: 'Implement a BST with insert, delete, and search operations', subject: 'Data Structures', facultyName: 'Dr. Anderson', dueDate: '2026-05-30T23:59:00', maxScore: 100, assignmentType: 'project', priority: 'high', instructions: 'Submit code with unit tests', createdAt: '2026-05-20' },
    { id: '2', title: 'Process Scheduling Report', description: 'Compare FCFS, SJF, and Round Robin algorithms', subject: 'Operating Systems', facultyName: 'Dr. Martinez', dueDate: '2026-06-02T23:59:00', maxScore: 50, assignmentType: 'homework', priority: 'medium', instructions: 'Include graphs and analysis', createdAt: '2026-05-22' },
    { id: '3', title: 'SQL Query Optimization', description: 'Optimize given queries using indexing', subject: 'Database Systems', facultyName: 'Dr. Chen', dueDate: '2026-06-05T14:00:00', maxScore: 75, assignmentType: 'homework', priority: 'low', instructions: 'Show execution plans', createdAt: '2026-05-25' },
    { id: '4', title: 'TCP/IP Protocol Analysis', description: 'Capture and analyze network packets', subject: 'Computer Networks', facultyName: 'Prof. Williams', dueDate: '2026-06-08T23:59:00', maxScore: 100, assignmentType: 'project', priority: 'high', instructions: 'Use Wireshark for capture', createdAt: '2026-05-26' },
    { id: '5', title: 'UML Diagram Design', description: 'Create class and sequence diagrams', subject: 'Software Engineering', facultyName: 'Dr. Taylor', dueDate: '2026-06-10T18:00:00', maxScore: 80, assignmentType: 'homework', priority: 'medium', instructions: 'Use draw.io or Lucidchart', createdAt: '2026-05-27' },
    { id: '6', title: 'Midterm Exam - OS', description: 'Covers chapters 1-5', subject: 'Operating Systems', facultyName: 'Dr. Martinez', dueDate: '2026-06-15T09:00:00', maxScore: 100, assignmentType: 'exam', priority: 'high', instructions: 'Closed book, 2 hours', createdAt: '2026-05-28' },
    { id: '7', title: 'Database Quiz #3', description: 'Normalization and indexing', subject: 'Database Systems', facultyName: 'Dr. Chen', dueDate: '2026-06-12T10:00:00', maxScore: 25, assignmentType: 'quiz', priority: 'medium', instructions: 'Open notes, 30 mins', createdAt: '2026-05-28' },
  ];
};

const generateMockSubmissions = (): Submission[] => {
  return [
    { id: 'sub1', assignmentId: '5', status: 'graded', score: 92, feedback: 'Excellent diagrams!', submittedAt: '2026-05-28T14:30:00' },
    { id: 'sub2', assignmentId: '2', status: 'submitted', submittedAt: '2026-05-29T10:15:00' },
  ];
};

const generateMockTasks = (): Task[] => {
  return [
    { id: 't1', title: 'Review lecture notes', description: 'OS chapters 3-4', priority: 'medium', status: 'todo', category: 'Study' },
    { id: 't2', title: 'Complete coding practice', description: 'LeetCode problems', priority: 'high', status: 'in-progress', category: 'Programming' },
    { id: 't3', title: 'Group meeting prep', description: 'Prepare slides', priority: 'low', status: 'completed', category: 'Group Work' },
    { id: 't4', title: 'Read research paper', description: 'Distributed systems paper', priority: 'medium', status: 'todo', category: 'Reading' },
  ];
};

function getDaysUntil(dateStr: string): { text: string; urgent: boolean; overdue: boolean } {
  const now = new Date();
  const due = new Date(dateStr);
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: 'Overdue', urgent: true, overdue: true };
  if (diff === 0) return { text: 'Due today', urgent: true, overdue: false };
  if (diff === 1) return { text: 'Due tomorrow', urgent: true, overdue: false };
  if (diff <= 3) return { text: `${diff} days left`, urgent: true, overdue: false };
  return { text: `${diff} days left`, urgent: false, overdue: false };
}

export default function AssignmentManagement() {
  const [activeTab, setActiveTab] = useState<'assignments' | 'tasks' | 'faculty'>('assignments');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState<string | null>(null);

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');

  useEffect(() => {
    setAssignments(generateMockAssignments());
    setSubmissions(generateMockSubmissions());
    setTasks(generateMockTasks());
  }, []);

  const filteredAssignments = assignments.filter(a => {
    if (filterSubject !== 'all' && a.subject !== filterSubject) return false;
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getSubmission = (assignmentId: string) => submissions.find(s => s.assignmentId === assignmentId);

  const submitAssignment = (assignmentId: string) => {
    const existing = submissions.find(s => s.assignmentId === assignmentId);
    if (!existing) {
      const newSubmission: Submission = {
        id: `sub-${Date.now()}`,
        assignmentId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      };
      setSubmissions(prev => [...prev, newSubmission]);
    }
    setShowUploadModal(null);
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: newTaskTitle,
      description: '',
      priority: newTaskPriority,
      status: 'todo',
      category: 'Personal',
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Stats
  const pendingCount = assignments.filter(a => !getSubmission(a.id) || getSubmission(a.id)?.status === 'pending').length;
  const completedCount = submissions.filter(s => s.status === 'graded').length;
  const upcomingDeadlines = assignments.filter(a => {
    const days = getDaysUntil(a.dueDate);
    return !days.overdue && days.urgent && (!getSubmission(a.id) || getSubmission(a.id)?.status === 'pending');
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-blue-500/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ListTodo size={18} className="text-blue-400" />
            </div>
            <span className="text-blue-400 text-xs font-medium">{assignments.length} total</span>
          </div>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
          <p className="text-blue-200/40 text-xs mt-1">Pending Assignments</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-green-500/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
            <span className="text-green-400 text-xs font-medium">{completedCount} graded</span>
          </div>
          <p className="text-2xl font-bold text-white">{completedCount}</p>
          <p className="text-blue-200/40 text-xs mt-1">Completed</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-red-500/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertCircle size={18} className="text-red-400" />
            </div>
            <span className="text-red-400 text-xs font-medium">Urgent</span>
          </div>
          <p className="text-2xl font-bold text-white">{upcomingDeadlines}</p>
          <p className="text-blue-200/40 text-xs mt-1">Due Soon</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-yellow-500/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <TasksIcon size={18} className="text-yellow-400" />
            </div>
            <span className="text-yellow-400 text-xs font-medium">{tasks.filter(t => t.status !== 'completed').length} active</span>
          </div>
          <p className="text-2xl font-bold text-white">{tasks.filter(t => t.status === 'completed').length}</p>
          <p className="text-blue-200/40 text-xs mt-1">Tasks Done</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {(['assignments', 'tasks', 'faculty'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-blue-300/50 hover:text-blue-200 hover:bg-white/5'
            }`}
          >
            {tab === 'assignments' && <BookOpen size={16} />}
            {tab === 'tasks' && <ListTodo size={16} />}
            {tab === 'faculty' && <UploadCloud size={16} />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <>
          {/* Filters */}
          <div className="glass-card rounded-xl p-4 border border-white/8 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search size={16} className="text-blue-300/40" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-white text-sm placeholder-blue-300/30 outline-none w-full"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="glass bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"
              >
                <option value="all" className="bg-gray-900">All Subjects</option>
                {subjects.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
              </select>

              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="glass bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"
              >
                <option value="all" className="bg-gray-900">All Priority</option>
                <option value="high" className="bg-gray-900">High</option>
                <option value="medium" className="bg-gray-900">Medium</option>
                <option value="low" className="bg-gray-900">Low</option>
              </select>
            </div>
          </div>

          {/* Assignment Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredAssignments.map((assignment, index) => {
              const submission = getSubmission(assignment.id);
              const days = getDaysUntil(assignment.dueDate);
              const typeConf = typeConfig[assignment.assignmentType];
              const priorityConf = priorityConfig[assignment.priority];
              const subConf = submission ? submissionStatusConfig[submission.status] : submissionStatusConfig.pending;
              const SubjectIcon = subjectIcons[assignment.subject] || BookOpen;

              return (
                <div
                  key={assignment.id}
                  className={`glass-card rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 animate-slide-up ${
                    days.overdue ? 'border-red-500/30' : days.urgent ? 'border-yellow-500/30' : 'border-white/8'
                  }`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${typeConf.bg} flex items-center justify-center`}>
                        <typeConf.icon size={18} className={typeConf.color} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm leading-tight">{assignment.title}</h4>
                        <p className="text-blue-300/50 text-xs mt-0.5">{assignment.subject}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                      {priorityConf.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-blue-200/60 text-sm mb-4 line-clamp-2">{assignment.description}</p>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="glass rounded-lg p-2.5">
                      <p className="text-blue-300/40 text-[10px] uppercase">Faculty</p>
                      <p className="text-white text-xs font-medium">{assignment.facultyName}</p>
                    </div>
                    <div className="glass rounded-lg p-2.5">
                      <p className="text-blue-300/40 text-[10px] uppercase">Max Score</p>
                      <p className="text-white text-xs font-medium">{assignment.maxScore} pts</p>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className={`flex items-center justify-between p-3 rounded-xl mb-4 ${
                    days.overdue ? 'bg-red-500/10 border border-red-500/20' : days.urgent ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className={days.overdue || days.urgent ? 'text-red-400' : 'text-blue-300/50'} />
                      <span className={`text-xs font-medium ${days.overdue || days.urgent ? 'text-red-400' : 'text-blue-200/70'}`}>
                        {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${days.overdue ? 'text-red-400' : days.urgent ? 'text-yellow-400' : 'text-blue-300/50'}`}>
                      {days.text}
                    </span>
                  </div>

                  {/* Submission Status & Action */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${subConf.bg} px-3 py-2 rounded-xl`}>
                      <subConf.icon size={14} className={subConf.color} />
                      <div>
                        <p className={`${subConf.color} text-xs font-medium`}>{subConf.label}</p>
                        {submission?.score !== undefined && (
                          <p className="text-green-400 text-[10px]">Score: {submission.score}/{assignment.maxScore}</p>
                        )}
                      </div>
                    </div>

                    {(!submission || submission.status === 'pending') && (
                      <button
                        onClick={() => setShowUploadModal(assignment.id)}
                        className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-xl transition-all"
                      >
                        <Upload size={12} />
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg">My Tasks</h3>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 text-xs bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl transition-all"
            >
              <Plus size={14} />
              Add Task
            </button>
          </div>

          {/* Add Task Modal */}
          {showAddTask && (
            <div className="glass-card rounded-2xl p-5 border border-blue-500/20 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">New Task</h4>
                <button onClick={() => setShowAddTask(false)} className="text-blue-300/50 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
                />
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setNewTaskPriority(p)}
                      className={`flex-1 text-xs py-2 rounded-xl transition-all ${
                        newTaskPriority === p
                          ? `${priorityConfig[p].bg} ${priorityConfig[p].color} border border-current/30`
                          : 'text-blue-300/40 hover:bg-white/5'
                      }`}
                    >
                      {priorityConfig[p].label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={addTask}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-xl text-sm font-medium"
                >
                  Add Task
                </button>
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.map((task, index) => {
              const statusConf = taskStatusConfig[task.status];
              const priorityConf = priorityConfig[task.priority];
              const StatusIcon = statusConf.icon;

              return (
                <div
                  key={task.id}
                  className={`glass rounded-xl p-4 border transition-all duration-300 ${
                    task.status === 'completed' ? 'border-green-500/20 opacity-60' : 'border-white/8 hover:border-blue-500/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        task.status === 'completed'
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-white/5 border border-white/10 hover:border-blue-500/30'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 size={14} className="text-green-400" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-blue-300/40' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <p className="text-blue-300/40 text-xs mt-0.5">{task.category}</p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-1 rounded-full ${priorityConf.bg} ${priorityConf.color}`}>
                        {priorityConf.label}
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-full ${statusConf.bg} ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-blue-300/30 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Faculty Upload Tab */}
      {activeTab === 'faculty' && (
        <div className="glass-card rounded-2xl p-8 border border-white/8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <UploadCloud size={28} className="text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">Faculty Upload Portal</h3>
            <p className="text-blue-300/50 text-sm max-w-md mx-auto">
              Faculty members can upload assignments and course materials here. Students can view uploaded materials in the Assignments tab.
            </p>
          </div>

          {/* Simulated Upload Form */}
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-xs text-blue-300/60 uppercase tracking-wide mb-1.5 block">Assignment Title</label>
              <input
                type="text"
                placeholder="Enter assignment title..."
                className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-blue-300/60 uppercase tracking-wide mb-1.5 block">Subject</label>
                <select className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none">
                  {subjects.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-blue-300/60 uppercase tracking-wide mb-1.5 block">Type</label>
                <select className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none">
                  {Object.entries(typeConfig).map(([k, v]) => (
                    <option key={k} value={k} className="bg-gray-900">{v.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-blue-300/60 uppercase tracking-wide mb-1.5 block">Due Date</label>
                <input
                  type="datetime-local"
                  className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-blue-300/60 uppercase tracking-wide mb-1.5 block">Priority</label>
                <select className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none">
                  {Object.entries(priorityConfig).map(([k, v]) => (
                    <option key={k} value={k} className="bg-gray-900">{v.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-blue-300/60 uppercase tracking-wide mb-1.5 block">Instructions</label>
              <textarea
                placeholder="Assignment instructions..."
                rows={4}
                className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-blue-300/60 uppercase tracking-wide mb-1.5 block">Attachments</label>
              <div className="glass rounded-xl p-8 border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-blue-500/30 transition-colors">
                <UploadCloud size={32} className="text-blue-400/50 mx-auto mb-2" />
                <p className="text-blue-300/50 text-sm">Click to upload or drag files here</p>
                <p className="text-blue-300/30 text-xs mt-1">PDF, DOC, ZIP (Max 10MB)</p>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <Upload size={16} />
              Upload Assignment
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full border border-white/10 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Submit Assignment</h4>
              <button onClick={() => setShowUploadModal(null)} className="text-blue-300/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="glass rounded-xl p-6 border-2 border-dashed border-white/10 text-center mb-4">
              <UploadCloud size={40} className="text-blue-400/50 mx-auto mb-3" />
              <p className="text-blue-300/60 text-sm">Drop your file here or click to browse</p>
              <p className="text-blue-300/30 text-xs mt-1">PDF, DOC, ZIP, RAR</p>
            </div>

            <textarea
              placeholder="Add notes (optional)..."
              rows={3}
              className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 resize-none mb-4"
            />

            <button
              onClick={() => submitAssignment(showUploadModal)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold transition-all"
            >
              Submit Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper icon component
function TasksIcon({ size }: { size: number }) {
  return <BarChart3 size={size} className="text-yellow-400" />;
}
