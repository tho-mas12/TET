import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Upload, 
  Settings, 
  Users, 
  BarChart3, 
  Bell, 
  FileText, 
  Trash2, 
  Key, 
  Sparkles,
  Award,
  Plus,
  BookOpen,
  FolderPlus
} from "lucide-react";
import { fetchApi } from "../api";
import { translations } from "../translations";

export default function AdminPage({ user, lang = "en" }) {
  const [activeTab, setActiveTab] = useState("stats");

  const [stats, setStats] = useState(null);

  const t = translations[lang] || translations.en;

  // Upload Form State for Materials Explorer
  const [matClass, setMatClass] = useState(10);
  const [matSubject, setMatSubject] = useState("Tamil");
  const [customMatSubject, setCustomMatSubject] = useState("");
  const [isCustomMatSubject, setIsCustomMatSubject] = useState(false);
  const [matMedium, setMatMedium] = useState("Tamil Medium");
  const [matTerm, setMatTerm] = useState("Term-1");
  const [matTitle, setMatTitle] = useState("");
  const [matDesc, setMatDesc] = useState("");
  const [matFile, setMatFile] = useState(null);
  const [materialsList, setMaterialsList] = useState([]);
  const [uploadingMat, setUploadingMat] = useState(false);

  // Upload Form State for Learning Portal
  const [lesClass, setLesClass] = useState(10);
  const [lesSubject, setLesSubject] = useState("Tamil");
  const [customLesSubject, setCustomLesSubject] = useState("");
  const [isCustomLesSubject, setIsCustomLesSubject] = useState(false);
  const [lesMedium, setLesMedium] = useState("Tamil Medium");
  const [lesTerm, setLesTerm] = useState("Term-1");
  const [lesOrder, setLesOrder] = useState(1);
  const [lesTitle, setLesTitle] = useState("");
  const [lesDesc, setLesDesc] = useState("");
  const [lesVideoUrl, setLesVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [lesFile, setLesFile] = useState(null);
  const [lessonsList, setLessonsList] = useState([]);
  const [uploadingLes, setUploadingLes] = useState(false);

  // Settings State
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [practiceCount, setPracticeCount] = useState(200);
  const [testCount, setTestCount] = useState(100);
  const [timeLimit, setTimeLimit] = useState(60);
  const [passPercent, setPassPercent] = useState(60);
  const [savingSettings, setSavingSettings] = useState(false);

  const [usersList, setUsersList] = useState([]);

  // Announcement State
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPriority, setAnnPriority] = useState("normal");
  const [postingAnn, setPostingAnn] = useState(false);

  const standardSubjects = [
    "Tamil", "English", "Mathematics", "Science", "Social Science",
    "Physics", "Chemistry", "Botany", "Zoology", "Computer Science",
    "Commerce", "Economics", "Accountancy"
  ];

  useEffect(() => {
    loadStats();
    loadMaterials();
    loadLessons();
    loadSettings();
    loadUsers();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchApi("/admin/stats");
      setStats(data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  const loadMaterials = async () => {
    try {
      const data = await fetchApi("/admin/materials");
      setMaterialsList(data);
    } catch (err) {
      console.error("Materials error:", err);
    }
  };

  const loadLessons = async () => {
    try {
      const data = await fetchApi("/admin/lessons");
      setLessonsList(data);
    } catch (err) {
      console.error("Lessons error:", err);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await fetchApi("/admin/settings");
      setGeminiApiKey(data.gemini_api_key || "");
      setPracticeCount(data.practice_question_count || 200);
      setTestCount(data.test_question_count || 100);
      setTimeLimit(data.test_time_limit_mins || 60);
      setPassPercent(data.pass_percentage || 60);
    } catch (err) {
      console.error("Settings load error:", err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await fetchApi("/admin/users");
      setUsersList(data);
    } catch (err) {
      console.error("Users error:", err);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    const finalSubject = isCustomMatSubject ? customMatSubject : matSubject;
    if (!matTitle || !finalSubject) return alert("Please enter material title & subject.");
    setUploadingMat(true);

    try {
      const formData = new FormData();
      formData.append("class_num", matClass);
      formData.append("subject", finalSubject);
      formData.append("medium", matMedium);
      formData.append("term", matTerm);
      formData.append("title", matTitle);
      formData.append("description", matDesc);
      if (matFile) formData.append("file", matFile);

      const res = await fetch("http://localhost:8000/api/admin/materials", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Materials Explorer PDF uploaded successfully!");
      setMatTitle("");
      setMatDesc("");
      setCustomMatSubject("");
      setIsCustomMatSubject(false);
      setMatFile(null);
      loadMaterials();
      loadStats();
    } catch (err) {
      alert("Error uploading material: " + err.message);
    } finally {
      setUploadingMat(false);
    }
  };

  const handleUploadLesson = async (e) => {
    e.preventDefault();
    const finalSubject = isCustomLesSubject ? customLesSubject : lesSubject;
    if (!lesTitle || !finalSubject) return alert("Please enter lesson title & subject.");
    setUploadingLes(true);

    try {
      const formData = new FormData();
      formData.append("class_num", lesClass);
      formData.append("subject", finalSubject);
      formData.append("medium", lesMedium);
      formData.append("term", lesTerm);
      formData.append("lesson_order", lesOrder);
      formData.append("title", lesTitle);
      formData.append("description", lesDesc);
      formData.append("video_url", lesVideoUrl);
      if (lesFile) formData.append("file", lesFile);

      const res = await fetch("http://localhost:8000/api/admin/lessons", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Learning Portal Module published successfully!");
      setLesTitle("");
      setLesDesc("");
      setCustomLesSubject("");
      setIsCustomLesSubject(false);
      setLesFile(null);
      loadLessons();
      loadStats();
    } catch (err) {
      alert("Error uploading lesson: " + err.message);
    } finally {
      setUploadingLes(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
      await fetchApi(`/admin/materials/${id}`, { method: "DELETE" });
      loadMaterials();
      loadStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!confirm("Are you sure you want to delete this lesson module?")) return;
    try {
      await fetchApi(`/admin/lessons/${id}`, { method: "DELETE" });
      loadLessons();
      loadStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await fetchApi("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          gemini_api_key: geminiApiKey,
          practice_question_count: Number(practiceCount),
          test_question_count: Number(testCount),
          test_time_limit_mins: Number(timeLimit),
          pass_percentage: Number(passPercent)
        })
      });
      alert("Admin & Gemini AI Settings saved successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return alert("Fill in title and content");
    setPostingAnn(true);
    try {
      await fetchApi("/admin/announcements", {
        method: "POST",
        body: JSON.stringify({ title: annTitle, content: annContent, priority: annPriority })
      });
      alert("Announcement published to learning users!");
      setAnnTitle("");
      setAnnContent("");
    } catch (err) {
      alert(err.message);
    } finally {
      setPostingAnn(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 animate-fade-in text-[#1E3A8A]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-sky-950 to-[#1E3A8A] border border-sky-800 rounded-3xl p-6 sm:p-7 shadow-sm text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Control Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.adminPortalTitle}
          </h1>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl font-medium">
            {t.adminSubtitle}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center space-x-2">
          <Key className="w-4 h-4 text-sky-400" />
          <span>{t.adminRoleActive}</span>
        </div>
      </div>

      {/* ADMIN TABS NAV */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-sky-100 shadow-xs">
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "stats"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#1E3A8A] hover:bg-sky-50"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t.tabStats}</span>
        </button>

        <button
          onClick={() => setActiveTab("mat_upload")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "mat_upload"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#1E3A8A] hover:bg-sky-50"
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>{t.tabMatUpload}</span>
        </button>

        <button
          onClick={() => setActiveTab("les_upload")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "les_upload"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#1E3A8A] hover:bg-sky-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.tabLesUpload}</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "settings"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#1E3A8A] hover:bg-sky-50"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.tabSettings}</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "users"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#1E3A8A] hover:bg-sky-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.tabUsers}</span>
        </button>

        <button
          onClick={() => setActiveTab("announcements")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "announcements"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#1E3A8A] hover:bg-sky-50"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t.tabAnnouncements}</span>
        </button>
      </div>

      {/* TAB 1: STATISTICS & ANALYTICS */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-sky-100 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Studying Users
              </span>
              <span className="text-3xl font-black text-[#1E3A8A]">{stats?.total_users || 0}</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">Active student accounts</span>
            </div>

            <div className="bg-white border border-sky-100 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Uploaded Materials
              </span>
              <span className="text-3xl font-black text-[#0284C7]">{stats?.total_materials || 0}</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">PDFs in Materials Explorer</span>
            </div>

            <div className="bg-white border border-sky-100 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Total Curriculum Lessons
              </span>
              <span className="text-3xl font-black text-[#1E3A8A]">{stats?.total_lessons || 0}</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">With 4 sequential stages</span>
            </div>

            <div className="bg-white border border-sky-100 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Average Test Score
              </span>
              <span className="text-3xl font-black text-emerald-600">{stats?.average_test_score || 0}%</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">Overall exam performance</span>
            </div>
          </div>

          <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1E3A8A] flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Top Daily Streak Leaders</span>
            </h3>

            <div className="space-y-2">
              {stats?.top_students?.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E3A8A]">{s.name}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">{s.email}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-xs font-black">
                    🔥 {s.streak} Days Streak
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD MATERIALS EXPLORER PDF */}
      {activeTab === "mat_upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6 bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1E3A8A] flex items-center space-x-2 border-b border-sky-100 pb-3">
              <FolderPlus className="w-5 h-5 text-[#0284C7]" />
              <span>{t.uploadPdfHeader}</span>
            </h3>

            <form onSubmit={handleUploadMaterial} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Class (1 to 12)</label>
                  <select
                    value={matClass}
                    onChange={(e) => setMatClass(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Academic Term</label>
                  <select
                    value={matTerm}
                    onChange={(e) => setMatTerm(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  >
                    {["Term-1", "Term-2", "Term-3"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#1E3A8A]">Subject</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomMatSubject(!isCustomMatSubject)}
                    className="text-[#0284C7] hover:underline text-[11px] font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.customSubjectToggle}</span>
                  </button>
                </div>

                {isCustomMatSubject ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter subject name e.g. Bio-Chemistry"
                    value={customMatSubject}
                    onChange={(e) => setCustomMatSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  />
                ) : (
                  <select
                    value={matSubject}
                    onChange={(e) => setMatSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  >
                    {standardSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Language Medium</label>
                <select
                  value={matMedium}
                  onChange={(e) => setMatMedium(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="Tamil Medium">தமிழ் Medium (Tamil Medium)</option>
                  <option value="English Medium">English Medium</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Material PDF Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 11 Physics Chapter Notes"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview of reference PDF..."
                  value={matDesc}
                  onChange={(e) => setMatDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Upload PDF File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setMatFile(e.target.files[0])}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingMat}
                className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs"
              >
                {uploadingMat ? "Uploading..." : t.publishBtn}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1E3A8A] flex items-center justify-between border-b border-sky-100 pb-3">
              <span>Materials Explorer Catalog</span>
              <span className="text-xs text-[#0284C7] font-bold">{materialsList.length} PDFs</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {materialsList.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-[#0284C7]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1E3A8A]">{m.title}</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Class {m.class_num} • {m.subject} ({m.medium}) • {m.term}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMaterial(m.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: UPLOAD LEARNING PORTAL MODULE */}
      {activeTab === "les_upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6 bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1E3A8A] flex items-center space-x-2 border-b border-sky-100 pb-3">
              <BookOpen className="w-5 h-5 text-[#0284C7]" />
              <span>{t.uploadLesHeader}</span>
            </h3>

            <form onSubmit={handleUploadLesson} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Class (1 to 12)</label>
                  <select
                    value={lesClass}
                    onChange={(e) => setLesClass(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Term</label>
                  <select
                    value={lesTerm}
                    onChange={(e) => setLesTerm(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  >
                    {["Term-1", "Term-2", "Term-3"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Lesson Sequence</label>
                  <input
                    type="number"
                    min="1"
                    value={lesOrder}
                    onChange={(e) => setLesOrder(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#1E3A8A]">Subject</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomLesSubject(!isCustomLesSubject)}
                    className="text-[#0284C7] hover:underline text-[11px] font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.customSubjectToggle}</span>
                  </button>
                </div>

                {isCustomLesSubject ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter subject name e.g. Computer Applications"
                    value={customLesSubject}
                    onChange={(e) => setCustomLesSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  />
                ) : (
                  <select
                    value={lesSubject}
                    onChange={(e) => setLesSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  >
                    {standardSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Language Medium</label>
                <select
                  value={lesMedium}
                  onChange={(e) => setLesMedium(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="Tamil Medium">தமிழ் Medium (Tamil Medium)</option>
                  <option value="English Medium">English Medium</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Lesson Module Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 1: Newton's Laws & Force"
                  value={lesTitle}
                  onChange={(e) => setLesTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed learning objectives..."
                  value={lesDesc}
                  onChange={(e) => setLesDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Stage 2 Video Embed URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={lesVideoUrl}
                  onChange={(e) => setLesVideoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Stage 1 Lesson Notes PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setLesFile(e.target.files[0])}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingLes}
                className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs"
              >
                {uploadingLes ? "Publishing Lesson..." : t.publishLesBtn}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1E3A8A] flex items-center justify-between border-b border-sky-100 pb-3">
              <span>Learning Modules Catalog</span>
              <span className="text-xs text-[#0284C7] font-bold">{lessonsList.length} Lessons</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {lessonsList.map((l) => (
                <div
                  key={l.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-[#0284C7]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1E3A8A]">{l.title}</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Class {l.class_num} • {l.subject} ({l.medium}) • {l.term} • Lesson #{l.lesson_order}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLesson(l.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: QUESTION & TEST CONFIGURATOR */}
      {activeTab === "settings" && (
        <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-7 shadow-xs max-w-2xl mx-auto space-y-5">
          <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center space-x-2 border-b border-sky-100 pb-3.5">
            <Sparkles className="w-5 h-5 text-[#0284C7]" />
            <span>Gemini AI & Test Engine Configuration</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                Google Gemini AI API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  Stage 3 Practice Questions Count
                </label>
                <input
                  type="number"
                  value={practiceCount}
                  onChange={(e) => setPracticeCount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  Stage 4 Timed Test Question Count
                </label>
                <input
                  type="number"
                  value={testCount}
                  onChange={(e) => setTestCount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs"
            >
              {savingSettings ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: STUDENT RECORDS */}
      {activeTab === "users" && (
        <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#1E3A8A] flex items-center space-x-2 border-b border-sky-100 pb-3">
            <Users className="w-5 h-5 text-[#0284C7]" />
            <span>Registered Student Accounts</span>
          </h3>

          <div className="space-y-3">
            {usersList.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-[#1E3A8A]">{u.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{u.email}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-xs font-black">
                    🔥 {u.streak_count} Days Streak
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: BROADCAST ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-7 shadow-xs max-w-2xl mx-auto space-y-5">
          <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center space-x-2 border-b border-sky-100 pb-3.5">
            <Bell className="w-5 h-5 text-[#0284C7]" />
            <span>Post Announcement</span>
          </h3>

          <form onSubmit={handlePostAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Notice Title</label>
              <input
                type="text"
                required
                placeholder="e.g. TET Model Exam Date Announcement"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">Notice Content</label>
              <textarea
                rows={3}
                required
                placeholder="Write message for students..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={postingAnn}
              className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs"
            >
              {postingAnn ? "Publishing..." : "Broadcast Announcement"}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
