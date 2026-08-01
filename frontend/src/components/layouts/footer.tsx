export function Footer() {
  return (
    <div className="mx-auto max-w-6xl px-8">
      <footer className="flex items-center justify-between border-t border-ulead-line py-7 text-sm text-ulead-slate">
        <div className="font-serif text-base text-ink">U-Lead</div>
        <div>© {new Date().getFullYear()} U-Lead School Management System</div>
      </footer>
    </div>
  );
}
