import express from "express"
import { handleRefactor, handleExplain } from "../controllers/refactorController"

const router = express.Router()

router.post("/", handleRefactor)

router.post("/explain", handleExplain)

export default router