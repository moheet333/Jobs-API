require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet"); // secure http headers
const cors = require("cors"); // allow others access
const xss = require("xss-clean"); // clean the req and res from user
const rateLimiter = require("express-rate-limit"); // limit the rate of req

const express = require("express");
const app = express();

// connectDB
const connectDB = require("./db/connect");
// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticationMiddleware = require("./middleware/authentication");

app.set("trust proxy", 3);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes
app.get("/", (req, res) => {
  res.send("Jobs API");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticationMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
