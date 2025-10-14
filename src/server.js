const express = require("express")
const dotenv = require("dotenv")
dotenv.config()

const  mongoose= require("mongoose")
const projectRouter = require("./routes/project.Routes.js")
const blogRouter = require("./routes/blog.Routes.js")
const authRouter = require("./routes/auth.Routes.js")
const app = express()

const port = process.env.PORT || 5000;

const cors = require('cors');
const contactRouter = require("./routes/contact.Routes.js")

// Allow requests from your frontend origin
app.use(cors({
  origin: 'https://cms-eazybyts.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods if needed
  allowedHeaders: ['Content-Type', 'Authorization'], // If using tokens later
}));

app.use(express.json());
app.use("/", projectRouter)
app.use("/", blogRouter)
app.use("/", contactRouter)
app.use("/api/auth", authRouter)

async function Bootstrap() {
   try{
    mongoose.connect(process.env.MONGODB_URL,
        {dbName:process.env.DATABASE_NAME}
    )
      console.log("Connected to MongoDB")

      app.get("/", (req, res) => {
      res.send(" CMS Backend is running successfully on Render!");
    });
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