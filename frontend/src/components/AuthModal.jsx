import React, { useState } from "react";
import { X, User, Mail, Lock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { fetchApi } from "../api";
import { translations } from "../translations";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, lang = "en" }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const t = translations[lang] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const user = await fetchApi("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        onAuthSuccess(user);
        if (onClose) onClose();
      } else {
        const user = await fetchApi("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
        onAuthSuccess(user);
        if (onClose) onClose();
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setLoading(true);
    try {
      const user = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "student@tet.com", password: "student123" }),
      });
      onAuthSuccess(user);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      const user = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@tet.com", password: "admin123" }),
      });
      onAuthSuccess(user);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-[#0284C7]/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900">
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* EMBLEM LOGO DISPLAY */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#1E3A8A] to-[#0284C7] shadow-lg shadow-[#0284C7]/20 mb-3 flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="TN Teachers Welfare Association Emblem"
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>

          <h2 className="text-xl font-extrabold text-[#1E3A8A] tracking-tight">
            {isLogin ? t.loginHeaderTitle : t.registerTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium max-w-xs">
            {isLogin ? t.loginSubtitle : t.registerTitle}
          </p>
        </div>

        {/* Quick Login Options */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={handleDemoStudent}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200 text-xs font-bold transition shadow-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.demoLogin}</span>
          </button>

          <button
            type="button"
            onClick={handleDemoAdmin}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.adminLogin}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                {t.nameLabel}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Kavitha S."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
              {t.emailLabel}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@tet.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-[#0284C7]/20 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? "Processing..." : isLogin ? t.loginBtn : t.registerBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-xs text-[#0284C7] hover:underline font-bold"
          >
            {isLogin ? t.noAccountText : t.alreadyAccountText}
          </button>
        </div>
      </div>
    </div>
  );
}
