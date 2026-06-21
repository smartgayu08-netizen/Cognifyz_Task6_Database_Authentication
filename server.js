const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://localhost:27017/myappDB")
.then(() => console.log("MongoDB Connected 👍"))
.catch(err => console.log(err));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
const User = require("./models/User");

// Register route
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User registered successfully 👍");
  } catch (err) {
    res.send(err.message);
  }
});