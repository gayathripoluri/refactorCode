# refactorCode

A simple tool that sends source code to an AI service to refactor it (apply SOLID principles, remove code smells, and improve readability).

## Project Structure

- `backend/` - Express API that wraps OpenAI (or other LLM) calls.
- `frontend/` - Next.js UI for submitting code and displaying refactored results.

## Prerequisites

- Node.js 18+ (or compatible) installed.
- An OpenAI API key stored in `.env` files.

## Setup

### 1) Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (this is ignored by git):

```
OPENAI_API_KEY=your_api_key_here
```

### 2) Frontend

```bash
cd frontend
npm install
```

##  Running Locally

### Start the backend

```bash
cd backend
npm start
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend app calls the backend at `http://localhost:5000/api/refactor` by default.

## How It Works

1. You paste source code into the frontend.
2. The frontend sends it to the backend (`/api/refactor`).
3. The backend calls the LLM with a prompt to refactor the code and return a short bullet-point explanation.

## Customizing the Prompt

The backend prompt is defined in `backend/src/services/refactorService.ts`. It currently asks the model to:

- Refactor the provided code
- Remove code smells
- Apply SOLID principles
- Return the improved code followed by a brief bullet-point explanation

---

If you'd like the output format to be stricter (e.g., JSON, fixed headers, or a specific bullet count), update the prompt in that file.
