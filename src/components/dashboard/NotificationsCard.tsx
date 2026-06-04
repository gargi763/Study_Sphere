import { Bell, BookOpen, Star, Megaphone, Clock, X, CheckCheck, Trophy } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useData';

const typeConfig: Record<string, { icon: typeof BookOpen; color: string; bg: string }> = {
  assignment: { icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/15' },
  grade: { icon: Star, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/15' },
  announcement: { icon: Megaphone, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/15' },
  reminder: { icon: Clock, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/15' },
  achievement: { icon: Trophy, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/15' },
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffMs / 86400000);
  return `${diffDays}d ago`;
};

export default function NotificationsCard() {
  const { user } = useAuthContext();
  const { notifications, loading, markAllRead, deleteNotification, unreadCount } = useNotifications(user?.id ?? null);

  const handleMarkAllRead = async () => {
    try { await markAllRead(); } catch {}
  };

  const handleDismiss = async (id: string) => {
    try { await deleteNotification(id); } catch {}
  };

  return (
    <div className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/8 hover:border-slate-400/40 dark:hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div><h3 className="text-slate-900 dark:text-white font-semibold text-lg transition-colors">Notifications</h3><p className="text-slate-600 dark:text-blue-300/50 text-xs mt-0.5 transition-colors">{unreadCount} unread</p></div>
          {unreadCount > 0 && <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors glass rounded-lg px-3 py-1.5 border border-blue-500/20"><CheckCheck size={12} />Mark all read</button>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-blue-300/30">
          <Bell size={32} className="mb-3 opacity-30" />
          <p className="text-sm">All caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.slice(0, 5).map(notification => {
            const config = typeConfig[notification.type] || typeConfig.announcement;
            const Icon = config.icon;
            return (
              <div key={notification.id} className={`group flex items-start gap-3 p-3.5 rounded-xl transition-all duration-200 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}><Icon size={14} className={config.color} /></div>
                <div className="flex-1 min-w-0"><p className={`text-sm leading-snug ${notification.read ? 'text-slate-500 dark:text-blue-200/50' : 'text-slate-900 dark:text-white'} transition-colors`}>{notification.message}</p><p className="text-slate-500 dark:text-blue-300/30 text-xs mt-1 transition-colors">{formatTime(notification.created_at)}</p></div>
                <div className="flex items-center gap-2 shrink-0">{!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}<button onClick={() => handleDismiss(notification.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 dark:text-blue-300/30 hover:text-slate-600 dark:hover:text-blue-300 p-0.5 rounded"><X size={12} /></button></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
