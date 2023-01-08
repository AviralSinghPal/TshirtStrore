const app = require("./app")
require('dotenv').config()

const {PORT}= process.env
app.listen(PORT,()=>{
    // console.log(`&{PORT}`);
    console.log(`App is running at :${PORT}`);
    // console.log(PORT);
})