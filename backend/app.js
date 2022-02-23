const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const MY_MONGODB_ACCESS = process.env.MONGODB_ACCESS;

const path = require("path");

const sauceRoutes = require("./routes/sauce");

const userRoutes = require("./routes/user");

const rateLimit = require("express-rate-limit");

mongoose
  .connect(MY_MONGODB_ACCESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api", apiLimiter);
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
