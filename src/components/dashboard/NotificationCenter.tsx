import { useState, useEffect, useRef } from 'react';
import { Bell, X, Eye, EyeOff, Trash2, Settings } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useData';
import type { Tables } from '../../types/database';

type NotificationRow = Tables<'notifications'>;

interface NotificationCenterProps {
  unreadCount?: number;
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
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

const typeIcons: Record<string, { icon: string; color: string }> = {
  assignment: { icon: 'A', color: 'from-blue-500 to-cyan-500' },
  grade: { icon: 'G', color: 'from-green-500 to-teal-500' },
  announcement: { icon: '!', color: 'from-yellow-500 to-orange-500' },
  reminder: { icon: 'R', color: 'from-purple-500 to-pink-500' },
  achievement: { icon: '*', color: 'from-emerald-500 to-cyan-500' },
};

export default function NotificationCenter({ unreadCount: propUnreadCount }: NotificationCenterProps) {
  const { user } = useAuthContext() as any;
  const userId = user?.id ?? null;
  const { notifications, loading, markAsRead, markAllRead, deleteNotification, unreadCount: hookUnreadCount } = useNotifications(userId);

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = propUnreadCount ?? hookUnreadCount;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    try { await markAsRead(id); } catch {}
  };

  const handleMarkAllRead = async () => {
    try { await markAllRead(); } catch {}
  };

  const handleDismiss = async (id: string) => {
    try { await deleteNotification(id); } catch {}
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all ${
          isOpen
            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-blue-300/60 hover:text-slate-900 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-white/5'
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[600px] glass-card rounded-2xl border transition-theme border-slate-200/50 dark:border-white/8 shadow-2xl z-50 animate-slide-up overflow-hidden flex flex-col">
          <div className="border-b transition-theme border-slate-200/50 dark:border-white/5 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg transition-colors">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-slate-600 dark:text-blue-300/50 text-xs mt-0.5 transition-colors">{unreadCount} unread</p>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-blue-300/50 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setFilter('all')} className={`flex-1 text-xs py-2 px-3 rounded-lg transition-all ${filter === 'all' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30' : 'text-slate-600 dark:text-blue-300/50 hover:bg-slate-100 dark:hover:bg-white/5'}`}>All</button>
              <button onClick={() => setFilter('unread')} className={`flex-1 text-xs py-2 px-3 rounded-lg transition-all ${filter === 'unread' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30' : 'text-slate-600 dark:text-blue-300/50 hover:bg-slate-100 dark:hover:bg-white/5'}`}>Unread</button>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors" title="Mark all as read">
                  <Eye size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-600 dark:text-blue-300/50 text-sm mt-2">Loading...</p>
              </div>
            ) : visibleNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell size={32} className="text-slate-400 dark:text-blue-300/20 mb-2" />
                <p className="text-slate-600 dark:text-blue-300/50 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/50 dark:divide-white/5">
                {visibleNotifications.map((notif) => {
                  const meta = typeIcons[notif.type] || typeIcons.announcement;
                  return (
                    <div key={notif.id} className={`p-4 transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-500/5 border-l-2 border-blue-500/30' : ''}`}>
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center shrink-0`}>
                          <span className="text-white text-sm font-bold">{meta.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.read ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-blue-300/70'} transition-colors line-clamp-2`}>
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-500 dark:text-blue-300/40 mt-1 block transition-colors">{formatTime(notif.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notif.read && (
                            <button onClick={() => handleMarkAsRead(notif.id)} className="text-slate-400 dark:text-blue-300/40 hover:text-slate-600 dark:hover:text-blue-300 p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition-all" title="Mark as read">
                              <EyeOff size={14} />
                            </button>
                          )}
                          <button onClick={() => handleDismiss(notif.id)} className="text-slate-400 dark:text-blue-300/40 hover:text-red-500 dark:hover:text-red-400 p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition-all" title="Dismiss">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t transition-theme border-slate-200/50 dark:border-white/5 p-3 flex gap-2">
            <button className="flex-1 text-xs py-2 px-3 rounded-lg text-slate-600 dark:text-blue-300/50 hover:text-slate-900 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-1">
              <Settings size={12} /> Settings
            </button>
            <button className="flex-1 text-xs py-2 px-3 rounded-lg text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/15 transition-all">
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
