import { Router } from "express"
import { handleRefactor } from "../controllers/refactorController"

const router = Router()

router.post("/", handleRefactor)

export default router
