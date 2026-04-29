# 🤖 AI Assistant

> A full-stack personal productivity assistant powered by GPT-4o-mini — manage expenses, tasks, reminders, and more through natural language conversation.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **AI Chat** | Talk naturally — the AI understands and acts on your commands |
| 💸 **Expense Tracker** | Log, edit, and delete expenses with full history |
| 📈 **Expense Prediction** | ML model predicts your next day's spending |
| ✅ **Todo Manager** | Create tasks with natural language deadlines |
| 🔔 **Reminders** | Set reminders by just describing them in plain English |
| 🖼️ **Image Classification** | Upload an image and get AI-powered labels |
| 🎨 **Image Generation** | Generate images from a text prompt |
| 🎤 **Voice Input/Output** | Speak your commands, hear the responses |

---

## 🧠 How the AI Chat Works

You type (or speak) anything in plain English. The AI classifies your intent into one of four categories and acts on it instantly:

```
"I spent 200 on food"          →  Logs an expense ₹200
"Add task submit assignment"   →  Creates a todo
"Remind me tomorrow to call"   →  Sets a reminder
"What is the capital of India" →  Answers your question
```

---

## 🛠️ Tech Stack

**Backend**
- 🐍 Python + Flask
- 🍃 MongoDB + Flask-PyMongo
- 🤖 GPT-4o-mini via RapidAPI
- 📊 Scikit-learn (Linear Regression)
- 🔐 bcrypt (password hashing)

**Frontend**
- ⚛️ React 18 + Vite
- 🔀 React Router v6
- 🎤 Web Speech API (voice in/out)

---

## 📁 Project Structure

```
ai-assistant/
├── backend/
│   ├── app.py              # All Flask routes & logic
│   ├── requirements.txt
│   ├── .env                # Your secret keys (never commit this)
│   └── .env.example        # Template for others
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, SkillsInput etc.
│   │   ├── pages/          # Dashboard, Chat, Expenses, Todos, Reminders, Image
│   │   ├── App.jsx
│   │   └── api.js
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-assistant.git
cd ai-assistant
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Create your `.env` file
```bash
cp .env.example .env
```
Fill in your values:
```env
SECRET_KEY=your_flask_secret_key

MONGO_URI=mongodb:

CLIENT_ORIGIN=

RAPIDAPI_KEY=
RAPIDAPI_HOST=
RAPIDAPI_URL=

IMAGE_CLASSIFY_HOST=
IMAGE_CLASSIFY_URL=

IMAGE_GENERATE_HOST=
IMAGE_GENERATE_URL=
```

### 4. Run the backend
```bash
python app.py
```
Backend runs on `http://localhost:5000`

### 5. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET | `/me` | Get current session user |

### Core
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Dashboard stats + prediction |
| POST | `/chat` | Send a message to the AI |
| GET | `/chat/history` | Get chat history |

### Expenses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/expenses` | List all expenses |
| POST | `/expenses` | Add an expense |
| PUT | `/expenses/<id>` | Update an expense |
| DELETE | `/expenses/<id>` | Delete an expense |

### Todos
| Method | Endpoint | Description |
|---|---|---|
| GET | `/todos` | List all todos |
| POST | `/todos` | Create a todo |
| PUT | `/todos/<id>` | Update a todo |
| DELETE | `/todos/<id>` | Delete a todo |

### Reminders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/reminders` | List all reminders |
| POST | `/reminders` | Create a reminder |
| PUT | `/reminders/<id>` | Update a reminder |
| DELETE | `/reminders/<id>` | Delete a reminder |

### Image
| Method | Endpoint | Description |
|---|---|---|
| POST | `/image/classify` | Classify an uploaded image |
| POST | `/image/generate` | Generate image from prompt |

---

## 🔒 Security

- Passwords are hashed using **bcrypt** — never stored as plain text
- All routes (except signup/login) protected by `@login_required`
- Secrets managed via `.env` — never committed to Git
- CORS restricted to frontend origin only

---

## 📦 Requirements

```txt
flask
flask-cors
flask-pymongo
python-dotenv
bcrypt
requests
scikit-learn
pandas
numpy
dateparser
```

Install all:
```bash
pip install -r requirements.txt
```

---

## 🚀 Future Improvements

- [ ] JWT authentication (replace Flask sessions)
- [ ] Google OAuth login
- [ ] Push notifications for reminders
- [ ] Expense charts and analytics
- [ ] Docker support
- [ ] Unit tests with pytest

--- 
