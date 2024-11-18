const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes); // Base route for users

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Initialize Express App
const app = express();
app.use(bodyParser.json()); // Parse incoming JSON requests

// MongoDB Connection URI
const mongoURI = "mongodb://localhost:27017/bynx_mongo"; // Replace with your DB name
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server Listening
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
