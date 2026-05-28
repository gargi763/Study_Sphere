import { useState, useEffect } from 'react';
import {
  DollarSign, Utensils, Car, Tv, Lightbulb, Package, MoreHorizontal,
  Plus, Users, PieChart as PieChartIcon, BarChart3, Table2, Calendar,
  TrendingUp, TrendingDown, CheckCircle2, X, ChevronRight, UserPlus, Receipt
} from 'lucide-react';

type ExpenseCategory = 'food' | 'transport' | 'entertainment' | 'utilities' | 'supplies' | 'other';

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  isShared: boolean;
  splitWith: string[];
  splitAmount: number;
}

interface Roommate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isActive: boolean;
}

interface Settlement {
  id: string;
  expenseId: string;
  fromUser: string;
  toUser: string;
  amount: number;
  isSettled: boolean;
}

const categoryConfig: Record<ExpenseCategory, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  food: { label: 'Food & Dining', color: '#10b981', bgColor: 'bg-green-500/15', icon: Utensils },
  transport: { label: 'Transport', color: '#f59e0b', bgColor: 'bg-yellow-500/15', icon: Car },
  entertainment: { label: 'Entertainment', color: '#ef4444', bgColor: 'bg-red-500/15', icon: Tv },
  utilities: { label: 'Utilities', color: '#3b82f6', bgColor: 'bg-blue-500/15', icon: Lightbulb },
  supplies: { label: 'Supplies', color: '#8b5cf6', bgColor: 'bg-purple-500/15', icon: Package },
  other: { label: 'Other', color: '#6b7280', bgColor: 'bg-gray-500/15', icon: MoreHorizontal },
};

const mockRoommates: Roommate[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@email.com', avatar: 'AJ', isActive: true },
  { id: '2', name: 'Sam Wilson', email: 'sam@email.com', avatar: 'SW', isActive: true },
  { id: '3', name: 'Jordan Lee', email: 'jordan@email.com', avatar: 'JL', isActive: true },
];

