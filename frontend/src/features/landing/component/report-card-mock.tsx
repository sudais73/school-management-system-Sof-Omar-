const rows = [
  { subject: "Mathematics", grade: 91 },
  { subject: "English", grade: 88 },
  { subject: "Biology", grade: 94 },
  { subject: "Amharic", grade: 85 },
];

export function ReportCardMock() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-ulead-line bg-chalk-card p-6 shadow-[0_24px_50px_-20px_rgba(20,33,61,0.25)]">
      <div className="mb-4 flex items-center justify-between border-b border-ulead-line pb-4">
        <div>
          <div className="font-serif text-base font-semibold text-ink">Term 1 report card</div>
          <div className="mt-0.5 text-xs text-ulead-slate">Selamawit Bekele · Grade 8B</div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-evergreen/10 px-2.5 py-1 text-xs font-semibold text-evergreen-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-evergreen" />
          Synced
        </div>
      </div>

      {rows.map((row) => (
        <div
          key={row.subject}
          className="flex items-center justify-between border-b border-dashed border-ulead-line py-2.5 text-sm last:border-none"
        >
          <span className="font-medium text-ink">{row.subject}</span>
          <span className="rounded-md bg-evergreen/10 px-2.5 py-0.5 font-mono text-[13px] font-medium text-evergreen-deep">
            {row.grade}
          </span>
        </div>
      ))}

      <div className="mt-4 flex items-center justify-between border-t border-ulead-line pt-4">
        <div className="font-serif text-[15px] font-semibold text-ink">
          Rank <span className="font-mono font-medium text-marigold-deep">3 / 42</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ulead-slate">
          <span className="h-1.5 w-1.5 rounded-full bg-marigold" />
          Updated instantly
        </div>
      </div>
    </div>
  );
}
