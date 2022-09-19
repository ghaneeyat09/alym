const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors")
// const corsOptions = {
//     origin: 'http://localhost:3002/',
//     optionsSuccessStatus: 200,
//     method: ['GET', 'PUT', 'POST']
// }
const ordersRoute = require("./routes/orders");
const productsRoute = require("./routes/products");
const usersRoute = require("./routes/users");
//require dotenv
require("dotenv").config();

//connection to the db
mongoose.connect(process.env.DB_CONNECTION);

app.use('/uploads', express.static("uploads"))
app.use('/payments', express.static("payments"))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.use("/orders", ordersRoute);
app.use("/products", productsRoute);
app.use("/users", usersRoute);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
});


app.use((req, res, next) => {
    res.send("yoh! we got the server running.");
})


module.exports = app;

