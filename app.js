require('dotenv').config()
const express = require('express')
const home  = require('./routes/home')

const app = express()



app.get("/",(req,res)=>{
    res.send(`Ispe nahi API/v1 PE JAO`)
})

app.use("/api/v1/",home)

module.exports = app