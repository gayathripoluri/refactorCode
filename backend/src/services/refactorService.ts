import { openai } from "../config/openai"

export const refactorCode = async (code: string) => {
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are an expert software engineer.Refactor the given code to improve readability and maintainability.Avoid unnecessary functions or over-engineering.Keep the logic identical.Return only the improved code."
      },
      {
        role: "user",
        content: code
      }
    ]
  })

  return response.choices[0].message.content
}