import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectToDB from "./config/dbConnection.js"
import userRouter from "./routes/user.route.js"
import taskRouter from "./routes/task.route.js"

dotenv.config()
const app=express()
const port=process.env.PORT || 3000
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }));
app.use("/api/v1",userRouter)
app.use("/api/v1",taskRouter)


const startServer=async()=>{

  await connectToDB()
  app.listen(port || 3000,()=>{
    console.log(`App is runnning on port ${process.env.PORT || 3000}`)
  })
}
startServer()
