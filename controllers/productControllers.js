
const BigPromise = require('../middleware/bigPromise')

exports.testProd = async(req,res)=>{
    res.status(200).json({
        success: true,
        greeting: "aa gye product route mei"
    });
};