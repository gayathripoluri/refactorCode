import { Request, Response } from "express"
import { refactorCode } from "../services/refactorService"
import { explainCode } from "../services/explainService"

export const handleRefactor = async (req: Request, res: Response) => {
  try {
    const { code } = req.body

    const result = await refactorCode(code)

    res.json({ refactoredCode: result })
  } catch (error) {
    res.status(500).json({ error: "Refactoring failed" })
  }
}

export const handleExplain = async (req: Request, res: Response) => {
  try {
    const { originalCode, refactoredCode } = req.body

    const explanation = await explainCode(originalCode, refactoredCode)

    res.json({ explanation })
  } catch (error) {
    res.status(500).json({ error: "Explanation failed" })
  }
}