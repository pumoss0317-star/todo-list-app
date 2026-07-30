const VIEWS = [
  { key: "list", label: "リスト" },
  { key: "timeline", label: "タイムライン" },
];

export function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex self-start rounded-lg border border-zinc-200 p-1 dark:border-zinc-800">
      {VIEWS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={view === key}
          className={`h-9 rounded-md px-4 text-sm font-medium transition-colors ${
            view === key
              ? "bg-blue-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
