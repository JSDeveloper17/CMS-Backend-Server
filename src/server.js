const express = require("express")
const dotenv = require("dotenv")
dotenv.config()


const  mongoose= require("mongoose")
const app = express()
const port = process.env.PORT || 5000;
app.use("/", (req,res)=>{
    res.send("hello")
})

async function Bootstrap() {
   try{
    mongoose.connect(process.env.MONGODB_URL,
        {dbName:"CMS"}
    )
      console.log("Connected to MongoDB")
      app.listen(port, ()=>{
          console.log(`app is listening on port ${port}`)
      })
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }
    
}
Bootstrap()