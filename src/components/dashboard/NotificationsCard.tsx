import { useState } from 'react';
import { notifications } from '../../data/studentData';
import { Bell, BookOpen, Star, Megaphone, Clock, X, CheckCheck, Trophy } from 'lucide-react';

const typeConfig = {
  assignment: { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  grade: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  announcement: { icon: Megaphone, color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  reminder: { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  achievement: { icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/15' },
};

export default function NotificationsCard() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter(n => !n.read).length;
  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setItems(prev => prev.filter(n => n.id !== id));

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div><h3 className="text-white font-semibold text-lg">Notifications</h3><p className="text-blue-300/50 text-xs mt-0.5">{unread} unread</p></div>
          {unread > 0 && <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{unread}</span>}
        </div>
        {unread > 0 && <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors glass px-3 py-1.5 rounded-lg border border-blue-500/20"><CheckCheck size={12} />Mark all read</button>}
      </div>
      <div className="space-y-2">
        {items.map(notification => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;
          return (
            <div key={notification.id} className={`group flex items-start gap-3 p-3.5 rounded-xl transition-all duration-200 ${!notification.read ? 'glass bg-blue-500/5 border border-blue-500/10' : 'hover:bg-white/5'}`}>
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}><Icon size={14} className={config.color} /></div>
              <div className="flex-1 min-w-0"><p className={`text-sm leading-snug ${notification.read ? 'text-blue-200/50' : 'text-white'}`}>{notification.message}</p><p className="text-blue-300/30 text-xs mt-1">{notification.time}</p></div>
              <div className="flex items-center gap-2 shrink-0">{!notification.read && <div className="w-2 h-2 bg-blue-400 rounded-full" />}<button onClick={() => dismiss(notification.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-300/30 hover:text-blue-300 p-0.5 rounded"><X size={12} /></button></div>
            </div>
          );
        })}
      </div>
      {items.length === 0 && (<div className="flex flex-col items-center justify-center py-10 text-blue-300/30"><Bell size={32} className="mb-3 opacity-30" /><p className="text-sm">All caught up!</p></div>)}
    </div>
  );
}
