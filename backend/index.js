const express = require('express');
const port = 8000;
// const cors = require("cors");
// const bodyParser = require("body-parser");
const app = express();

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use('/public', express.static('public'))

app.use(express.json());


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