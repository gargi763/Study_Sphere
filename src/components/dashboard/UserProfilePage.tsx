import React, { useState } from 'react';
import { User, Mail, Phone, Building, FileText, Save, Camera, GraduationCap, BookOpen, Shield, LogOut, X } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

interface UserProfilePageProps {
  onClose?: () => void;
}

const ROLE_META = {
  student: { label: 'Student', icon: GraduationCap, color: 'from-blue-500 to-cyan-500', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  faculty: { label: 'Faculty', icon: BookOpen, color: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  admin: { label: 'Administrator', icon: Shield, color: 'from-orange-500 to-amber-500', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
};

export default function UserProfilePage({ onClose }: UserProfilePageProps) {
  const { user, profile, role, signOut, updateProfile } = useAuthContext();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    department: profile?.department ?? '',
    bio: profile?.bio ?? '',
  });

  const roleMeta = role ? ROLE_META[role] : ROLE_META.student;
  const RoleIcon = roleMeta.icon;
  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProfile(form);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message ?? 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      department: profile?.department ?? '',
      bio: profile?.bio ?? '',
    });
    setEditing(false);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">My Profile</h1>
          <p className="text-sm text-slate-400">Manage your account information</p>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Profile card */}
      <div className="glass rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleMeta.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-slate-700 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-all">
              <Camera size={13} />
            </button>
          </div>

          {/* Name & role */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">
              {profile?.full_name || 'Unnamed User'}
            </h2>
            <p className="text-sm text-slate-400 mb-2">{user?.email}</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${roleMeta.badge}`}>
              <RoleIcon size={11} />
              {roleMeta.label}
            </span>
          </div>

          {/* Edit toggle */}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium hover:bg-blue-500/30 transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-6 border border-white/10 mb-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Personal Information</h3>

        {/* Full name */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
            <User size={13} /> Full Name
          </label>
          {editing ? (
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          ) : (
            <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{profile?.full_name || '—'}</p>
          )}
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
            <Mail size={13} /> Email Address
          </label>
          <p className="text-slate-400 text-sm py-3 px-4 bg-white/3 rounded-xl">{user?.email}</p>
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
            <Phone size={13} /> Phone Number
          </label>
          {editing ? (
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          ) : (
            <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{profile?.phone || '—'}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
            <Building size={13} /> Department
          </label>
          {editing ? (
            <input
              type="text"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              placeholder="e.g. Computer Science"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          ) : (
            <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl">{profile?.department || '—'}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
            <FileText size={13} /> Bio
          </label>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="A brief description about yourself..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none"
            />
          ) : (
            <p className="text-white text-sm py-3 px-4 bg-white/3 rounded-xl min-h-[72px] whitespace-pre-wrap">{profile?.bio || '—'}</p>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
        )}

        {saved && (
          <p className="text-emerald-400 text-xs bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">Profile updated successfully!</p>
        )}

        {editing && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account info */}
      <div className="glass rounded-2xl p-6 border border-white/10 mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Account</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-sm text-slate-400">Member since</span>
            <span className="text-sm text-white">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-sm text-slate-400">Account type</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg border ${roleMeta.badge}`}>{roleMeta.label}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-400">User ID</span>
            <span className="text-xs text-slate-500 font-mono">{user?.id?.slice(0, 8)}...</span>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all text-sm font-medium"
      >
        <LogOut size={15} />
        Sign Out
      </button>
    </div>
  );
}
