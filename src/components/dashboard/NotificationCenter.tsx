import { useState, useEffect, useRef } from 'react';
import {
  Bell, X, Clock, AlertCircle, FileText, DollarSign, BookOpen,
  CheckCircle2, Trash2, Eye, EyeOff, Calendar, Zap, GraduationCap,
  ChevronRight, Filter, Settings
} from 'lucide-react';

type NotificationType = 'assignment' | 'attendance' | 'exam' | 'expense' | 'general';
type NotificationStatus = 'unread' | 'read' | 'dismissed';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  status: NotificationStatus;
  icon: React.ElementType;
  color: string;
  actionText?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'assignment',
    title: 'Data Structures Assignment Due',
    message: 'Binary Tree implementation assignment due in 2 hours',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'unread',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    actionText: 'View Assignment',
    actionUrl: '/assignments',
  },
  {
    id: '2',
    type: 'exam',
    title: 'Operating Systems Midterm',
    message: 'Midterm exam scheduled for March 15, 2025 at 10:00 AM',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'unread',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500',
    actionText: 'View Details',
    actionUrl: '/exams',
  },
  {
    id: '3',
    type: 'attendance',
    title: 'Low Attendance Alert',
    message: 'Your attendance in Database Systems is below 75%. Attend more classes.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'unread',
    icon: AlertCircle,
    color: 'from-red-500 to-orange-500',
    actionText: 'View Schedule',
    actionUrl: '/attendance',
  },
  {
    id: '4',
    type: 'expense',
    title: 'Monthly Expense Due',
    message: 'Your shared apartment expense payment is due tomorrow',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'read',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    actionText: 'Pay Now',
    actionUrl: '/expenses',
  },
  {
    id: '5',
    type: 'assignment',
    title: 'Assignment Graded',
    message: 'Your Database Systems project has been graded. Score: 92/100',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'read',
    icon: CheckCircle2,
    color: 'from-green-500 to-teal-500',
  },
  {
    id: '6',
    type: 'general',
    title: 'Study Group Reminder',
    message: 'Your study group meets today at 6 PM in the library',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'read',
    icon: Calendar,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: '7',
    type: 'exam',
    title: 'Quiz Scheduled',
    message: 'Quick assessment for Computer Networks on March 10, 2025',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'dismissed',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-400',
  },
  {
    id: '8',
    type: 'attendance',
    title: 'Perfect Attendance',
    message: 'You have perfect attendance in Software Engineering this month!',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'read',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-500',
  },
];

const formatTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const visibleNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.status === 'unread';
    return n.status !== 'dismissed';
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, status: 'read' as const } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => n.status === 'unread' ? { ...n, status: 'read' as const } : n)
    );
  };

  const dismiss = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, status: 'dismissed' as const } : n)
    );
  };

  const getNotificationIcon = (notif: Notification) => {
    const Icon = notif.icon;
    return <Icon size={18} className="text-white" />;
  };

  const notificationsByType = {
    assignment: visibleNotifications.filter(n => n.type === 'assignment'),
    attendance: visibleNotifications.filter(n => n.type === 'attendance'),
    exam: visibleNotifications.filter(n => n.type === 'exam'),
    expense: visibleNotifications.filter(n => n.type === 'expense'),
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all ${
          isOpen
            ? 'bg-blue-500/20 text-blue-400'
            : 'text-blue-300/60 hover:text-blue-300 hover:bg-white/5'
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[600px] glass-card rounded-2xl border border-white/8 shadow-2xl z-50 animate-slide-up overflow-hidden flex flex-col">
          {/* Header */}
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-blue-300/50 text-xs mt-0.5">{unreadCount} unread</p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-300/50 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter and Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 text-xs py-2 px-3 rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-blue-300/50 hover:bg-white/5'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 text-xs py-2 px-3 rounded-lg transition-all ${
                  filter === 'unread'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-blue-300/50 hover:bg-white/5'
                }`}
              >
                Unread
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-white/5"
                  title="Mark all as read"
                >
                  <Eye size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell size={32} className="text-blue-300/20 mb-2" />
                <p className="text-blue-300/50 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {visibleNotifications.map((notif, index) => (
                  <div
                    key={notif.id}
                    className={`p-4 transition-all hover:bg-white/5 ${
                      notif.status === 'unread' ? 'bg-blue-500/5 border-l-2 border-blue-500/30' : ''
                    } ${index === 0 ? 'pt-4' : ''} ${index === visibleNotifications.length - 1 ? 'pb-4' : ''}`}
                    style={{
                      animation: notif.status === 'unread' ? 'fadeIn 0.5s ease-out' : 'none',
                    }}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${notif.color} flex items-center justify-center shrink-0`}
                      >
                        {getNotificationIcon(notif)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-semibold ${notif.status === 'unread' ? 'text-white' : 'text-blue-300/70'}`}>
                            {notif.title}
                          </h4>
                          {notif.status === 'unread' && (
                            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className={`text-xs mt-1 line-clamp-2 ${notif.status === 'unread' ? 'text-blue-200/70' : 'text-blue-300/50'}`}>
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-2 gap-2">
                          <span className="text-[10px] text-blue-300/40">{formatTime(notif.timestamp)}</span>
                          {notif.actionText && (
                            <a
                              href={notif.actionUrl}
                              className="text-blue-400 text-[10px] hover:text-blue-300 flex items-center gap-0.5"
                            >
                              {notif.actionText}
                              <ChevronRight size={10} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {notif.status === 'unread' && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-blue-300/40 hover:text-blue-300 p-1 rounded hover:bg-white/5 transition-all"
                            title="Mark as read"
                          >
                            <EyeOff size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(notif.id)}
                          className="text-blue-300/40 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-all"
                          title="Dismiss"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 p-3 flex gap-2">
            <button className="flex-1 text-xs py-2 px-3 rounded-lg text-blue-300/50 hover:text-blue-300 hover:bg-white/5 transition-all flex items-center justify-center gap-1">
              <Settings size={12} />
              Settings
            </button>
            <button className="flex-1 text-xs py-2 px-3 rounded-lg text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/15 transition-all">
              View All
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
