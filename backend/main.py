import os
import shutil
import datetime
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional

from database import engine, get_db, Base
import models, schemas, ai_generator

# Remove DB on schema update if needed
db_file = os.path.join(os.path.dirname(__file__), "tet_platform.db")

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TET Platform API", version="1.2.0")

# CORS setup for Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static_uploads", StaticFiles(directory=UPLOAD_DIR), name="static_uploads")

def seed_initial_data(db: Session):
    settings = db.query(models.AdminSettings).first()
    if not settings:
        settings = models.AdminSettings(
            gemini_api_key="",
            practice_question_count=200,
            test_question_count=100,
            test_time_limit_mins=60,
            pass_percentage=60
        )
        db.add(settings)
        db.commit()

    admin = db.query(models.User).filter(models.User.email == "admin@tet.com").first()
    if not admin:
        admin = models.User(
            name="Platform Administrator",
            email="admin@tet.com",
            password_hash="admin123",
            role="admin",
            streak_count=50
        )
        db.add(admin)
        db.commit()

    demo_user = db.query(models.User).filter(models.User.email == "student@tet.com").first()
    if not demo_user:
        demo_user = models.User(
            name="Kavitha S.",
            email="student@tet.com",
            password_hash="student123",
            role="student",
            streak_count=14,
            daily_tasks_done=2,
            daily_tasks_total=4
        )
        db.add(demo_user)
        db.commit()

    if db.query(models.Announcement).count() == 0:
        ann = models.Announcement(
            title="Welcome to TET Platform 2026!",
            content="Official study portal. Admin can upload Class 1 to 12 curriculum materials and lesson modules in the Admin Portal.",
            priority="urgent"
        )
        db.add(ann)
        db.commit()

@app.on_event("startup")
def startup_event():
    db = next(get_db())
    seed_initial_data(db)

# --- AUTH ENDPOINTS ---

