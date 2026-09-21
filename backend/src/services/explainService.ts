import { openai } from "../config/openai"

export const explainCode = async (
  originalCode: string,
  refactoredCode: string
) => {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `
You are a senior developer performing a code review.

Explain clearly:

1. Code quality score out of 10
2. Specific issues in the original code
3. Exact improvements made
4. Why those improvements matter

Focus on:
- naming
- readability
- nesting
- unnecessary variables
- formatting

Respond in clean markdown format.

Use sections:

### Code Quality Score
### Issues in Original Code
### Improvements Made
### Why It Is Better

Use bullet points.
`
      },
      {
        role: "user",
        content: `
Original Code:
${originalCode}

Refactored Code:
${refactoredCode}
`
      }
    ]
  })

  return response.choices[0].message.content
}