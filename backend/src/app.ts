import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import classesRoutes from "./modules/classes/classes.routes";
import subjectsRoutes from "./modules/subjects/subjects.routes";
import teachersRoutes from "./modules/teachers/teachers.routes";
import studentsRoutes from "./modules/students/students.routes";
import cookieParser from "cookie-parser";
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
});
app.use(cors({ origin: env.FRONTEND_URL, credentials: true })); // was: app.use(cors())
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/students", studentsRoutes);


export default app;