# Code Review

## Code comments
(python)

Using f-strings to build SQL queries is a security risk because it allows 
user input to be inserted directly into the query, which can lead to an SQL injection.<br>
Plain insterts are being used instead of upserts which can cause an error or result 
in duplicate rows of data. <br>
Database connection is opened, but never closed which can lead to resource issues. <br>
No validation of fields, should throw an error if an email is empty instead of adding an empty 
string into the database. <br> 


(168 and 173) This should use parameterized queries with (?) as a placeholder, so the
values are treated as data instead of SQL. Also change 'INSERT' to 'INSERT ... ON CONFLICT'. <br>
(156) No error handling if the JSON is not valid<br>
(136) If teh secret is missing the app should fail to start

------------------------------------------------------------------------

## Follow-up Questions

1.  Share your prompts and the AI outputs.
2.  For each prompt:
    -   Tell us what you were hoping for the AI to accomplish.
    -   Tell us what it actually did.
    -   Did you have to re-prompt it based on its output?
    -   If you had to change your approach, why?
<br>

**Prompt 1**: This can lead to sql injection, right?
``` python
# Store raw payload for auditing / debugging
    cur.execute(
        f"INSERT INTO webhook_audit(email, raw_json) VALUES ('{email}', '{raw.decode('utf-8')}')"
    )

    # Upsert user
    cur.execute(
        f"INSERT INTO users(email, role) VALUES('{email}', '{role}')"
    )
```
Accomplish: I was fairly certain that this could lead to SQL injection and wnated
to double check. <br>

Actually Did: It answered my question and then gave a fix to the problem.<br>

Change: It gave a little bit more information than I required, so I could have
been more specific in what I wanted in the prompt.<br>
<br>
**Prompt 2**:
Correct syntax for an upsert in sqlite <br>

Accomplish: I knew that the code was just useing a regular INSERT instead of an UPSERT,
but wasn't sure on the correct syntax of one in SQLite. <br>

Acually Did: It answered my question and then explained the key points before showing
a lot of examples. <br>

Change: Just like the last prompt it asnwered my question right at the start, but than continued 
on giving more information than I asked for. Being more spefic seems to be the best course of action,
so there is less left up for interretation.

------------------------------------------------------------------------

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