const generateMockExpenses = (): Expense[] => {
  const expenses: Expense[] = [];
  const categories: ExpenseCategory[] = ['food', 'transport', 'entertainment', 'utilities', 'supplies', 'other'];
  const titles: Record<ExpenseCategory, string[]> = {
    food: ['Grocery shopping', 'Restaurant dinner', 'Coffee run', 'Pizza night'],
    transport: ['Gas refill', 'Uber ride', 'Bus pass', 'Parking fee'],
    entertainment: ['Movie tickets', 'Concert', 'Netflix subscription', 'Game purchase'],
    utilities: ['Electricity bill', 'Water bill', 'Internet', 'Heating'],
    supplies: ['Textbooks', 'Stationery', 'Printer paper', 'USB drive'],
    other: ['Online course', 'Gym membership', 'Misc purchase', 'Gift'],
  };

  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const category = categories[Math.floor(Math.random() * categories.length)];
    const title = titles[category][Math.floor(Math.random() * titles[category].length)];
    const amount = Math.floor(Math.random() * 150) + 10;
    const isShared = Math.random() > 0.6;
    const splitWith = isShared
      ? mockRoommates.filter(() => Math.random() > 0.4).map(r => r.name)
      : [];

    expenses.push({
      id: `exp-${i}`,
      title,
      description: '',
      amount,
      category,
      date: date.toISOString().split('T')[0],
      isShared,
      splitWith,
      splitAmount: isShared && splitWith.length > 0 ? amount / (splitWith.length + 1) : amount,
    });
  }
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function ExpenseManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'shared' | 'history' | 'analytics'>('overview');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [roommates] = useState<Roommate[]>(mockRoommates);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddRoommate, setShowAddRoommate] = useState(false);
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  // New expense form
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('food');
  const [newIsShared, setNewIsShared] = useState(false);
  const [newSplitWith, setNewSplitWith] = useState<string[]>([]);

  // New roommate form
  const [newRoommateName, setNewRoommateName] = useState('');

  useEffect(() => {
    setExpenses(generateMockExpenses());
  }, []);

  const totalThisMonth = expenses
    .filter(e => e.date.startsWith(filterMonth))
    .reduce((sum, e) => sum + (e.isShared ? e.splitAmount : e.amount), 0);

  const totalShared = expenses
    .filter(e => e.isShared && e.date.startsWith(filterMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals: Record<ExpenseCategory, number> = {
    food: 0, transport: 0, entertainment: 0, utilities: 0, supplies: 0, other: 0,
  };

  expenses.filter(e => e.date.startsWith(filterMonth)).forEach(e => {
    const amount = e.isShared ? e.splitAmount : e.amount;
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + amount;
  });

  const addExpense = () => {
    if (!newTitle.trim() || !newAmount) return;

    const amount = parseFloat(newAmount);
    const splitWith = newIsShared ? newSplitWith : [];
    const splitAmount = newIsShared && splitWith.length > 0 ? amount / (splitWith.length + 1) : amount;

    const expense: Expense = {
      id: `exp-${Date.now()}`,
      title: newTitle,
      description: '',
      amount,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      isShared: newIsShared,
      splitWith,
      splitAmount,
    };

    setExpenses(prev => [expense, ...prev]);
    setNewTitle('');
    setNewAmount('');
    setNewCategory('food');
    setNewIsShared(false);
    setNewSplitWith([]);
    setShowAddExpense(false);
  };

  const toggleSplitWith = (name: string) => {
    setNewSplitWith(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const settleUp = (settlementId: string) => {
    setSettlements(prev =>
      prev.map(s => s.id === settlementId ? { ...s, isSettled: true, settledAt: new Date().toISOString() } : s)
    );
  };

  const filteredExpenses = expenses.filter(e => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    return true;
  });

  // Pie chart data
  const totalCategorySpending = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const pieData = Object.entries(categoryTotals)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalCategorySpending > 0 ? (amount / totalCategorySpending) * 100 : 0,
    }));

  // Calculate settlements owed
  const calculateSettlements = () => {
    const balances: Record<string, number> = {};
    roommates.forEach(r => balances[r.name] = 0);
    balances['Me'] = 0;

    expenses.filter(e => e.isShared).forEach(expense => {
      const splitAmount = expense.splitAmount;
      // The payer paid the full amount
      balances['Me'] += expense.amount;
      // Each person owes their share
      expense.splitWith.forEach(person => {
        balances[person] = (balances[person] || 0) - splitAmount;
      });
      // Me also owes my share
      balances['Me'] -= splitAmount;
    });

    return Object.entries(balances)
      .filter(([name]) => name !== 'Me')
      .map(([name, balance]) => ({
        name,
        balance,
        owes: balance < 0,
      }));
  };

  const settlementsList = calculateSettlements();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {(['overview', 'shared', 'history', 'analytics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-blue-300/50 hover:text-blue-200 hover:bg-white/5'
            }`}
          >
            {tab === 'overview' && <DollarSign size={16} />}
            {tab === 'shared' && <Users size={16} />}
            {tab === 'history' && <Table2 size={16} />}
            {tab === 'analytics' && <PieChartIcon size={16} />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-blue-500/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <DollarSign size={18} className="text-blue-400" />
                </div>
                <span className="text-blue-400 text-xs font-medium">{filterMonth}</span>
              </div>
              <p className="text-2xl font-bold text-white">${totalThisMonth.toFixed(2)}</p>
              <p className="text-blue-200/40 text-xs mt-1">Total Expenses</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-purple-500/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Users size={18} className="text-purple-400" />
                </div>
                <span className="text-purple-400 text-xs font-medium">{expenses.filter(e => e.isShared).length} shared</span>
              </div>
              <p className="text-2xl font-bold text-white">${totalShared.toFixed(2)}</p>
              <p className="text-blue-200/40 text-xs mt-1">Shared Total</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-green-500/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp size={18} className="text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{roommates.length + 1}</p>
              <p className="text-blue-200/40 text-xs mt-1">People Sharing</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-yellow-500/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Receipt size={18} className="text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{expenses.filter(e => e.date.startsWith(filterMonth)).length}</p>
              <p className="text-blue-200/40 text-xs mt-1">Transactions</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowAddExpense(true)}
              className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/30 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Add Expense</p>
                <p className="text-blue-300/50 text-xs">Track a new expense</p>
              </div>
              <ChevronRight size={20} className="ml-auto text-blue-300/30 group-hover:text-blue-300 transition-colors" />
            </button>

            <button
              onClick={() => setActiveTab('shared')}
              className="glass-card rounded-2xl p-6 border border-white/8 hover:border-purple-500/30 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={24} className="text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Split Expenses</p>
                <p className="text-blue-300/50 text-xs">Manage shared costs</p>
              </div>
              <ChevronRight size={20} className="ml-auto text-blue-300/30 group-hover:text-blue-300 transition-colors" />
            </button>
          </div>

          {/* Category Breakdown */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-4">Category Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(categoryTotals).map(([category, amount]) => {
                const config = categoryConfig[category as ExpenseCategory];
                return (
                  <div key={category} className="glass rounded-xl p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                      <config.icon size={18} style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">${amount.toFixed(2)}</p>
                      <p className="text-blue-300/40 text-xs truncate">{config.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Recent Transactions</h3>
              <button onClick={() => setActiveTab('history')} className="text-blue-400 text-xs hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-2">
              {expenses.slice(0, 5).map(expense => {
                const config = categoryConfig[expense.category];
                return (
                  <div key={expense.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                    <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                      <config.icon size={16} style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{expense.title}</p>
                      <p className="text-blue-300/40 text-xs">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-bold">${expense.isShared ? expense.splitAmount.toFixed(2) : expense.amount.toFixed(2)}</p>
                      {expense.isShared && <p className="text-purple-400 text-[10px]">Split</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Shared Expenses Tab */}
      {activeTab === 'shared' && (
        <>
          {/* Roommates */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Roommates</h3>
              <button
                onClick={() => setShowAddRoommate(true)}
                className="flex items-center gap-1.5 text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <UserPlus size={12} />
                Add
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="glass rounded-xl p-4 text-center border-2 border-blue-500/30">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">Me</span>
                </div>
                <p className="text-white text-sm font-medium">You</p>
                <p className="text-blue-300/40 text-xs">Host</p>
              </div>
              {roommates.map(roommate => (
                <div key={roommate.id} className="glass rounded-xl p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">{roommate.avatar}</span>
                  </div>
                  <p className="text-white text-sm font-medium">{roommate.name.split(' ')[0]}</p>
                  <p className="text-blue-300/40 text-xs">{roommate.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Settlement Summary */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-4">Settlement Summary</h3>
            <div className="space-y-3">
              {settlementsList.map(({ name, balance, owes }) => (
                <div key={name} className={`glass rounded-xl p-4 flex items-center justify-between ${owes ? 'border-red-500/20' : 'border-green-500/20'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${owes ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                      {owes ? <TrendingDown size={18} className="text-red-400" /> : <TrendingUp size={18} className="text-green-400" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{name}</p>
                      <p className="text-blue-300/40 text-xs">{owes ? 'Owes you' : 'You owe'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${owes ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(balance).toFixed(2)}
                    </p>
                    {!owes && (
                      <button className="text-xs text-blue-400 hover:text-blue-300">Settle</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Expense History */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-4">Shared Expenses</h3>
            <div className="space-y-3">
              {expenses.filter(e => e.isShared).slice(0, 10).map(expense => {
                const config = categoryConfig[expense.category];
                return (
                  <div key={expense.id} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                          <config.icon size={16} style={{ color: config.color }} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{expense.title}</p>
                          <p className="text-blue-300/40 text-xs">{new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-white font-bold">${expense.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Users size={12} className="text-purple-400" />
                      <span className="text-purple-300/60 text-xs">Split with:</span>
                      <div className="flex -space-x-1">
                        {expense.splitWith.map((person, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[9px] font-bold border border-gray-900"
                            title={person}
                          >
                            {person.split(' ').map(n => n[0]).join('')}
                          </div>
                        ))}
                      </div>
                      <span className="text-blue-300/50 text-xs ml-auto">
                        Your share: ${expense.splitAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Add Roommate Modal */}
      {showAddRoommate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full border border-white/10 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Add Roommate</h4>
              <button onClick={() => setShowAddRoommate(false)} className="text-blue-300/50 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Roommate name..."
              value={newRoommateName}
              onChange={e => setNewRoommateName(e.target.value)}
              className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 mb-4"
            />
            <button
              onClick={() => {
                if (newRoommateName.trim()) {
                  setShowAddRoommate(false);
                  setNewRoommateName('');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-xl text-sm font-medium"
            >
              Add Roommate
            </button>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="glass-card rounded-2xl p-6 border border-white/8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-white font-semibold text-lg">Expense History</h3>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value as ExpenseCategory | 'all')}
                className="glass bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"
              >
                <option value="all" className="bg-gray-900">All Categories</option>
                {Object.entries(categoryConfig).map(([k, v]) => (
                  <option key={k} value={k} className="bg-gray-900">{v.label}</option>
                ))}
              </select>
              <input
                type="month"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                className="glass bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            {filteredExpenses.filter(e => e.date.startsWith(filterMonth)).map(expense => {
              const config = categoryConfig[expense.category];
              return (
                <div key={expense.id} className="flex items-center gap-3 p-4 glass rounded-xl hover:bg-white/5 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                    <config.icon size={16} style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium truncate">{expense.title}</p>
                      {expense.isShared && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300">Split</span>
                      )}
                    </div>
                    <p className="text-blue-300/40 text-xs">{new Date(expense.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white text-sm font-bold">${expense.amount.toFixed(2)}</p>
                    {expense.isShared && (
                      <p className="text-purple-400/60 text-[10px]">Your share: ${expense.splitAmount.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <>
          {/* Monthly Trend */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-6">Monthly Spending Trend</h3>
            <div className="flex items-end gap-2 h-40">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                const amount = [820, 950, 780, 1100, 987, 650][i];
                const maxAmount = 1100;
                const height = (amount / maxAmount) * 100;
                const isCurrentMonth = i === 4;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-white/5 rounded-t overflow-hidden relative" style={{ height: 140 }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t transition-all duration-1000 ${isCurrentMonth ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-blue-600/40 to-blue-400/40'}`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="absolute inset-0 flex items-start justify-center pt-2 text-white text-xs font-medium opacity-70">${amount}</span>
                    </div>
                    <span className={`text-xs ${isCurrentMonth ? 'text-blue-400 font-semibold' : 'text-blue-300/40'}`}>{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-6">Expense Distribution</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Custom Pie Chart */}
              <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {(() => {
                    let currentAngle = 0;
                    return pieData.map((segment, i) => {
                      const angle = (segment.percentage / 100) * 360;
                      const startAngle = currentAngle;
                      currentAngle += angle;
                      const largeArc = angle > 180 ? 1 : 0;
                      const startX = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                      const startY = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                      const endX = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
                      const endY = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
                      const d = `M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArc} 1 ${endX} ${endY} Z`;
                      const config = categoryConfig[segment.category];
                      return (
                        <path
                          key={segment.category}
                          d={d}
                          fill={config.color}
                          stroke="rgba(6, 13, 31, 0.5)"
                          strokeWidth="2"
                          style={{
                            filter: `drop-shadow(0 0 8px ${config.color}40)`,
                            transition: 'all 0.5s ease',
                          }}
                        />
                      );
                    });
                  })()}
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {pieData.map(segment => {
                  const config = categoryConfig[segment.category];
                  return (
                    <div key={segment.category} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ background: config.color }} />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{config.label}</p>
                        <p className="text-blue-300/50 text-xs">${segment.amount.toFixed(2)} ({segment.percentage.toFixed(1)}%)</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Comparison */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-4">Category Comparison</h3>
            <div className="space-y-4">
              {Object.entries(categoryTotals)
                .filter(([_, amount]) => amount > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount], i) => {
                  const config = categoryConfig[category as ExpenseCategory];
                  const maxWidth = Math.max(...Object.values(categoryTotals));
                  const width = (amount / maxWidth) * 100;
                  return (
                    <div key={category} className="flex items-center gap-4">
                      <div className="w-32 shrink-0">
                        <div className="flex items-center gap-2">
                          <config.icon size={14} style={{ color: config.color }} />
                          <span className="text-blue-200/70 text-xs truncate">{config.label}</span>
                        </div>
                      </div>
                      <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                        <div
                          className="h-full rounded-lg transition-all duration-1000"
                          style={{
                            width: `${width}%`,
                            background: config.color,
                            opacity: 0.8,
                            transitionDelay: `${i * 100}ms`,
                          }}
                        />
                      </div>
                      <span className="text-white text-sm font-bold w-16 text-right">${amount.toFixed(2)}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full border border-white/10 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Add Expense</h4>
              <button onClick={() => setShowAddExpense(false)} className="text-blue-300/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Expense title..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
              />

              <input
                type="number"
                placeholder="Amount ($)"
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
                className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
              />

              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as ExpenseCategory)}
                className="w-full glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"
              >
                {Object.entries(categoryConfig).map(([k, v]) => (
                  <option key={k} value={k} className="bg-gray-900">{v.label}</option>
                ))}
              </select>

              <div className="glass rounded-xl p-4 border border-white/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsShared}
                    onChange={e => setNewIsShared(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                  />
                  <span className="text-white text-sm">Split with roommates</span>
                </label>

                {newIsShared && (
                  <div className="mt-4 space-y-2">
                    <p className="text-blue-300/50 text-xs">Select roommates:</p>
                    {roommates.map(roommate => (
                      <label key={roommate.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/5">
                        <input
                          type="checkbox"
                          checked={newSplitWith.includes(roommate.name)}
                          onChange={() => toggleSplitWith(roommate.name)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5"
                        />
                        <span className="text-white text-sm">{roommate.name}</span>
                      </label>
                    ))}
                    {newSplitWith.length > 0 && (
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-blue-300/50 text-xs">
                          Your share: ${(parseFloat(newAmount || '0') / (newSplitWith.length + 1)).toFixed(2)}
                        </p>
                        <p className="text-blue-300/50 text-xs">
                          Per person: ${(parseFloat(newAmount || '0') / (newSplitWith.length + 1)).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={addExpense}
                disabled={!newTitle.trim() || !newAmount}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
