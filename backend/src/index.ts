import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7777;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Todoist API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
