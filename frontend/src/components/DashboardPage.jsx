import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Award, 
  Zap, 
  Crown, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Bell, 
  Calendar
} from "lucide-react";
import { fetchApi } from "../api";
import { translations } from "../translations";

export default function DashboardPage({ user, onNavigateToLearning, lang = "en" }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const email = user ? user.email : "student@tet.com";
      const data = await fetchApi(`/dashboard?email=${encodeURIComponent(email)}`);
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-[#0284C7] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-[#0284C7] text-xs font-bold">Loading Dashboard...</p>
      </div>
    );
  }

  const u = dashboardData?.user || user || {};
  const quote = dashboardData?.quote || "Success is built on small daily study steps.";
  const badges = dashboardData?.badges || [];
  const announcements = dashboardData?.announcements || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 animate-fade-in text-[#1E3A8A]">
      
      {/* PROFILE CARD */}
      <div className="bg-white border border-sky-100 border-t-4 border-t-[#0284C7] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#0284C7] p-0.5 shadow-md shadow-[#0284C7]/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-2xl font-black text-[#1E3A8A]">
                {u.name ? u.name[0].toUpperCase() : "S"}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E3A8A] tracking-tight">
                  {t.welcomeBack}, {u.name}!
                </h1>
                <span className="px-3 py-1 rounded-full bg-sky-50 border border-[#0284C7]/30 text-[#0284C7] text-xs font-bold uppercase tracking-wider">
                  {u.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2 font-semibold">
                <span>{u.email}</span>
                <span>•</span>
                <span className="text-[#0284C7] font-bold">{t.allClasses}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-lg bg-slate-50 text-[#1E3A8A] border border-slate-200 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{t.academicYear}</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.activeLearnerBadge}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToLearning}
            className="flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-[#0284C7]/20 transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.continueLearningBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STATUS BAR & DAILY STREAK */}
      <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#0284C7]" />
                <span className="text-xs font-extrabold text-[#1E3A8A] uppercase tracking-wider">
                  {t.dailyTaskTitle}
                </span>
              </div>
              <span className="text-xs font-black text-[#0284C7]">
                {u.daily_tasks_done} / {u.daily_tasks_total} {t.tasksDone} ({u.progress_percent || 0}%)
              </span>
            </div>

            <div className="w-full h-3.5 bg-slate-100 rounded-full p-0.5 border border-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#0284C7] transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(5, u.progress_percent || 0))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {t.dailyTaskDesc}
            </p>
          </div>

          <div className="md:w-72 bg-sky-50/80 border border-[#0284C7]/30 rounded-2xl p-4.5 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0284C7] block mb-0.5">
                {t.dailyStreakTitle}
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-black text-[#1E3A8A]">{u.streak_count || 0}</span>
                <span className="text-xs font-bold text-[#0284C7]">{t.streakDays}</span>
              </div>
              <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">
                {u.streak_count > 0 ? t.streakActiveDesc : t.streakInactiveDesc}
              </span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#0284C7] p-0.5 shadow-md shadow-[#0284C7]/20 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Flame className="w-7 h-7 text-orange-500 fill-orange-500 animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MOTIVATION QUOTE BOX & STREAK BADGES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-white text-[#0284C7] text-xs font-bold uppercase flex items-center space-x-1.5 border border-[#0284C7]/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{t.dailyMotivationTitle}</span>
              </span>
            </div>

            <blockquote className="text-base sm:text-lg font-extrabold text-[#1E3A8A] italic leading-relaxed my-2">
              "{quote}"
            </blockquote>
          </div>

          <div className="pt-4 border-t border-sky-200/80 flex items-center justify-between text-xs text-[#0284C7] font-semibold">
            <span>TET Portal</span>
            <span className="font-bold text-[#1E3A8A]">Daily Learning Focus</span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-sky-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1E3A8A] flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#0284C7]" />
                  <span>{t.streakBadgesTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {t.badgesDesc}
                </p>
              </div>
              <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-[#0284C7]/30">
                {badges.filter(b => b.unlocked).length} / {badges.length} {t.unlockedText}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.map((b) => {
                const isUnlocked = b.unlocked;
                return (
                  <div
                    key={b.id}
                    className={`relative p-3.5 rounded-2xl border text-center transition-all ${
                      isUnlocked
                        ? "bg-sky-50/70 border-[#0284C7]/40 shadow-xs"
                        : "bg-slate-50 border-slate-200 opacity-60 grayscale"
                    }`}
                  >
                    {isUnlocked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        ✓
                      </div>
                    )}

                    <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#0284C7] p-0.5 shadow-xs flex items-center justify-center mb-2">
                      <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                        {b.id === "starter" && <Zap className="w-5 h-5 text-yellow-500" />}
                        {b.id === "bronze" && <Award className="w-5 h-5 text-amber-600" />}
                        {b.id === "silver" && <ShieldCheck className="w-5 h-5 text-slate-600" />}
                        {b.id === "diamond" && <Crown className="w-5 h-5 text-[#0284C7] fill-[#0284C7]" />}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-[#1E3A8A] truncate">{b.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                      {b.required_streak} {t.streakDays}
                    </span>

                    <span
                      className={`inline-block mt-2 px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                        isUnlocked
                          ? "bg-sky-100 text-[#0284C7] border border-[#0284C7]/30"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isUnlocked ? t.unlockedText : `${t.needStreakText} ${b.required_streak}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ANNOUNCEMENTS SECTION */}
      {announcements.length > 0 && (
        <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#1E3A8A] flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5 text-[#0284C7] animate-bounce" />
            <span>{t.announcementsTitle}</span>
          </h3>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        ann.priority === "urgent"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-sky-100 text-[#0284C7] border border-[#0284C7]/30"
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <h4 className="text-xs font-bold text-[#1E3A8A]">{ann.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">{ann.content}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                  {ann.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
