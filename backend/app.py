import json
import os
import re
from datetime import datetime, timedelta, timezone
import dateparser
from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd
from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_pymongo import PyMongo
import requests

load_dotenv()

app = Flask(__name__)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.secret_key = os.getenv("SECRET_KEY")
RAPID_API_KEY = os.getenv("RAPID_API_KEY")
RAPID_API_HOST = os.getenv("RAPID_API_HOST")
RAPID_API_URL = os.getenv("RAPID_API_URL")
CLIENT_ORIGIN = os.getenv("CLIENT_ORIGIN")
IMAGE_GENERATE_HOST = os.getenv("IMAGE_GENERATE_HOST")
IMAGE_GENERATE_URL = os.getenv("IMAGE_GENERATE_URL")
IMAGE_CLASSIFICATION_HOST = os.getenv("IMAGE_CLASSIFICATION_HOST")
IMAGE_CLASSIFICATION_URL = os.getenv("IMAGE_CLASSIFICATION_URL")    

CORS(app, resources={r"/*": {"origins": [CLIENT_ORIGIN]}}, supports_credentials=True)

mongo = PyMongo(app)



def login_required(fn):
    from functools import wraps

    @wraps(fn)
    def wrapper(*args, **kwargs):
        if "email" not in session:
            return jsonify({"msg": "Not logged in"}), 401
        return fn(*args, **kwargs)

    return wrapper


def iso_today_str():

    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%Y-%m-%d")


def to_safe_id(doc):
    doc["_id"] = str(doc["_id"])
    return doc







def call_ai_parser(query: str):
    """Call GPT model to extract structured intent (expense, todo, reminder, general)."""
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a parser. Extract structured data from natural text. "
                    "Supported intents: expense, todo, reminder, general. "
                    "Return ONLY valid JSON with keys: {type, fields}. "
                    "Examples:\n"
                    "User: I spent 200 on food yesterday\n"
                    "Output: {\"type\":\"expense\", \"fields\":{\"item\":\"food\",\"amount\":200}}\n\n"
                    "User: remind me tomorrow to submit assignment\n"
                    "Output: {\"type\":\"reminder\", \"fields\":{\"when\":\"tomorrow\",\"text\":\"submit assignment\"}}\n\n"
                    "User: add task buy groceries\n"
                    "Output: {\"type\":\"todo\", \"fields\":{\"task\":\"buy groceries\"}}\n\n"
                    "User: add a task for 23rd of August to submit the product\n"
                    "Output: {\"type\":\"todo\", \"fields\":{\"task\":\"submit the product\", \"when\":\"23rd of August\"}}\n\n"
                    "User: what is the capital of France?\n"
                    "Output: {\"type\":\"general\",\"fields\":{\"query\":\"what is the capital of France?\"}}"
                )
            },
            {"role": "user", "content": query},
        ],
    }

    headers = {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": RAPID_API_HOST,
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(RAPID_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        raw_content = data["choices"][0]["message"]["content"].strip()
        print(data)
        return json.loads(raw_content)
    except Exception as e:
        print("AI parser error:", e)
        return None


def extract_date_from_text(text: str):
    """Use dateparser to convert natural text into a real date (YYYY-MM-DD)."""
    if not text:
        return None
    parsed = dateparser.parse(text, settings={"RELATIVE_BASE": datetime.now()})
    if parsed:
        return parsed.strftime("%Y-%m-%d")
    return None


def parse_natural_commands(user_email: str, text: str, mongo):
    created_msgs = []
    result = call_ai_parser(text)

    if not result or "type" not in result:
        return ["Sorry, I couldn't understand that."]

    intent_type = result["type"]
    fields = result.get("fields", {})

    if intent_type == "expense":
        item = fields.get("item", "unknown")
        amount = float(fields.get("amount", 0))
        entry = {
            "user": user_email,
            "item": item,
            "amount": amount,
            "date": datetime.now().date().isoformat(),
            "createdAt": datetime.utcnow().isoformat(),
        }
        mongo.db.expenses.insert_one(entry)
        created_msgs.append(f"Added expense: {item} ₹{amount:,.0f}")

    elif intent_type == "todo":
        task = fields.get("task", "Untitled Task")
        when_raw = fields.get("when", "")
        parsed_date = extract_date_from_text(when_raw) if when_raw else None

        todo = {
            "user": user_email,
            "task": task,
            "deadline": parsed_date if parsed_date else "",
            "important": False,
            "done": False,
            "createdAt": datetime.utcnow().isoformat(),
        }
        mongo.db.todos.insert_one(todo)
        if parsed_date:
            created_msgs.append(f"Added task: {task} (deadline {parsed_date})")
        else:
            created_msgs.append(f"Added task: {task} (no date)")

    elif intent_type == "reminder":
        when_raw = fields.get("when", "")
        text_msg = fields.get("text", "")
        parsed_date = extract_date_from_text(when_raw) if when_raw else None

        rem = {
            "user": user_email,
            "text": text_msg,
            "datetime": parsed_date if parsed_date else "",
            "createdAt": datetime.utcnow().isoformat(),
        }
        mongo.db.reminders.insert_one(rem)
        if parsed_date:
            created_msgs.append(f"Added reminder: {text_msg} on {parsed_date}")
        else:
            created_msgs.append(f"Added reminder: {text_msg} (no date)")

    elif intent_type == "general":
        query = fields.get("query", text)
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": query},
            ],
        }
        headers = {
            "x-rapidapi-key": RAPID_API_KEY,
            "x-rapidapi-host": RAPID_API_HOST,
            "Content-Type": "application/json",
        }
        try:
            resp = requests.post(RAPID_API_URL, json=payload, headers=headers, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            answer = data["choices"][0]["message"]["content"].strip()
            answer = clean_ai_response(answer)
            created_msgs.append(answer)

        except Exception as e:
            print("General AI query error:", e)
            created_msgs.append("Sorry, I couldn't answer that.")

    else:
        created_msgs.append("Unknown intent received.")

    return created_msgs


def clean_ai_response(text: str) -> str:
    """
    Cleans AI text by removing Markdown symbols and adding indentation.
    """
    if not text:
        return ""


    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"_([^_]+)_", r"\1", text)


    text = re.sub(r"^\s*\d+\.\s*", "    • ", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*-\s*", "    • ", text, flags=re.MULTILINE)


    text = re.sub(r"\n{2,}", "\n\n", text)

    return text.strip()




@app.post("/signup")
def signup():
    data = request.get_json(force=True)
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"msg": "Email & password required"}), 400
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 400
    mongo.db.users.insert_one({"email": email, "password": password, "createdAt": datetime.utcnow().isoformat()})
    return jsonify({"msg": "User created"}), 201


