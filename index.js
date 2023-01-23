const app = require("./app");
const connectWithDb = require("./config/db");
require("dotenv").config();

// const {PORT}= process.env;

// console.log(process.env.DB_URL);
// console.log(process.env.PORT);
connectWithDb();//connecting with DB

app.listen(process.env.DEV_PORT, () => {
    console.log(`Server is running at port: ${process.env.DEV_PORT}`);
  });