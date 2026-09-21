import { openai } from "../config/openai"

export const refactorCode = async (code: string) => {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `
You are a senior software engineer.

When asked to refactor code, output the improved code first, then add a short explanation in bullet points (no more than 3 bullets).
`
      },
      {
        role: "user",
        content: `Refactor the given code, re move all code smells, apply SOLID principles and make the code better.

${code}`
      }
    ]
  })

  return response.choices[0].message.content
}