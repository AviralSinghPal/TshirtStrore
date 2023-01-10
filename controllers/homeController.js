exports.home=(req,res)=>{
    res.status(200).json({
        success: "true",
        message: "This home route is working perfectly fine."
    })
}
exports.homeDummy=(req,res)=>{
    res.send("<h1> DUMMY ROUTE </h1>")
}
