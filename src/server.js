const express = require("express")
const dotenv = require("dotenv")
dotenv.config()


const  mongoose= require("mongoose")
const projectRouter = require("./routes/project.Routes.js")
const app = express()

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/", projectRouter)

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