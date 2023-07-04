const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const globalErrorController = require("./controller/error-controller");
const AppError = require("./util/app-error");

const app = express();

const userRouter = require("./router/user-router");
const storeRouter = require("./router/store-router");
const productRouter = require("./router/product-router");
const cartRouter = require("./router/cart-router");
const favoriteRouter = require("./router/favorite-router");
const reviewRouter = require("./router/review-router");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(express.json());

app.use(fileUpload({ useTempFiles: true }));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/favorite", favoriteRouter);
app.use("/api/v1/review", reviewRouter);

app.all("*", (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorController);

const db = process.env.DATABASE;

async function startServer() {
  const port = process.env.PORT || 8080;
  try {
    const response = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connection successful");

    app.listen(port, () => {
      console.log(`app running on port ${port}`);
    });
    // .then(() => console.log("database connection successful"));
  } catch (error) {
    console.log(error);
  }
}
startServer();
