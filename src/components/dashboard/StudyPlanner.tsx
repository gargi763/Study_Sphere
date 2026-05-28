import { useState } from 'react';
import { studyPlan } from '../../data/studentData';
import { CheckCircle2, Circle, Clock, Plus, Coffee } from 'lucide-react';

export default function StudyPlanner() {
  const [items, setItems] = useState(studyPlan);
  const completed = items.filter(i => i.completed).length;
  const total = items.length;
  const toggleItem = (id: number) => setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  const nowHour = new Date().getHours();
  const nowMin = new Date().getMinutes();

  function isCurrentSlot(time: string, duration: number) {
    const [h, m] = time.split(':').map(Number);
    const startMins = h * 60 + m;
    const endMins = startMins + duration;
    const nowMins = nowHour * 60 + nowMin;
    return nowMins >= startMins && nowMins < endMins;
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div><h3 className="text-white font-semibold text-lg">Study Planner</h3><p className="text-blue-300/50 text-xs mt-0.5">Today's schedule</p></div>
        <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors glass px-3 py-1.5 rounded-lg border border-blue-500/20"><Plus size={12} />Add</button>
      </div>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2"><span className="text-blue-300/50 text-xs">{completed}/{total} completed</span><span className="text-blue-300/50 text-xs">{Math.round((completed / total) * 100)}%</span></div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700" style={{ width: `${(completed / total) * 100}%` }} /></div>
      </div>
      <div className="space-y-2">
        {items.map(item => {
          const isCurrent = isCurrentSlot(item.time, item.duration);
          const hrs = Math.floor(item.duration / 60);
          const mins = item.duration % 60;
          const durationLabel = hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;
          return (
            <div key={item.id} className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${item.isBreak ? 'opacity-60' : item.completed ? 'opacity-50' : isCurrent ? 'glass border border-blue-500/30 bg-blue-500/5' : 'hover:bg-white/5'}`} onClick={() => !item.isBreak && toggleItem(item.id)}>
              <div className="relative flex flex-col items-center shrink-0" style={{ width: 28 }}>
                <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: item.color, opacity: item.completed ? 0.4 : 1 }} />
                {isCurrent && <div className="absolute w-5 h-5 rounded-full animate-ping" style={{ background: item.color, opacity: 0.2 }} />}
              </div>
              <div className="shrink-0 w-12"><span className="text-blue-300/40 text-xs">{item.time}</span></div>
              <div className="w-1 h-8 rounded-full shrink-0" style={{ background: item.color, opacity: item.completed ? 0.3 : 0.7 }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {item.isBreak && <Coffee size={12} className="text-green-400 shrink-0" />}
                  <p className={`text-sm font-medium truncate ${item.completed ? 'line-through text-blue-300/30' : 'text-white'}`}>{item.subject}</p>
                  {isCurrent && <span className="text-xs text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded-full shrink-0">Now</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5"><Clock size={10} className="text-blue-300/30" /><span className="text-blue-300/30 text-[10px]">{durationLabel}</span></div>
              </div>
              {!item.isBreak && (<div className="shrink-0">{item.completed ? <CheckCircle2 size={16} className="text-green-400" /> : <Circle size={16} className="text-blue-300/20 group-hover:text-blue-300/40 transition-colors" />}</div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
