require('dotenv').config()
const express = require('express')

const app = express()


app.get("/",(req,res)=>{
    res.send(`server is working at this port`)
})

module.exports = app