@app.post("/api/auth/register", response_model=schemas.UserProfile)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    user = models.User(
        name=user_data.name,
        email=user_data.email,
        password_hash=user_data.password,
        role="student",
        streak_count=1,
        daily_tasks_done=0,
        daily_tasks_total=4
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/api/auth/login", response_model=schemas.UserProfile)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or user.password_hash != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return user

@app.get("/api/user/profile", response_model=schemas.UserProfile)
def get_profile(email: str = "student@tet.com", db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

# --- DASHBOARD ENDPOINT ---

@app.get("/api/dashboard")
def get_dashboard(email: str = "student@tet.com", db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = db.query(models.User).first()

    quotes = [
        "Success is the sum of small efforts repeated day in and day out.",
        "The beautiful thing about learning is that no one can take it away from you.",
        "Every lesson completed today brings you closer to your dream TET score!",
        "Consistency is what transforms average into excellence.",
        "Education is the most powerful weapon which you can use to change the world."
    ]
    quote_of_the_day = quotes[user.id % len(quotes)]

    streak = user.streak_count
    badges = [
        {
            "id": "starter",
            "name": "Quick Starter",
            "required_streak": 3,
            "unlocked": streak >= 3,
            "icon": "Zap",
            "color": "from-amber-400 to-yellow-500"
        },
        {
            "id": "bronze",
            "name": "Bronze Scholar",
            "required_streak": 7,
            "unlocked": streak >= 7,
            "icon": "Award",
            "color": "from-orange-400 to-amber-600"
        },
        {
            "id": "silver",
            "name": "Silver Academic",
            "required_streak": 25,
            "unlocked": streak >= 25,
            "icon": "ShieldCheck",
            "color": "from-slate-300 to-slate-400 text-slate-900"
        },
        {
            "id": "diamond",
            "name": "50 Streak Diamond Legend",
            "required_streak": 50,
            "unlocked": streak >= 50,
            "icon": "Crown",
            "color": "from-[#01949a] to-[#016f74]"
        }
    ]

    announcements = db.query(models.Announcement).order_by(models.Announcement.created_at.desc()).limit(3).all()

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "streak_count": user.streak_count,
            "daily_tasks_done": user.daily_tasks_done,
            "daily_tasks_total": user.daily_tasks_total,
            "progress_percent": int((user.daily_tasks_done / max(1, user.daily_tasks_total)) * 100)
        },
        "quote": quote_of_the_day,
        "badges": badges,
        "announcements": [
            {"id": a.id, "title": a.title, "content": a.content, "priority": a.priority, "date": a.created_at.strftime("%b %d, %Y")}
            for a in announcements
        ]
    }

# --- MATERIALS ENDPOINTS ---

@app.get("/api/materials", response_model=List[schemas.MaterialOut])
def get_materials(
    class_num: int = 10, 
    subject: str = "Tamil", 
    medium: str = "Tamil Medium",
    term: str = "Term-1", 
    db: Session = Depends(get_db)
):
    query = db.query(models.Material).filter(
        models.Material.class_num == class_num,
        models.Material.subject == subject,
        models.Material.term == term
    )
    if subject != "Tamil":
        query = query.filter(models.Material.medium == medium)
        
    return query.all()

@app.get("/api/sample-pdf")
def get_sample_pdf(title: str = "Sample_Material"):
    from fastapi.responses import Response
    pdf_content = f"""%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kinds [/PDF] /Count 1 /Kids [3 0 R]>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R>> endobj
4 0 obj <</Length 120>> stream
BT /F1 24 Tf 100 700 TD ({title.replace('_', ' ')}) Tj ET
BT /F1 14 Tf 100 650 TD (Official TET Platform Study Document) Tj ET
BT /F1 12 Tf 100 600 TD (Tamil Nadu School Curriculum Reference Guide) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000125 00000 n
0000000200 00000 n
trailer <</Size 5 /Root 1 0 R>>
startxref
370
%%EOF"""
    return Response(content=pdf_content.encode('utf-8'), media_type="application/pdf", headers={
        "Content-Disposition": f"inline; filename={title}.pdf"
    })

# --- SEQUENTIAL LEARNING ENDPOINTS ---

@app.get("/api/learning/structure")
def get_learning_structure(
    class_num: int = 10, 
    subject: str = "Tamil", 
    medium: str = "Tamil Medium",
    user_email: str = "student@tet.com", 
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    user_id = user.id if user else 1

    terms = ["Term-1", "Term-2", "Term-3"]
    result_terms = []

    previous_term_completed = True

    for term_name in terms:
        query = db.query(models.Lesson).filter(
            models.Lesson.class_num == class_num,
            models.Lesson.subject == subject,
            models.Lesson.term == term_name
        )
        if subject != "Tamil":
            query = query.filter(models.Lesson.medium == medium)

        lessons = query.order_by(models.Lesson.lesson_order.asc()).all()

        term_lessons = []
        term_all_lessons_completed = True if len(lessons) > 0 else False

        previous_lesson_completed = previous_term_completed

        for les in lessons:
            prog = db.query(models.LessonProgress).filter(
                models.LessonProgress.user_id == user_id,
                models.LessonProgress.lesson_id == les.id
            ).first()

            s1 = prog.stage1_pdf if prog else False
            s2 = prog.stage2_video if prog else False
            s3 = prog.stage3_questions if prog else False
            s4 = prog.stage4_test if prog else False
            score = prog.test_score if prog else 0

            is_fully_done = s1 and s2 and s3 and s4

            if not is_fully_done:
                term_all_lessons_completed = False

            is_locked = not previous_lesson_completed

            term_lessons.append({
                "id": les.id,
                "class_num": les.class_num,
                "subject": les.subject,
                "medium": les.medium,
                "term": les.term,
                "lesson_order": les.lesson_order,
                "title": les.title,
                "description": les.description,
                "pdf_url": les.pdf_url,
                "video_url": les.video_url,
                "stage1_pdf": s1,
                "stage2_video": s2,
                "stage3_questions": s3,
                "stage4_test": s4,
                "is_locked": is_locked,
                "is_completed": is_fully_done,
                "test_score": score
            })

            previous_lesson_completed = is_fully_done

        result_terms.append({
            "term": term_name,
            "is_locked": not previous_term_completed,
            "is_completed": term_all_lessons_completed,
            "lessons": term_lessons
        })

        previous_term_completed = term_all_lessons_completed

    return {
        "class_num": class_num,
        "subject": subject,
        "medium": medium,
        "terms": result_terms
    }

@app.get("/api/learning/lesson/{lesson_id}")
def get_lesson_detail(lesson_id: int, user_email: str = "student@tet.com", db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")

    user = db.query(models.User).filter(models.User.email == user_email).first()
    user_id = user.id if user else 1

    prog = db.query(models.LessonProgress).filter(
        models.LessonProgress.user_id == user_id,
        models.LessonProgress.lesson_id == lesson_id
    ).first()

    if not prog:
        prog = models.LessonProgress(
            user_id=user_id,
            lesson_id=lesson_id,
            stage1_pdf=False,
            stage2_video=False,
            stage3_questions=False,
            stage4_test=False,
            test_score=0
        )
        db.add(prog)
        db.commit()
        db.refresh(prog)

    return {
        "lesson": {
            "id": lesson.id,
            "class_num": lesson.class_num,
            "subject": lesson.subject,
            "medium": lesson.medium,
            "term": lesson.term,
            "title": lesson.title,
            "description": lesson.description,
            "pdf_url": lesson.pdf_url,
            "video_url": lesson.video_url,
        },
        "progress": {
            "stage1_pdf": prog.stage1_pdf,
            "stage2_video": prog.stage2_video,
            "stage3_questions": prog.stage3_questions,
            "stage4_test": prog.stage4_test,
            "test_score": prog.test_score
        }
    }

@app.post("/api/learning/lesson/{lesson_id}/stage/{stage_num}/complete")
def complete_stage(lesson_id: int, stage_num: int, user_email: str = "student@tet.com", db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        user = db.query(models.User).first()

    prog = db.query(models.LessonProgress).filter(
        models.LessonProgress.user_id == user.id,
        models.LessonProgress.lesson_id == lesson_id
    ).first()

    if not prog:
        prog = models.LessonProgress(user_id=user.id, lesson_id=lesson_id)
        db.add(prog)

    if stage_num == 1:
        prog.stage1_pdf = True
    elif stage_num == 2:
        if not prog.stage1_pdf:
            raise HTTPException(status_code=400, detail="Stage 1 must be completed first!")
        prog.stage2_video = True
    elif stage_num == 3:
        if not prog.stage2_video:
            raise HTTPException(status_code=400, detail="Stage 2 must be completed first!")
        prog.stage3_questions = True
    
    db.commit()
    return {"message": f"Stage {stage_num} marked as done successfully!"}

@app.get("/api/learning/lesson/{lesson_id}/questions")
def get_practice_questions(lesson_id: int, count: int = 200, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")

    settings = db.query(models.AdminSettings).first()
    api_key = settings.gemini_api_key if settings else ""
    target_count = settings.practice_question_count if settings else count

    questions = ai_generator.generate_practice_questions(
        class_num=lesson.class_num,
        subject=lesson.subject,
        term=lesson.term,
        lesson_title=lesson.title,
        count=target_count,
        api_key=api_key
    )
    return {"lesson_title": lesson.title, "total": len(questions), "questions": questions}

@app.post("/api/learning/lesson/{lesson_id}/generate-test")
def generate_test(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")

    settings = db.query(models.AdminSettings).first()
    api_key = settings.gemini_api_key if settings else ""
    test_count = settings.test_question_count if settings else 100
    time_limit = settings.test_time_limit_mins if settings else 60

    questions = ai_generator.generate_test_questions(
        class_num=lesson.class_num,
        subject=lesson.subject,
        term=lesson.term,
        lesson_title=lesson.title,
        count=test_count,
        api_key=api_key
    )

    test_payload = []
    for q in questions:
        test_payload.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        })

    return {
        "lesson_id": lesson.id,
        "lesson_title": lesson.title,
        "time_limit_mins": time_limit,
        "total_questions": len(questions),
        "questions": test_payload
    }

@app.post("/api/learning/lesson/{lesson_id}/submit-test")
def submit_test(
    lesson_id: int,
    submission: schemas.TestSubmission,
    user_email: str = "student@tet.com",
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        user = db.query(models.User).first()

    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    settings = db.query(models.AdminSettings).first()
    test_count = settings.test_question_count if settings else 100
    
    ref_questions = ai_generator.generate_test_questions(
        class_num=lesson.class_num,
        subject=lesson.subject,
        term=lesson.term,
        lesson_title=lesson.title,
        count=test_count,
        api_key=settings.gemini_api_key if settings else ""
    )

    correct_count = 0
    detailed_results = []

    for q in ref_questions:
        q_id = str(q["id"])
        user_ans = submission.user_answers.get(q_id, None)
        is_correct = (user_ans == q["answer_index"])
        if is_correct:
            correct_count += 1
        
        detailed_results.append({
            "id": q["id"],
            "question": q["question"],
            "user_answer": user_ans,
            "correct_answer": q["answer_index"],
            "is_correct": is_correct,
            "explanation": q["explanation"]
        })

    score_percent = int((correct_count / max(1, len(ref_questions))) * 100)

    prog = db.query(models.LessonProgress).filter(
        models.LessonProgress.user_id == user.id,
        models.LessonProgress.lesson_id == lesson_id
    ).first()

    if not prog:
        prog = models.LessonProgress(user_id=user.id, lesson_id=lesson_id)
        db.add(prog)

    prog.stage1_pdf = True
    prog.stage2_video = True
    prog.stage3_questions = True
    prog.stage4_test = True
    prog.test_score = score_percent
    prog.completed_at = datetime.datetime.utcnow()

    today_str = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    if user.last_completed_date != today_str:
        user.streak_count += 1
        user.last_completed_date = today_str

    user.daily_tasks_done = min(user.daily_tasks_total, user.daily_tasks_done + 1)
    
    db.commit()

    return {
        "score_percent": score_percent,
        "correct_count": correct_count,
        "total_questions": len(ref_questions),
        "passed": score_percent >= (settings.pass_percentage if settings else 60),
        "new_streak": user.streak_count,
        "results": detailed_results
    }

# --- ADMIN ENDPOINTS ---

@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).filter(models.User.role == "student").count()
    total_materials = db.query(models.Material).count()
    total_lessons = db.query(models.Lesson).count()
    completed_progresses = db.query(models.LessonProgress).filter(models.LessonProgress.stage4_test == True).all()

    avg_score = 0
    if completed_progresses:
        avg_score = int(sum(p.test_score for p in completed_progresses) / len(completed_progresses))

    top_students = db.query(models.User).filter(models.User.role == "student").order_by(models.User.streak_count.desc()).limit(5).all()

    return {
        "total_users": total_users,
        "total_materials": total_materials,
        "total_lessons": total_lessons,
        "average_test_score": avg_score,
        "top_students": [
            {"name": u.name, "email": u.email, "streak": u.streak_count}
            for u in top_students
        ]
    }

# --- DEDICATED UPLOAD 1: MATERIALS EXPLORER UPLOADS ---
@app.get("/api/admin/materials", response_model=List[schemas.MaterialOut])
def admin_get_materials(db: Session = Depends(get_db)):
    return db.query(models.Material).order_by(models.Material.uploaded_at.desc()).all()

@app.post("/api/admin/materials", response_model=schemas.MaterialOut)
def admin_upload_material(
    class_num: int = Form(...),
    subject: str = Form(...),
    medium: str = Form("Tamil Medium"),
    term: str = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(""),
    video_url: Optional[str] = Form(""),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    pdf_filename = "default_material.pdf"
    pdf_url = f"/api/sample-pdf?title={title.replace(' ', '_')}"

    if file:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        pdf_filename = file.filename
        pdf_url = f"/static_uploads/{file.filename}"

    material = models.Material(
        class_num=class_num,
        subject=subject,
        medium=medium,
        term=term,
        title=title,
        description=description,
        pdf_filename=pdf_filename,
        pdf_url=pdf_url,
        video_url=video_url or "https://www.youtube.com/embed/dQw4w9WgXcQ",
        file_size="3.5 MB"
    )
    db.add(material)
    db.commit()
    db.refresh(material)
    return material

@app.delete("/api/admin/materials/{material_id}")
def admin_delete_material(material_id: int, db: Session = Depends(get_db)):
    mat = db.query(models.Material).filter(models.Material.id == material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="Material not found.")
    db.delete(mat)
    db.commit()
    return {"message": "Material deleted successfully."}

# --- DEDICATED UPLOAD 2: LEARNING PORTAL MODULE UPLOADS ---
@app.get("/api/admin/lessons")
def admin_get_lessons(db: Session = Depends(get_db)):
    lessons = db.query(models.Lesson).order_by(models.Lesson.created_at.desc()).all()
    return [
        {
            "id": l.id,
            "class_num": l.class_num,
            "subject": l.subject,
            "medium": l.medium,
            "term": l.term,
            "lesson_order": l.lesson_order,
            "title": l.title,
            "description": l.description,
            "pdf_url": l.pdf_url,
            "video_url": l.video_url
        }
        for l in lessons
    ]

@app.post("/api/admin/lessons")
def admin_upload_lesson(
    class_num: int = Form(...),
    subject: str = Form(...),
    medium: str = Form("Tamil Medium"),
    term: str = Form(...),
    lesson_order: int = Form(1),
    title: str = Form(...),
    description: Optional[str] = Form(""),
    video_url: Optional[str] = Form("https://www.youtube.com/embed/dQw4w9WgXcQ"),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    pdf_url = f"/api/sample-pdf?title={title.replace(' ', '_')}"

    if file:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        pdf_url = f"/static_uploads/{file.filename}"

    lesson = models.Lesson(
        class_num=class_num,
        subject=subject,
        medium=medium,
        term=term,
        lesson_order=lesson_order,
        title=title,
        description=description,
        pdf_url=pdf_url,
        video_url=video_url or "https://www.youtube.com/embed/dQw4w9WgXcQ"
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return {"message": "Learning Portal Lesson Module published successfully!", "lesson_id": lesson.id}

@app.delete("/api/admin/lessons/{lesson_id}")
def admin_delete_lesson(lesson_id: int, db: Session = Depends(get_db)):
    les = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not les:
        raise HTTPException(status_code=404, detail="Lesson module not found.")
    db.delete(les)
    db.commit()
    return {"message": "Lesson module deleted successfully."}

@app.get("/api/admin/users", response_model=List[schemas.UserProfile])
def admin_get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/api/admin/settings", response_model=schemas.AdminSettingsSchema)
def get_admin_settings(db: Session = Depends(get_db)):
    settings = db.query(models.AdminSettings).first()
    if not settings:
        settings = models.AdminSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.put("/api/admin/settings", response_model=schemas.AdminSettingsSchema)
def update_admin_settings(new_settings: schemas.AdminSettingsSchema, db: Session = Depends(get_db)):
    settings = db.query(models.AdminSettings).first()
    if not settings:
        settings = models.AdminSettings()
        db.add(settings)
    
    settings.gemini_api_key = new_settings.gemini_api_key
    settings.practice_question_count = new_settings.practice_question_count
    settings.test_question_count = new_settings.test_question_count
    settings.test_time_limit_mins = new_settings.test_time_limit_mins
    settings.pass_percentage = new_settings.pass_percentage

    db.commit()
    db.refresh(settings)
    return settings

@app.post("/api/admin/announcements")
def create_announcement(ann: schemas.AnnouncementCreate, db: Session = Depends(get_db)):
    new_ann = models.Announcement(
        title=ann.title,
        content=ann.content,
        priority=ann.priority or "normal"
    )
    db.add(new_ann)
    db.commit()
    return {"message": "Announcement posted successfully!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
