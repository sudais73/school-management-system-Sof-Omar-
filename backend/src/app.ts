import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import classesRoutes from "./modules/classes/classes.routes";
import subjectsRoutes from "./modules/subjects/subjects.routes";
import teachersRoutes from "./modules/teachers/teachers.routes";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/teachers", teachersRoutes);


export default app;