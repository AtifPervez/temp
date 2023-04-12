const express=require('express')
const router=require('./router/route')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const app=express()
const multer=require('multer')

app.use(bodyParser.json())

// app.use(multer().any())


app.use(multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"||file.mimetype == "application/pdf") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("BAD REQUEST"));
      }
  }
  }).any());
  app.use(function (e, req, res, next) {
    if (e.message == "BAD REQUEST") return res.status(400).send({ status: false, message: "Only .png, .jpg ,pdf and .jpeg format allowed!" });
  next();
  })

  


 

mongoose.connect('mongodb+srv://atifpervez:34BmDa5XVvtznQvO@code.8mvlc.mongodb.net/temp')


.then(()=>console.log("MongoDb is connected"))

.catch((err)=>console.log(err))

app.use('/',router)

app.listen(3000,()=>console.log("Express server is running on port",3000))