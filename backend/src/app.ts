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
import feesRoutes from "./modules/fees/fees.routes";
import gradesRoutes from "./modules/grades/grades.routes";
import teacherAttendanceRoutes from "./modules/attendance/attendance.routes";
import parentsRoutes from "./modules/parents/parents.routes";
import conversationsRoutes from "./modules/conversations/conversations.routes";
import resultsRoutes from "./modules/results/results.routes";
import adminAttendanceRoutes from "./modules/admin-attendance/admin-attendance.routes";
import dashboardRoutes from './modules/dashboard/dashboard.routes'
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
app.use("/api/fees", feesRoutes);
app.use("/api/teacher", gradesRoutes);
app.use("/api/teacher", teacherAttendanceRoutes);
app.use("/api/parents", parentsRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/admin/results", resultsRoutes);
app.use("/api/admin/attendance", adminAttendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;