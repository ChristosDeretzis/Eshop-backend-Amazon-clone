const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
require('./db/mongoose');

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);

module.exports = app