const express = require('express');
const port = 8000;
// const cors = require("cors");
// const bodyParser = require("body-parser");
const app = express();
const jwt = require('jsonwebtoken');
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use('/public', express.static('public'))

app.use(express.json());

//cek token expire 
// app.get("/verify/:token", (req, res)=>{
//     const {token} = req.params
  
//     // Verifying the JWT token 
//     jwt.verify(token, 'qodars97', function(err, decoded) {
//         if (err) {
//             console.log(err);
//             res.send("Email verification failed, possibly the link is invalid or expired");
//         }
//         else {
//             res.send("Email verifified successfully");
//         }
//     })
// });

//db
const db = require("./models");
db.sequelize.sync({ alter: true});

//routes
const { authRoutes } = require('./routes');


//middleware
app.use("/auth", authRoutes)

app.listen(port, function(){
    console.log(`server is running ${port}`);
})