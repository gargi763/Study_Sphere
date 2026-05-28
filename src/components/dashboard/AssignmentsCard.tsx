import { useState } from 'react';
import { assignments } from '../../data/studentData';
import { CheckCircle2, Clock, AlertCircle, ChevronRight, Plus } from 'lucide-react';

const priorityConfig = { high: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'High' }, medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/15', label: 'Medium' }, low: { color: 'text-green-400', bg: 'bg-green-500/15', label: 'Low' } };
const statusConfig = { completed: { icon: CheckCircle2, color: 'text-green-400' }, 'in-progress': { icon: Clock, color: 'text-yellow-400' }, pending: { icon: AlertCircle, color: 'text-blue-400' } };

function getDaysUntil(dateStr: string) {
  const now = new Date();
  const due = new Date(dateStr);
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `${diff} days left`;
}

export default function AssignmentsCard() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const filtered = assignments.filter(a => filter === 'all' ? true : filter === 'pending' ? a.status !== 'completed' : a.status === 'completed');

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div><h3 className="text-white font-semibold text-lg">Assignments</h3><p className="text-blue-300/50 text-xs mt-0.5">{assignments.filter(a => a.status !== 'completed').length} pending</p></div>
        <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors glass px-3 py-1.5 rounded-lg border border-blue-500/20"><Plus size={12} />Add</button>
      </div>
      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'completed'] as const).map(f => (<button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-lg transition-all capitalize ${filter === f ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-blue-300/40 hover:text-blue-200 hover:bg-white/5'}`}>{f}</button>))}
      </div>
      <div className="space-y-3">
        {filtered.map(assignment => {
          const priority = priorityConfig[assignment.priority];
          const status = statusConfig[assignment.status];
          const StatusIcon = status.icon;
          const daysText = getDaysUntil(assignment.dueDate);
          const isOverdue = daysText === 'Overdue';
          return (
            <div key={assignment.id} className={`glass rounded-xl p-4 hover:bg-white/8 transition-all duration-200 cursor-pointer group border ${assignment.status === 'completed' ? 'border-green-500/10 opacity-70' : 'border-white/5 hover:border-blue-500/20'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <StatusIcon size={16} className={`shrink-0 mt-0.5 ${status.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${assignment.status === 'completed' ? 'line-through text-blue-300/40' : 'text-white'}`}>{assignment.title}</p>
                    <p className="text-blue-300/40 text-xs mt-0.5">{assignment.subject}</p>
                    {assignment.status !== 'completed' && (<div className="mt-2"><div className="flex items-center justify-between mb-1"><span className="text-[10px] text-blue-300/40">Progress</span><span className="text-[10px] text-blue-300/50">{assignment.progress}%</span></div><div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${assignment.progress}%` }} /></div></div>)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priority.bg} ${priority.color}`}>{priority.label}</span>
                  <span className={`text-[10px] font-medium ${isOverdue ? 'text-red-400' : 'text-blue-300/40'}`}>{daysText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full mt-3 text-xs text-blue-400/60 hover:text-blue-300 transition-colors py-2 flex items-center justify-center gap-1">View all assignments<ChevronRight size={12} /></button>
    </div>
  );
}