@app.post("/login")
def login():
    data = request.get_json(force=True)
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    user = mongo.db.users.find_one({"email": email})
    if user and user.get("password") == password:
        session["email"] = email
        return jsonify({"msg": "Logged in", "email": email})
    return jsonify({"msg": "Invalid credentials"}), 401


@app.get("/me")
@login_required
def me():
    return jsonify({"email": session["email"]})


@app.post("/logout")
@login_required
def logout():
    session.pop("email", None)
    return jsonify({"msg": "Logged out"})



@app.get("/api/dashboard")
@login_required
def dashboard():
    email = session["email"]
    today = iso_today_str()
    chats_today = mongo.db.chats.count_documents({"user": email, "date": today})
    expenses_today = sum(e.get("amount", 0) for e in mongo.db.expenses.find({"user": email, "date": today}))
    open_todos = mongo.db.todos.count_documents({"user": email, "done": False})
    upcoming_rem = mongo.db.reminders.count_documents({"user": email})
    return jsonify({
        "chats": chats_today,
        "expenses": expenses_today,
        "todos": open_todos,
        "reminders": upcoming_rem,
        "predictedExpense": predict_next_expense(email)
    })



@app.post("/chat")
@login_required
def chat():
    email = session["email"]
    q = (request.get_json(force=True) or {}).get("query", "").strip()
    if not q:
        return jsonify({"response": "Please type something."})

    
    created = parse_natural_commands(email, q, mongo)
    if created:
        ai_text = "\n" + "; ". join(created)


    mongo.db.chats.insert_one({
        "user": email,
        "query": q,
        "response": ai_text,
        "date": iso_today_str(),
        "createdAt": datetime.utcnow().isoformat(),
    })

    return jsonify({"response": ai_text})


@app.get("/chat/history")
@login_required
def chat_history():
    email = session["email"]
    docs = [to_safe_id(d) for d in mongo.db.chats.find({"user": email}).sort("createdAt", -1)]
    return jsonify(docs)



@app.get("/expenses")
@login_required
def list_expenses():
    email = session["email"]
    docs = [to_safe_id(d) for d in mongo.db.expenses.find({"user": email}).sort("createdAt", 1)]
    return jsonify(docs)


@app.post("/expenses")
@login_required
def create_expense():
    email = session["email"]
    data = request.get_json(force=True)
    entry = {
        "user": email,
        "item": data.get("item", ""),
        "amount": float(data.get("amount", 0)),
        "date": (data.get("date") or iso_today_str()),
        "createdAt": datetime.utcnow().isoformat(),
    }
    _id = mongo.db.expenses.insert_one(entry).inserted_id
    entry["_id"] = str(_id)
    return jsonify(entry), 201
def predict_next_expense(user_email):

    data = list(mongo.db.expenses.find({"user": user_email}, {"_id": 0, "amount": 1, "date": 1}))
    if len(data) < 2:
        return 0  

    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    df.sort_values("date", inplace=True)
    df["day"] = (df["date"] - df["date"].min()).dt.days

    X = df[["day"]].values
    y = df["amount"].values

    model = LinearRegression()
    model.fit(X, y)

    next_day = np.array([[df["day"].max() + 1]])
    prediction = model.predict(next_day)[0]
    return round(prediction, 2)


