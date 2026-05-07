import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import studentRoute  from "./routes/studentRoutes.js";
import connectDB from "./config/db.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Server running 🚀");
});

app.use("/api", studentRoute);
connectDB();

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});