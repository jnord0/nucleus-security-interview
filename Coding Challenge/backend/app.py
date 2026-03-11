from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect('calculator.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expression TEXT,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    return conn

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    a = float(data['a'])
    b = float(data['b'])
    op = data['operator']

    if op == '+':   result = a + b
    elif op == '-': result = a - b
    elif op == '*': result = a * b
    elif op == '/':
        if b == 0:
            return jsonify({'error': 'Division by zero'}), 400
        result = a / b
    else:
        return jsonify({'error': 'Invalid operator'}), 400

    expression = f"{a} {op} {b}"
    db = get_db()
    db.execute('INSERT INTO history (expression, result) VALUES (?, ?)', (expression, str(result)))
    db.commit()
    db.close()

    return jsonify({'result': result, 'expression': expression})

@app.route('/history', methods=['GET'])
def history():
    db = get_db()
    rows = db.execute('SELECT expression, result, timestamp FROM history ORDER BY timestamp DESC LIMIT 20').fetchall()
    db.close()
    return jsonify([{'expression': r[0], 'result': r[1], 'timestamp': r[2]} for r in rows])

@app.route('/history', methods=['DELETE'])
def clear_history():
    db = get_db()
    db.execute('DELETE FROM history')
    db.commit()
    db.close()
    return jsonify({'message': 'History cleared'})

if __name__ == '__main__':
    app.run(debug=True)