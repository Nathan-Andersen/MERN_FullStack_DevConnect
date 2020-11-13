import express from "express";
import connectDB from "./config/db.js";

const app = express();
//Connect Database
connectDB();
app.get("/", (req, res) => res.send("API Running"));

//Define Routes
import usersRouter from "./routes/api/users.js";
app.use("/api/users", usersRouter);
import authRouter from "./routes/api/auth.js";
app.use("/api/auth", authRouter);
import profileRouter from "./routes/api/profile.js";
app.use("/api/profile", profileRouter);
import postsRouter from "./routes/api/posts.js";
app.use("/api/posts", postsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
