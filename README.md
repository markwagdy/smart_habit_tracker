🧠 Smart Habit Tracker
Smart Habit Tracker is a full-stack web application that helps users build better habits through daily logging and streak tracking. Users can register, log in, create habits, and track their progress. The app automatically resets streaks using background tasks via Celery.

✨ Features
User registration & JWT authentication

Create, update, and delete habits

Daily habit logging & automatic streak tracking

Streak reset if habit is missed (via Celery)

Calendar view of logged habits (frontend)

Light/Dark mode (frontend)

Responsive UI with React + Material UI

🛠️ Tech Stack
Layer	Tech
Frontend	React, Material UI (MUI)
Backend	Django, Django REST Framework
Auth	JWT (via SimpleJWT)
Task Queue	Celery
DB	SQLite (dev), PostgreSQL (prod)
Broker	Redis

📁 Project Structure
csharp
Copy
Edit
smart-habit-tracker/
├── backend/                   # Django project
│   ├── habits/                # Main app
│   ├── smart_habit_tracker/   # Project settings
│   ├── requirements.txt
│   └── manage.py
├── frontend/                  # React app
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
🚀 Getting Started
Prerequisites
Python 3.10+

Node.js + npm

Redis (for Celery)

Backend Setup
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
To run Celery worker (in a new terminal):

bash
Copy
Edit
celery -A smart_habit_tracker worker --loglevel=info
Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
✅ API Endpoints
POST /register/ → Register new user

POST /login/ → Obtain JWT

GET /habits/ → List habits

POST /habits/ → Create habit

POST /habits/{id}/add_log/ → Log a habit for today

🧪 Running Tests
Backend:

bash
Copy
Edit
python manage.py test
Frontend (if tests are written):

bash
Copy
Edit
npm test
📄 License
MIT

