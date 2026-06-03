import { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import TopBar from './dashboard/TopBar';
import OverviewSection from './dashboard/OverviewSection';
import AttendanceCard from './dashboard/AttendanceCard';
import AttendanceManagement from './dashboard/AttendanceManagement';
import AssignmentManagement from './dashboard/AssignmentManagement';
import ExpenseManagement from './dashboard/ExpenseManagement';
import AIRecommendations from './dashboard/AIRecommendations';
import StudentAnalytics from './dashboard/StudentAnalytics';
import AssignmentsCard from './dashboard/AssignmentsCard';
import NotificationsCard from './dashboard/NotificationsCard';
import ExpenseCard from './dashboard/ExpenseCard';
import StudyPlanner from './dashboard/StudyPlanner';
import AnalyticsCard from './dashboard/AnalyticsCard';
import { notifications } from '../data/studentData';

interface DashboardProps {
  onNavigate: (page: 'landing' | 'login' | 'dashboard') => void;
}

const sectionTitles: Record<string, string> = {
  overview: 'Overview',
  'student-analytics': 'Student Analytics',
  'ai-recommendations': 'AI Insights',
  'attendance-mgmt': 'Attendance Management',
  'assignment-mgmt': 'Assignment Management',
  'expense-mgmt': 'Expense Management',
  attendance: 'Attendance',
  assignments: 'Assignments',
  planner: 'Study Planner',
  expenses: 'Expenses',
  analytics: 'Analytics',
  notifications: 'Notifications'
};

function SectionContent({ section }: { section: string }) {
  switch (section) {
    case 'overview': return <OverviewSection />;
    case 'student-analytics': return <StudentAnalytics />;
    case 'ai-recommendations': return <AIRecommendations />;
    case 'attendance-mgmt': return <AttendanceManagement />;
    case 'assignment-mgmt': return <AssignmentManagement />;
    case 'expense-mgmt': return <ExpenseManagement />;
    case 'attendance': return <div className="max-w-2xl animate-fade-in"><AttendanceCard /></div>;
    case 'assignments': return <div className="max-w-2xl animate-fade-in"><AssignmentsCard /></div>;
    case 'planner': return <div className="max-w-2xl animate-fade-in"><StudyPlanner /></div>;
    case 'expenses': return <div className="max-w-xl animate-fade-in"><ExpenseCard /></div>;
    case 'analytics': return <div className="max-w-xl animate-fade-in"><AnalyticsCard /></div>;
    case 'notifications': return <div className="max-w-xl animate-fade-in"><NotificationsCard /></div>;
    default: return <OverviewSection />;
  }
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-mesh flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(prev => !prev)} onNavigate={onNavigate} unreadCount={unreadCount} />
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <TopBar onSectionChange={setActiveSection} />
        <div className="flex-1 overflow-auto">
          <div className="p-8 md:p-10 lg:p-12">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-blue-300/30 dark:text-blue-300/30 text-sm">Dashboard</span>
              {activeSection !== 'overview' && (<><span className="text-blue-300/20 dark:text-blue-300/20 text-sm">/</span><span className="text-blue-300/60 dark:text-blue-300/60 text-sm font-medium">{sectionTitles[activeSection]}</span></>)}
            </div>
            <SectionContent section={activeSection} />
          </div>
        </div>
      </main>
    </div>
  );
}
