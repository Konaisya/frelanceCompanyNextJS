# check_real_tables.py
from config.database import engine
import os

def check_tables():
    print(f"Database file exists: {os.path.exists('./app.db')}")
    print(f"Database file size: {os.path.getsize('./app.db') if os.path.exists('./app.db') else 0} bytes")
    
    with engine.connect() as conn:
        try:
            result = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [row[0] for row in result]
            print("📊 REAL tables in database:", tables)
            
            if not tables:
                print("❌ NO TABLES IN DATABASE!")
            return tables
        except Exception as e:
            print(f"❌ Error checking tables: {e}")
            return []

if __name__ == "__main__":
    check_tables()