@app.route("/api/predict_expense", methods=["GET"])
def get_prediction():
    user_email = session["email"]
    predicted = predict_next_expense(user_email)
    return jsonify({"predicted_expense": predicted})

@app.put("/expenses/<_id>")
@login_required
def update_expense(_id):
    email = session["email"]
    data = request.get_json(force=True)
    update = {k: v for k, v in data.items() if k in {"item", "amount", "date"}}
    mongo.db.expenses.update_one({"_id": ObjectId(_id), "user": email}, {"$set": update})
    doc = mongo.db.expenses.find_one({"_id": ObjectId(_id), "user": email})
    return jsonify(to_safe_id(doc)) if doc else (jsonify({"msg": "Not found"}), 404)


@app.delete("/expenses/<_id>")
@login_required
def delete_expense(_id):
    email = session["email"]
    mongo.db.expenses.delete_one({"_id": ObjectId(_id), "user": email})
    return jsonify({"deleted": True})



@app.get("/todos")
@login_required
def list_todos():
    email = session["email"]
    docs = [to_safe_id(d) for d in mongo.db.todos.find({"user": email}).sort("createdAt", 1)]
    return jsonify(docs)


@app.post("/todos")
@login_required
def create_todo():
    email = session["email"]
    data = request.get_json(force=True)
    todo = {
        "user": email,
        "task": data.get("task", ""),
        "deadline": data.get("deadline") or iso_today_str(),
        "important": bool(data.get("important", False)),
        "done": False,
        "createdAt": datetime.utcnow().isoformat(),
    }
    _id = mongo.db.todos.insert_one(todo).inserted_id
    todo["_id"] = str(_id)
    return jsonify(todo), 201


@app.put("/todos/<_id>")
@login_required
def update_todo(_id):
    email = session["email"]
    data = request.get_json(force=True)
    update = {k: v for k, v in data.items() if k in {"task", "deadline", "important", "done"}}
    mongo.db.todos.update_one({"_id": ObjectId(_id), "user": email}, {"$set": update})
    doc = mongo.db.todos.find_one({"_id": ObjectId(_id), "user": email})
    return jsonify(to_safe_id(doc)) if doc else (jsonify({"msg": "Not found"}), 404)


@app.delete("/todos/<_id>")
@login_required
def delete_todo(_id):
    email = session["email"]
    mongo.db.todos.delete_one({"_id": ObjectId(_id), "user": email})
    return jsonify({"deleted": True})



@app.get("/reminders")
@login_required
def list_reminders():
    email = session["email"]
    docs = [to_safe_id(d) for d in mongo.db.reminders.find({"user": email}).sort("datetime", 1)]
    return jsonify(docs)


@app.post("/reminders")
@login_required
def create_reminder():
    email = session["email"]
    data = request.get_json(force=True)
    rem = {
        "user": email,
        "text": data.get("text", ""),
        "datetime": data.get("datetime") or datetime.utcnow().isoformat(),
        "createdAt": datetime.utcnow().isoformat(),
    }
    _id = mongo.db.reminders.insert_one(rem).inserted_id
    rem["_id"] = str(_id)
    return jsonify(rem), 201


@app.put("/reminders/<_id>")
@login_required
def update_reminder(_id):
    email = session["email"]
    data = request.get_json(force=True)
    update = {k: v for k, v in data.items() if k in {"text", "datetime"}}
    mongo.db.reminders.update_one({"_id": ObjectId(_id), "user": email}, {"$set": update})
    doc = mongo.db.reminders.find_one({"_id": ObjectId(_id), "user": email})
    return jsonify(to_safe_id(doc)) if doc else (jsonify({"msg": "Not found"}), 404)


@app.delete("/reminders/<_id>")
@login_required
def delete_reminder(_id):
    email = session["email"]
    mongo.db.reminders.delete_one({"_id": ObjectId(_id), "user": email})
    return jsonify({"deleted": True})



@app.post("/image/classify")
@login_required
def classify_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    url = IMAGE_CLASSIFICATION_URL

    payload = {file.read()}
    headers = {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": IMAGE_CLASSIFICATION_HOST,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, data=payload, headers=headers)

    print(response.json())

    try:
        data = response.json()
        print(data)
    except:
        return jsonify({"error": "Invalid response from API"}), 500


    return jsonify({"result": data})

@app.post("/image/generate")
@login_required
def generate_image():
    prompt = (request.get_json(force=True) or {}).get("prompt", "seed")


    url = IMAGE_GENERATE_URL

    payload = {
        "prompt": prompt,
        "style_id": 2,
        "size": "1-1"
    }
    headers = {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": IMAGE_GENERATE_HOST,
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)

    print(response.json())
    data = response.json()

    image_url = data["final_result"][0]["origin"]

    print(image_url)


    return jsonify({"url": image_url})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)