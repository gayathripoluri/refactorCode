# **Refactor Bot**

## **Project At A Glance**

<span style="color: #2b6cb0;">`refactorCode` is a developer-focused tool that uses AI to transform existing code into cleaner, more maintainable versions while preserving original behavior.</span>

**Key Goals:**
- **Automated Code Refactoring**
- **Structured Quality Compliance** (SOLID / clean code)
- **Interactive User Feedback** with side-by-side diff and explanation
- **Modular Core** for future LLM provider extensions

## **Tech Stack and Why Each Tech**

- **Node.js 18+:** Stable modern runtime with native ES modules and async/await support.
- **TypeScript:** Strong typing prevents bugs and improves IDE productivity in both backend and frontend.
- **Express:** Minimal REST API framework with flexible middleware and easy route definition.
- **Next.js + React:** Conventions-over-configuration frontend with server-side rendering and built-in routing, ideal for fast local dev and static production builds.
- **Tailwind CSS:** Utility-first styling for consistent theming and quick UI iteration.
- **OpenAI API (GPT-based model):** The refactoring engine, provides semantic understanding of code and can output syntax-correct transformations.
- **Axios:** straightforward Promise-based HTTP client with request/response interceptors.
- **react-diff-viewer-continued:** visual comparison with side-by-side diff for user clarity.
- **react-markdown:** renders explanation markdown safely and cleanly in UI.
- **react-syntax-highlighter:** code formatting with line numbers so users can review output at a glance.

## **Refactoring Principles**

### **1. SOLID and Architecture**
- **Single Responsibility:** Each module does one job.
- **Open/Closed:** Code should be extendable, not modifying existing behavior directly.
- **Liskov Substitution:** Rewritten logic must match original contracts.
- **Interface Segregation:** Prefer focused APIs.
- **Dependency Inversion:** Rely on abstraction, not concrete implementations.

### **2. Clean Code and Readability**
- **Name Clarity:** Use descriptive identifiers and self-documenting naming.
- **Reduced Complexity:** Avoid deep nesting and split large blocks.
- **Formatting:** Keep style consistent across files.

### **3. Smell Reduction**
- **Duplicate Removal:** Avoid code duplication and dead paths.
- **Magic Values:** Replace with constants or named variables.
- **Conditional Simplification:** Flatten complex branches.

### **4. Output Safety**
- **Preserve Behavior:** Keep input-output correctness.
- **Minimal Changes:** Make targeted, low-risk refactors.
- **Review Diff:** Provide clear change preview before applying.

## **Local Setup**

### Backend

```bash
cd backend
npm install
# create .env manually:
# OPENAI_API_KEY=your_api_key_here
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Open Services

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/api/refactor`

## **Usage Workflow**

1. **Paste Code or Upload File** in the frontend editor.
2. **Click “Refactor Now”** to start AI transformation.
3. **Review Output:**
   - Refactored code
   - AI explanation
   - Side-by-side diff
4. **Copy or Integrate** the improved code into your project.

## Customization

- change prompt and response logic in:
  - `backend/src/services/refactorService.ts`
- extend language detection in:
  - `frontend/app/page.tsx` (detectLanguage map)


