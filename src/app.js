import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "./routes/index.js"

const app = express()

app.use(express.json()) // accepts data in json format 
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(cookieParser())

app.use("/api/v1", routes)

app.get("/",(_req,res) => {
    res.send("hellow there santosh - API")
})
//-req means not using it 


app.all("*", (_req,res) => {
    return res.status(404).json({
        success : false,
        message : "Route not found"
    })
})



export default app;

// how to access login roue
// http://localhost:4000/api/v1/auth/login