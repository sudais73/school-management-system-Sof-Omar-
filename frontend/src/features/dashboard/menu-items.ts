import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  BarChart3,
  DollarSign,
  Megaphone,
  Settings,
  UserCircle,
  School,
  User,
  Video,
  type LucideIcon,
} from "lucide-react";

export type Role = "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "PARENT" | "STUDENT";

export type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[]; // which roles can see this
  plan?: "pro"; // if set, only pro-plan schools see this (badge only for now — no gating yet)
};

export const menuItems: MenuItem[] = [
  // ── MAIN ──────────────────────────────────────────────
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "PARENT", "TEACHER", "STUDENT"],
  },

  // ── SCHOOL ────────────────────────────────────────────
  {
    label: "Student management",
    href: "/dashboard/students",
    icon: School,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Staff management",
    href: "/dashboard/teachers",
    icon: User,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Fee Management",
    href: "/dashboard/fees",
    icon: DollarSign,
    roles: ["SUPER_ADMIN"],
    plan: "pro",
  },
  {
    label: "View Results",
    href: "/dashboard/results",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "My Children",
    href: "/dashboard/my-children",
    icon: Users,
    roles: ["PARENT"],
  },
  {
    label: "Result Entry",
    href: "/dashboard/teacher/my-classes",
    icon: Users,
    roles: ["TEACHER"],
  },
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: ClipboardList,
    roles: ["TEACHER"],
  },
  {
    label: "Attendance",
    href: "/dashboard/attendance/overview",
    icon: ClipboardList,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "Classes",
    href: "/dashboard/classes",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "Subjects",
    href: "/dashboard/subjects",
    icon: GraduationCap,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },

  // ── ACADEMIC / COMMUNICATION ──────────────────────────
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: BookOpen,
    roles: ["SUPER_ADMIN", "TEACHER", "PARENT"],
  },
  {
    label: "Live Classes",
    href: "/dashboard/live-classes",
    icon: Video,
    roles: ["SUPER_ADMIN", "TEACHER", "PARENT", "STUDENT"],
    plan: "pro",
  },
  {
    label: "Announcements",
    href: "/dashboard/announcements",
    icon: Megaphone,
    roles: ["SUPER_ADMIN", "TEACHER", "PARENT", "STUDENT"],
  },

  // ── ACCOUNT ───────────────────────────────────────────
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT", "STUDENT"],
  },
  {
    label: "Settings",
    href: "/dashboard/account-settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT", "STUDENT"],
  },
];
