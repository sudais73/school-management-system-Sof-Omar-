import { createFileRoute } from "@tanstack/react-router";
import { getAuthState } from "@/lib/auth-store";
import { AdminDashboard } from "#/features/dashboard-home/components/AdminDashboard";
import { TeacherDashboard } from "#/features/dashboard-home/components/TeacherDashboard";
import StudentDashboard from "#/features/dashboard-home/components/StudentDashboard";
import ParentDashboard from "#/features/dashboard-home/components/ParentDashboard";


export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { role } = getAuthState();

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return <AdminDashboard />;
    case "TEACHER":
      return <TeacherDashboard />;
    case "STUDENT":
      return <StudentDashboard />;
    case "PARENT":
      return <ParentDashboard />;
    default:
      return null;
  }
}