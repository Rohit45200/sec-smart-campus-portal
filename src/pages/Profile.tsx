import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Award,
  CheckCircle2,
  Edit3,
  Save,
  X,
  BookOpen,
  Calendar,
  ShieldCheck,
  GraduationCap,
  Bus,
  UserCheck,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { profile, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: profile?.phone || '+91 98421 87650',
    address: profile?.address || 'Plot No. 42, Green Avenue, Tiruchengode, Namakkal - 637211, Tamil Nadu',
    guardianName: profile?.guardianName || 'S. Sundaram (Father)',
    guardianPhone: profile?.guardianPhone || '+91 94432 10987',
    bloodGroup: profile?.bloodGroup || 'O+ Positive',
    hostelStatus: profile?.hostelStatus || 'Day Scholar',
    transportBusNo: profile?.transportBusNo || 'Route #14 - Erode via Chithode',
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSuccessMessage('Profile information updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      // Error handling
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-500 text-sm font-semibold">Loading Student Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Top Banner Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 relative overflow-hidden"
        >
          {/* Header Background Gradient */}
          <div className="h-32 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 relative">
            <div className="absolute top-2 right-4 text-white/20">
              <GraduationCap className="w-32 h-32" />
            </div>
          </div>

          {/* Avatar and Basic Header Details */}
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-12 pt-2">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-1.5 shadow-xl border-2 border-indigo-100 shrink-0 overflow-hidden">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                  {profile.verified && (
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-600" title="Verified Institutional Profile">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Roll No: <span className="font-bold text-indigo-700">{profile.rollNumber}</span> • Reg No: <span className="font-bold text-slate-800">{profile.registerNumber}</span>
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {profile.department} • {profile.year} (Sem {profile.semester})
                </p>
              </div>
            </div>

            {/* Actions: Edit Profile Button */}
            <div className="shrink-0 pt-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Update Contact Details</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel Editing</span>
                </button>
              )}
            </div>

          </div>

          {/* Success Banner Message */}
          {successMessage && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

        </motion.div>


        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols): Academic & Personal Information */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Academic Credentials Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Academic & Institutional Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Full Student Name</span>
                  <span className="font-bold text-slate-800 text-sm">{profile.name}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">College Roll Number</span>
                  <span className="font-bold text-indigo-700 text-sm">{profile.rollNumber}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Anna University Register Number</span>
                  <span className="font-bold text-slate-800 text-sm">{profile.registerNumber}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Department / Branch</span>
                  <span className="font-bold text-slate-800 text-sm">{profile.department}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Degree Program</span>
                  <span className="font-bold text-slate-800 text-sm">{profile.degree}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Academic Batch & Year</span>
                  <span className="font-bold text-slate-800 text-sm">{profile.batch} ({profile.year})</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Section & Semester</span>
                  <span className="font-bold text-slate-800 text-sm">Section {profile.section} • Semester {profile.semester}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Current Cumulative Grade Point (CGPA)</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{profile.cgpa} / 10.0</span>
                </div>
              </div>
            </div>


            {/* Contact & Address Form/Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <span>Personal Contact & Guardian Information</span>
                </h3>
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Institutional Email</span>
                    <span className="font-bold text-slate-800">{profile.email}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Student Phone Number</span>
                    <span className="font-bold text-slate-800">{profile.phone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Date of Birth</span>
                    <span className="font-bold text-slate-800">{profile.dob}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Blood Group</span>
                    <span className="font-bold text-rose-600">{profile.bloodGroup}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Parent / Guardian Name</span>
                    <span className="font-bold text-slate-800">{profile.guardianName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Guardian Contact Phone</span>
                    <span className="font-bold text-slate-800">{profile.guardianPhone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Accommodation / Transport</span>
                    <span className="font-bold text-slate-800">{profile.hostelStatus} ({profile.transportBusNo})</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium block mb-1">Permanent Address</span>
                    <span className="font-bold text-slate-800 leading-relaxed">{profile.address}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Student Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Guardian Name</label>
                      <input
                        type="text"
                        value={formData.guardianName}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Guardian Phone</label>
                      <input
                        type="text"
                        value={formData.guardianPhone}
                        onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">College Bus Route / Hostel</label>
                      <input
                        type="text"
                        value={formData.transportBusNo}
                        onChange={(e) => setFormData({ ...formData, transportBusNo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">Residential Address</label>
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* Right Column (4 cols): Faculty Mentor & Transport Desk */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Faculty Mentor Assigned Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Assigned Faculty Mentor</span>
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-200 shrink-0">
                  MS
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{profile.mentorName}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Assoc. Professor • CSE Dept</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                <div className="font-bold">Mentor Contact:</div>
                <div className="text-slate-600">{profile.mentorContact}</div>
              </div>
            </div>

            {/* College Bus Route & Transport Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Bus className="w-4 h-4 text-indigo-600" />
                <span>Campus Transport & Hostel</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold text-slate-800">{profile.hostelStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Allocated Route:</span>
                  <span className="font-bold text-indigo-700">{profile.transportBusNo}</span>
                </div>
              </div>
            </div>

            {/* Quick Security Badge */}
            <div className="p-4 bg-slate-900 text-white rounded-3xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>SEC CIT Credentials</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Profile records are synced with Anna University CoE and SEC Controller Office. For name/DOB corrections, present official SSLC mark sheet to CIT desk.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
