import React, { useState } from "react";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import DashboardPage from "./components/DashboardPage";
import MaterialsPage from "./components/MaterialsPage";
import LearningPage from "./components/LearningPage";
import AdminPage from "./components/AdminPage";
import { translations } from "./translations";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null); // Default null to force Login screen first!
  const [lang, setLang] = useState("en"); // "en" or "ta"

  const t = translations[lang] || translations.en;

  const handleLogout = () => {
    setUser(null);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E3A8A] font-sans flex flex-col selection:bg-[#0284C7] selection:text-white">
      
      {/* Navigation Bar with Circle Language Switcher in top-right */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Page View */}
      <main className="flex-1 pb-16">
        {!user ? (
          /* INITIAL LANDING / LOGIN SCREEN WHEN NOT LOGGED IN */
          <div className="min-h-[80vh] flex items-center justify-center p-4">
            <AuthModal
              isOpen={true}
              onClose={null} // Cannot close initial login screen until logged in!
              onAuthSuccess={(u) => setUser(u)}
              lang={lang}
            />
          </div>
        ) : (
          /* LOGGED IN VIEWS */
          <>
            {activeTab === "dashboard" && (
              <DashboardPage
                user={user}
                onNavigateToLearning={() => setActiveTab("learning")}
                lang={lang}
              />
            )}

            {activeTab === "materials" && <MaterialsPage lang={lang} />}

            {activeTab === "learning" && <LearningPage user={user} lang={lang} />}

            {activeTab === "admin" && <AdminPage user={user} lang={lang} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-medium">© 2026 TET Platform — {t.brandSubtitle}</span>
          <div className="flex items-center space-x-4 font-bold">
            <span className="text-[#0284C7]">{t.allClasses}</span>
            <span>•</span>
            <span className="text-[#0284C7]">Gemini AI Powered</span>
            <span>•</span>
            <span className="text-[#1E3A8A]">{t.streakDays}</span>
          </div>
        </div>
      </footer>

      {/* Explicit Auth Modal triggered from navbar when logged in */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(u) => setUser(u)}
          lang={lang}
        />
      )}

    </div>
  );
}
