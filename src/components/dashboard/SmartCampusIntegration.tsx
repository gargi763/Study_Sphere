import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Radio, MapPin, Users, Lightbulb, Thermometer, Wind, AlertCircle, CheckCircle2, Clock, Zap, Cpu, Signal, Activity } from 'lucide-react';

interface ClassroomStatus {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  temperature: number;
  lighting: number;
  hvac: boolean;
  online: boolean;
}

interface CampusActivity {
  id: string;
  type: 'attendance' | 'alert' | 'event';
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway';
  status: 'online' | 'offline' | 'error';
  signal: number;
  battery?: number;
}

const mockClassrooms: ClassroomStatus[] = [
  { id: '1', name: 'Lab A1', capacity: 40, occupancy: 28, temperature: 22, lighting: 85, hvac: true, online: true },
  { id: '2', name: 'Lecture Hall B', capacity: 150, occupancy: 89, temperature: 21, lighting: 90, hvac: true, online: true },
  { id: '3', name: 'Lab C2', capacity: 35, occupancy: 12, temperature: 23, lighting: 60, hvac: false, online: true },
  { id: '4', name: 'Study Room D', capacity: 20, occupancy: 18, temperature: 20, lighting: 70, hvac: true, online: false },
];

const mockActivities: CampusActivity[] = [
  { id: '1', type: 'attendance', message: 'You entered Lab A1', timestamp: new Date(Date.now() - 2 * 60000), priority: 'low' },
  { id: '2', type: 'event', message: 'Tech workshop starting in Lecture Hall B', timestamp: new Date(Date.now() - 5 * 60000), priority: 'medium' },
  { id: '3', type: 'alert', message: 'High CO2 detected in Study Room D', timestamp: new Date(Date.now() - 10 * 60000), priority: 'high' },
  { id: '4', type: 'attendance', message: 'You left Lab C2', timestamp: new Date(Date.now() - 15 * 60000), priority: 'low' },
];

const mockDevices: IoTDevice[] = [
  { id: '1', name: 'Gateway 1', type: 'gateway', status: 'online', signal: 95, battery: 100 },
  { id: '2', name: 'Temp Sensor A1', type: 'sensor', status: 'online', signal: 88, battery: 85 },
  { id: '3', name: 'Light Control B', type: 'actuator', status: 'online', signal: 92, battery: 90 },
  { id: '4', name: 'Occupancy Sensor D', type: 'sensor', status: 'offline', signal: 0, battery: 30 },
  { id: '5', name: 'HVAC Controller C', type: 'actuator', status: 'online', signal: 87, battery: 95 },
];

