export function OfflineStrip() {
  return (
    <section id="offline" className="mx-auto max-w-6xl px-8">
      <div className="grid grid-cols-1 items-center gap-10 rounded-[20px] bg-ink px-8 py-12 md:grid-cols-[1fr_auto] md:px-12">
        <div>
          <div className="mb-3 font-mono text-[12.5px] font-medium uppercase tracking-wide text-marigold">
            Offline-first
          </div>
          <h2 className="mb-3 font-serif text-3xl font-semibold tracking-tight text-white">
            Built for how Ethiopian schools actually run
          </h2>
          <p className="max-w-md text-[15.5px] leading-relaxed text-[#C7CEDD]">
            Attendance and grading work without a live connection and sync the moment the network
            returns — designed for low-cost phones and everyday classroom conditions, in English,
            Amharic, and Afaan Oromo.
          </p>
        </div>

        <div className="flex gap-9">
          <div>
            <div className="font-serif text-3xl font-semibold text-marigold">3</div>
            <div className="mt-1 max-w-[120px] text-xs leading-tight text-[#9AA5BD]">
              languages supported
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl font-semibold text-marigold">0</div>
            <div className="mt-1 max-w-[120px] text-xs leading-tight text-[#9AA5BD]">
              connection required to record attendance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
