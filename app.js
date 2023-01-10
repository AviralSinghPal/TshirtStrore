require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const home  = require('./routes/home')

const app = express()

app.use(morgan("tiny"))

app.get("/",(req,res)=>{
    res.send(`Ispe nahi API/v1 PE JAO`)
})

app.use("/api/v1/",home)
  
module.exports = app