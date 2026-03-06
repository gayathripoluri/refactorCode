import { openai } from "../config/openai"

export const refactorCode = async (code: string) => {
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are a senior software engineer.

Refactor the given code to improve readability, structure, and maintainability.

Rules:
- Do NOT add comments
- Do NOT add explanations
- Return ONLY the improved code
- Preserve the original logic
`
      },
      {
        role: "user",
        content: code
      }
    ]
  })

  return response.choices[0].message.content
}