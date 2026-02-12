import express from "express"
import cors from "cors"
import refactorRoutes from "./routes/refactorRoutes"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("RefactorBot API is running 🚀")
})

app.use("/api/refactor", refactorRoutes)

export default app
