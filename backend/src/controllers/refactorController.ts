import { Request, Response } from "express"
import { refactorCode } from "../services/refactorService"

export const handleRefactor = async (req: Request, res: Response) => {
  const { code } = req.body
  const result = await refactorCode(code)
  res.json({ result })
}
