const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const app = express()

const port = process.env.PORT || 5000;
app.use("/", (req,res)=>{
    res.send("hello")
})
app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`)
})