require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const home  = require('./routes/home')
const user  = require('./routes/user')

const app = express()

app.use(cookieParser())
app.use(fileUpload())
app.use(morgan("tiny"))//morgan middle ware

//regular middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))



app.get("/",(req,res)=>{
    res.send(`Ispe nahi API/v1 PE JAO`)
})

app.use("/api/v1/",home)
app.use("/api/v1/",user)

module.exports = app