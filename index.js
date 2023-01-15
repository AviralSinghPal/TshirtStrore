const app = require("./app")
const connectWithDb = require("./config/db")
require('dotenv').config()

const {PORT}= process.env

connectWithDb();//connecting with DB

app.listen(PORT,()=>{
    // console.log(`&{PORT}`);
    console.log(`App is running at :${PORT}`);
    // console.log(PORT);
})