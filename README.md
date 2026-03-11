# Calculator App

A web-based calculator with a JavaScript frontend and Python/Flask backend.

## Project Structure

```
/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   └── app.py
├── README.md
└── Engineering_Intern_Interview_Questions.md
```

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Percent and sign toggle
- Calculation history saved to a database
- Keyboard support
- Input capped at 10 digits

## Requirements

- Python 3
- pip

## Setup

### 1. Install backend dependencies

```bash
pip install flask flask-cors
```

### 2. Start the Flask server

```bash
cd backend
python3 app.py
```

The backend will run at `http://127.0.0.1:5000`

### 3. Open the frontend

Open `index.html` with a local server such as VS Code Live Server. It will run at `http://127.0.0.1:5500`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/calculate` | Performs calculation and saves to history |
| GET | `/history` | Returns last 20 calculations |
| DELETE | `/history` | Clears all history |

### POST /calculate

Request body:
```json
{ "a": 5, "b": 3, "operator": "+" }
```

Response:
```json
{ "result": 8, "expression": "5.0 + 3.0" }
```

