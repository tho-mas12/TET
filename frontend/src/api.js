const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Server error");
    }
    return await res.json();
  } catch (err) {
    console.warn(`API fallback triggered for ${endpoint}:`, err.message);

    // Fallback data when backend is not running or deployed on static host
    if (endpoint.startsWith("/user/profile") || endpoint.startsWith("/auth/login")) {
      return {
        id: 1,
        name: "Kavitha S. (Teacher Candidate)",
        email: "student@tet.com",
        role: "student",
        streak_count: 14,
        daily_tasks_done: 0,
        daily_tasks_total: 4
      };
    }
    
    if (endpoint.startsWith("/dashboard")) {
      return {
        user: {
          id: 1,
          name: "Kavitha S.",
          email: "student@tet.com",
          role: "student",
          streak_count: 14,
          daily_tasks_done: 0,
          daily_tasks_total: 4,
          progress_percent: 0
        },
        quote: "Education is the most powerful weapon which you can use to change the world.",
        badges: [
          { id: "starter", name: "Quick Starter", required_streak: 3, unlocked: true, color: "from-[#0284C7] to-cyan-500" },
          { id: "bronze", name: "Bronze Scholar", required_streak: 7, unlocked: true, color: "from-amber-500 to-orange-500" },
          { id: "silver", name: "Silver Academic", required_streak: 25, unlocked: false, color: "from-slate-400 to-slate-600" },
          { id: "diamond", name: "50 Streak Diamond Legend", required_streak: 50, unlocked: false, color: "from-[#1E3A8A] to-[#0284C7]" }
        ],
        announcements: [
          { id: 1, title: "Welcome to TET Platform 2026!", content: "Curriculum study guides can be uploaded via the Admin Portal.", priority: "urgent", date: "Sep 05, 2026" }
        ]
      };
    }

    if (endpoint.startsWith("/materials")) {
      return [];
    }

    if (endpoint.startsWith("/learning/structure")) {
      return {
        class_num: 10,
        subject: "Science",
        medium: "Tamil Medium",
        terms: [
          { term: "Term-1", is_locked: false, is_completed: false, lessons: [] },
          { term: "Term-2", is_locked: true, is_completed: false, lessons: [] },
          { term: "Term-3", is_locked: true, is_completed: false, lessons: [] }
        ]
      };
    }

    if (endpoint.includes("/questions")) {
      return {
        lesson_title: "Curriculum Unit",
        total: 5,
        questions: Array.from({ length: 5 }).map((_, idx) => ({
          id: idx + 1,
          question: `Practice Question ${idx + 1}: Core curriculum concept check?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer_index: 0,
          explanation: "Comprehensive study explanation."
        }))
      };
    }

    if (endpoint.startsWith("/admin/stats")) {
      return {
        total_users: 1,
        total_materials: 0,
        total_lessons: 0,
        average_test_score: 0,
        top_students: [
          { name: "Kavitha S.", email: "student@tet.com", streak: 14 }
        ]
      };
    }

    if (endpoint.startsWith("/admin/materials")) return [];
    if (endpoint.startsWith("/admin/lessons")) return [];
    if (endpoint.startsWith("/admin/users")) return [];
    if (endpoint.startsWith("/admin/settings")) {
      return {
        gemini_api_key: "",
        practice_question_count: 200,
        test_question_count: 100,
        test_time_limit_mins: 60,
        pass_percentage: 60
      };
    }

    return {};
  }
}
