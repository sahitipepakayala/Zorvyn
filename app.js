const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes (we will create later)
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/records", require("./routes/recordRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;