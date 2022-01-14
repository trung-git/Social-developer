const express = require("express");
const connectDB = require("./config/db");
const app = express();

//Connect DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Define Routes
app.use("/api/users", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profiles", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/post"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
