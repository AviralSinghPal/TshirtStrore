const mongoose = require('mongoose')

const connectWithDb = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(console.log(`DB got Connected`))
    .catch((error)=>{
        console.log(`DV connection issues`);
        console.log(error);
        process.exit(1);
    })
}

module.exports = connectWithDb