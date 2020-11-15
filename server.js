import express from "express";
import connectDB from "./config/db.js";
import usersRouter from "./routes/api/users.js";
import authRouter from "./routes/api/auth.js";
import profileRouter from "./routes/api/profile.js";
import postsRouter from "./routes/api/posts.js";

const app = express();
//Connect Database
connectDB();
app.get("/", (req, res) => res.send("API Running"));

//Middleware
app.use(express.json({ extended: false }));

//Define Routes

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
