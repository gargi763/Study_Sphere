import React, { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import TopBar from './dashboard/TopBar';
import Footer from './Footer';
import { useAuthContext } from '../context/AuthContext';

// Student sections
import OverviewSection from './dashboard/OverviewSection';
import StudentProfilePage from './dashboard/StudentProfilePage';
import StudentAnalytics from './dashboard/StudentAnalytics';
import AIRecommendations from './dashboard/AIRecommendations';
import AttendanceManagement from './dashboard/AttendanceManagement';
import AssignmentManagement from './dashboard/AssignmentManagement';
import ExpenseManagement from './dashboard/ExpenseManagement';
import AttendanceCard from './dashboard/AttendanceCard';
import AssignmentsCard from './dashboard/AssignmentsCard';
import NotificationsCard from './dashboard/NotificationsCard';
import StudyPlanner from './dashboard/StudyPlanner';

// Faculty sections
import FacultyDashboard from './dashboard/faculty/FacultyDashboard';
import FacultyOverview from './dashboard/faculty/FacultyOverview';

// Admin sections
import AdminOverview from './dashboard/admin/AdminOverview';

// Shared
import UserProfilePage from './dashboard/UserProfilePage';

function StudentContent({ section }: { section: string }) {
  switch (section) {
    case 'overview': return <OverviewSection />;
    case 'student-profile': return <StudentProfilePage />;
    case 'analytics': return <StudentAnalytics />;
    case 'ai-insights': return <AIRecommendations />;
    case 'attendance-management': return <AttendanceManagement />;
    case 'assignment-management': return <AssignmentManagement />;
    case 'expense-management': return <ExpenseManagement />;
    case 'attendance': return <div className="p-6"><AttendanceCard /></div>;
    case 'assignments': return <div className="p-6"><AssignmentsCard /></div>;
    case 'study-planner': return <div className="p-6"><StudyPlanner /></div>;
    case 'notifications': return <div className="p-6"><NotificationsCard /></div>;
    default: return <OverviewSection />;
  }
}

function FacultyContent({ section }: { section: string }) {
  switch (section) {
    case 'dashboard':
      return <FacultyDashboard />;
    case 'overview':
    case 'my-courses':
    case 'students':
    case 'assignments':
    case 'attendance':
    case 'analytics':
      return <FacultyOverview />;
    case 'notifications':
      return <div className="p-6"><NotificationsCard /></div>;
    default:
      return <FacultyDashboard />;
  }
}

function AdminContent({ section }: { section: string }) {
  switch (section) {
    case 'overview':
    case 'users':
    case 'departments':
    case 'courses':
    case 'analytics':
    case 'reports':
      return <AdminOverview />;
    case 'notifications':
      return <div className="p-6"><NotificationsCard /></div>;
    default:
      return <AdminOverview />;
  }
}

export default function Dashboard() {
  const { role } = useAuthContext();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSectionChange = (section: string) => setActiveSection(section);

  const renderContent = () => {
    if (activeSection === 'profile') {
      return <UserProfilePage />;
    }
    if (role === 'faculty') return <FacultyContent section={activeSection} />;
    if (role === 'admin') return <AdminContent section={activeSection} />;
    return <StudentContent section={activeSection} />;
  };

  return (
    <div className="min-h-screen bg-mesh">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        onProfileClick={() => setActiveSection('profile')}
      />
      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}
      >
        <div className="min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
        <Footer />
      </main>
    </div>
  );
}
