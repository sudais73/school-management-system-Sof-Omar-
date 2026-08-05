export function ClassStatusBadge({ status }: { status: "ACTIVE" | "INACTIVE" }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-evergreen/10 text-evergreen-deep" : "bg-red-50 text-red-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-evergreen" : "bg-red-500"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}