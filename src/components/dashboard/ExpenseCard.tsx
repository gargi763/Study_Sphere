import { expenses } from '../../data/studentData';
import { TrendingDown, DollarSign, BookOpen, Utensils, Car, Tv, Pen } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { book: BookOpen, utensils: Utensils, car: Car, tv: Tv, pen: Pen };

export default function ExpenseCard() {
  const { budget, spent, categories, monthly } = expenses;
  const remaining = budget - spent;
  const spentPercent = (spent / budget) * 100;
  const maxMonthly = Math.max(...monthly.map(m => m.amount));

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div><h3 className="text-white font-semibold text-lg">Expenses</h3><p className="text-blue-300/50 text-xs mt-0.5">Monthly budget tracker</p></div>
        <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center"><DollarSign size={16} className="text-green-400" /></div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20 shrink-0">
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="40" cy="40" r="30" fill="none" stroke={spentPercent > 85 ? '#ef4444' : '#22c55e'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(spentPercent / 100) * 188.5} 188.5`} style={{ filter: `drop-shadow(0 0 6px ${spentPercent > 85 ? '#ef444460' : '#22c55e60'})`, transition: 'stroke-dasharray 1s ease' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-white text-xs font-bold">{Math.round(spentPercent)}%</span></div>
        </div>
        <div><p className="text-2xl font-bold text-white">${spent}</p><p className="text-blue-200/50 text-xs">of ${budget} budget</p><div className={`flex items-center gap-1 text-xs mt-2 ${remaining > 200 ? 'text-green-400' : 'text-yellow-400'}`}><TrendingDown size={11} />${remaining} remaining</div></div>
      </div>
      <div className="space-y-2.5 mb-5">
        {categories.map(cat => {
          const Icon = iconMap[cat.icon] || BookOpen;
          const catPercent = (cat.amount / spent) * 100;
          return (
            <div key={cat.name} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cat.color}20` }}><Icon size={12} style={{ color: cat.color }} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1"><span className="text-blue-200/60 text-xs truncate">{cat.name}</span><span className="text-white text-xs font-medium ml-2 shrink-0">${cat.amount}</span></div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${catPercent}%`, background: cat.color, opacity: 0.8 }} /></div>
              </div>
            </div>
          );
        })}
      </div>
      <div><p className="text-blue-300/40 text-xs mb-3">Monthly Spending</p><div className="flex items-end gap-2 h-16">{monthly.map((m, i) => { const h = (m.amount / maxMonthly) * 100; const isLast = i === monthly.length - 1; return (<div key={m.month} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-white/5 rounded-t overflow-hidden" style={{ height: 48 }}><div className="w-full rounded-t transition-all duration-1000" style={{ height: `${h}%`, marginTop: 'auto', background: isLast ? 'linear-gradient(180deg, #22c55e, #16a34a)' : 'linear-gradient(180deg, #3b82f6, #1d4ed8)', opacity: isLast ? 1 : 0.5 }} /></div><span className={`text-[10px] ${isLast ? 'text-green-400' : 'text-blue-300/30'}`}>{m.month}</span></div>); })}</div></div>
    </div>
  );
}