export default function SmartCampusIntegration() {
  const [classrooms, setClassrooms] = useState<ClassroomStatus[]>(mockClassrooms);
  const [activities, setActivities] = useState<CampusActivity[]>(mockActivities);
  const [devices, setDevices] = useState<IoTDevice[]>(mockDevices);
  const [activeTab, setActiveTab] = useState<'overview' | 'classrooms' | 'activity' | 'devices'>('overview');
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setClassrooms(prev =>
        prev.map(room => ({
          ...room,
          occupancy: Math.max(0, room.occupancy + (Math.random() > 0.5 ? 1 : -1)),
          temperature: room.temperature + (Math.random() - 0.5) * 0.5,
          lighting: Math.max(40, Math.min(100, room.lighting + (Math.random() - 0.5) * 3)),
        }))
      );

      setAnimatedValues(prev => ({
        ...prev,
        ...mockClassrooms.reduce((acc, room) => ({
          ...acc,
          [room.id]: Math.random() * 100,
        }), {}),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalOnline = devices.filter(d => d.status === 'online').length;
  const avgOccupancy = Math.round(classrooms.reduce((sum, r) => sum + (r.occupancy / r.capacity) * 100, 0) / classrooms.length);

  const formatTime = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-600 dark:bg-cyan-600 rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-blue-600 dark:bg-blue-600 rounded-full opacity-5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-xs text-slate-600 dark:text-blue-300 border transition-theme border-slate-300/30 dark:border-blue-500/20">
            <Cpu size={12} className="text-cyan-400 animate-spin-slow" />
            <span>IoT & Smart Campus</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Smart Campus Integration</h2>
          <p className="text-slate-600 dark:text-blue-200/50 text-lg max-w-2xl mx-auto transition-colors">Experience the future of campus life with real-time IoT connectivity, smart classroom management, and intelligent campus insights</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {(['overview', 'classrooms', 'activity', 'devices'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'glass text-slate-600 dark:text-blue-300/70 hover:text-slate-900 dark:hover:text-blue-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 dark:text-blue-300/60 text-sm font-medium transition-colors">Campus Devices</p>
                  <Cpu size={16} className="text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{devices.length}</p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle2 size={10} /> {totalOnline} online</p>
              </div>

              <div className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 dark:text-blue-300/60 text-sm font-medium transition-colors">Avg Occupancy</p>
                  <Users size={16} className="text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{avgOccupancy}%</p>
                <div className="w-full h-1.5 bg-slate-300 dark:bg-white/10 rounded-full mt-2 transition-colors">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${avgOccupancy}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 dark:text-blue-300/60 text-sm font-medium transition-colors">Active Rooms</p>
                  <Lightbulb size={16} className="text-yellow-400" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{classrooms.filter(r => r.online).length}/{classrooms.length}</p>
                <p className="text-xs text-slate-500 dark:text-blue-300/40 mt-1 transition-colors">rooms online</p>
              </div>

              <div className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 dark:text-blue-300/60 text-sm font-medium transition-colors">Network Status</p>
                  <Wifi size={16} className="text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">92%</p>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1"><CheckCircle2 size={10} /> Optimal</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Radio size={16} className="text-cyan-400" />
                  <span className="text-slate-900 dark:text-white transition-colors">RFID Access Points</span>
                </h3>
                <div className="space-y-3">
                  {classrooms.map((room, idx) => (
                    <div key={room.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-3 h-3 rounded-full ${room.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm transition-colors">{room.name}</p>
                          <p className="text-xs text-slate-500 dark:text-blue-300/40 transition-colors">{room.occupancy}/{room.capacity} occupants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors">{Math.round((room.occupancy / room.capacity) * 100)}%</p>
                        <div className="w-16 h-1.5 bg-slate-300 dark:bg-white/10 rounded-full mt-1 transition-colors">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${(room.occupancy / room.capacity) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/10">
                <h3 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-purple-400" />
                  Recent Activity
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activities.map(activity => (
                    <div key={activity.id} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 transition-colors">
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          activity.priority === 'high' ? 'bg-red-500' : activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 dark:text-white transition-colors">{activity.message}</p>
                          <p className="text-[10px] text-slate-500 dark:text-blue-300/40 mt-0.5 transition-colors">{formatTime(activity.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classrooms' && (
          <div className="grid md:grid-cols-2 gap-6">
            {classrooms.map(room => (
              <div key={room.id} className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/10 hover:border-slate-400/40 dark:hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">{room.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-blue-300/40 mt-1 transition-colors flex items-center gap-1">
                      <MapPin size={12} /> Smart Classroom
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${room.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-600 dark:text-blue-300/60 transition-colors flex items-center gap-1">
                        <Users size={12} /> Occupancy
                      </label>
                      <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{room.occupancy}/{room.capacity}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-300 dark:bg-white/10 rounded-full overflow-hidden transition-colors">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${(room.occupancy / room.capacity) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-600 dark:text-blue-300/60 transition-colors flex items-center gap-1">
                        <Thermometer size={12} /> Temperature
                      </label>
                      <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{room.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="w-full h-2 bg-slate-300 dark:bg-white/10 rounded-full overflow-hidden transition-colors">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: `${((room.temperature - 16) / 12) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-600 dark:text-blue-300/60 transition-colors flex items-center gap-1">
                        <Lightbulb size={12} /> Lighting
                      </label>
                      <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{Math.round(room.lighting)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-300 dark:bg-white/10 rounded-full overflow-hidden transition-colors">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" style={{ width: `${room.lighting}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t transition-theme border-slate-300/30 dark:border-white/5">
                    <label className="text-xs font-medium text-slate-600 dark:text-blue-300/60 transition-colors flex items-center gap-1">
                      <Wind size={12} /> HVAC
                    </label>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${room.hvac ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-slate-200 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300'} transition-colors`}>
                      {room.hvac ? 'Active' : 'Off'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map(device => (
              <div key={device.id} className={`glass-card rounded-2xl p-6 border transition-all ${
                device.status === 'online'
                  ? 'border-slate-300/20 dark:border-white/10 hover:border-green-400/40 dark:hover:border-green-400/40'
                  : device.status === 'offline'
                  ? 'border-slate-300/20 dark:border-red-500/20'
                  : 'border-slate-300/20 dark:border-yellow-500/20'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white transition-colors">{device.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-blue-300/40 mt-1 capitalize transition-colors">{device.type}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    device.status === 'online' ? 'bg-green-500 animate-pulse' : device.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-600 dark:text-blue-300/60 transition-colors flex items-center gap-1">
                        <Signal size={12} /> Signal
                      </label>
                      <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{device.signal}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-300 dark:bg-white/10 rounded-full overflow-hidden transition-colors">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${device.signal}%` }} />
                    </div>
                  </div>

                  {device.battery !== undefined && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-slate-600 dark:text-blue-300/60 transition-colors flex items-center gap-1">
                          <Zap size={12} /> Battery
                        </label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{device.battery}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-300 dark:bg-white/10 rounded-full overflow-hidden transition-colors">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" style={{ width: `${device.battery}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t transition-theme border-slate-300/30 dark:border-white/5">
                    <p className={`text-xs font-medium ${
                      device.status === 'online'
                        ? 'text-green-600 dark:text-green-400 flex items-center gap-1'
                        : device.status === 'offline'
                        ? 'text-red-600 dark:text-red-400 flex items-center gap-1'
                        : 'text-yellow-600 dark:text-yellow-400 flex items-center gap-1'
                    } transition-colors`}>
                      {device.status === 'online' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="glass-card rounded-2xl p-8 border transition-theme border-slate-300/20 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors flex items-center gap-2">
              <Activity size={20} className="text-purple-400" />
              Campus Activity Log
            </h3>
            <div className="space-y-3">
              {activities.map((activity, idx) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b transition-theme border-slate-300/20 dark:border-white/5 last:border-b-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    activity.priority === 'high'
                      ? 'bg-red-100 dark:bg-red-500/20'
                      : activity.priority === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-500/20'
                      : 'bg-blue-100 dark:bg-blue-500/20'
                  }`}>
                    {activity.type === 'attendance' ? <MapPin size={18} className="text-blue-600 dark:text-blue-400" /> : activity.type === 'alert' ? <AlertCircle size={18} className="text-red-600 dark:text-red-400" /> : <Zap size={18} className="text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white transition-colors">{activity.message}</p>
                    <p className="text-sm text-slate-500 dark:text-blue-300/40 mt-1 transition-colors">{formatTime(activity.timestamp)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 capitalize ${
                    activity.priority === 'high'
                      ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                      : activity.priority === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                      : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                  }`}>
                    {activity.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        @keyframes radar-sweep {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }

        .animate-radar {
          animation: radar-sweep 20s linear infinite;
        }

        .animate-float-up {
          animation: float-up 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
