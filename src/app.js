import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json()) // accepts data in json format 
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(cookieParser())



export default app;