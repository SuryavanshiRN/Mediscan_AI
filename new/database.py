import sqlite3
import pandas as pd
from datetime import datetime

DB_FILE = "radiology_app.db"

def init_db():
    """Initializes the database and creates tables if they don't exist."""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    
    # Table for Patient Diagnosis History
    c.execute('''CREATE TABLE IF NOT EXISTS records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_name TEXT,
                    patient_id TEXT,
                    age INTEGER,
                    sex TEXT,
                    physician TEXT,
                    diagnosis TEXT,
                    confidence REAL,
                    timestamp TEXT
                )''')
    
    # Table for Users (Optional: You can migrate your USERS dict here)
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    username TEXT PRIMARY KEY,
                    password TEXT
                )''')
    
    conn.commit()
    conn.close()

def save_prediction(patient_data, diagnosis, confidence):
    """Saves a single diagnosis record to the database."""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''INSERT INTO records 
                 (patient_name, patient_id, age, sex, physician, diagnosis, confidence, timestamp) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', 
              (patient_data['name'], patient_data['id'], patient_data['age'], 
               patient_data['sex'], patient_data['physician'], diagnosis, 
               confidence, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()

def get_all_records():
    """Returns all records as a Pandas DataFrame for easy viewing in Streamlit."""
    conn = sqlite3.connect(DB_FILE)
    df = pd.read_sql_query("SELECT * FROM records ORDER BY timestamp DESC", conn)
    conn.close()
    return df

# Initialize the DB when this script is run or imported
init_db()